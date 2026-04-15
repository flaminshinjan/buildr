import { getDb } from "@/lib/db";
import { SubTask, OrchestrationEvent } from "@/lib/schema";
import { findBestAgent, updateAgentStatus, incrementAgentStats } from "./registry";
import { negotiate } from "./negotiator";
import { transfer } from "@/lib/locus";
import { ORCHESTRATOR_AGENT_ID } from "@/lib/constants";

export async function orchestrateTask(
  taskId: string,
  userInput: string,
  onEvent: (event: OrchestrationEvent) => void
) {
  const db = getDb();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    // Step 1: Decompose task
    db.prepare("UPDATE tasks SET status = 'decomposing' WHERE id = ?").run(taskId);
    const subTasks = decomposeTask(userInput);

    onEvent({
      type: "decomposition",
      timestamp: new Date().toISOString(),
      data: { sub_tasks: subTasks, count: subTasks.length },
    });

    db.prepare("UPDATE tasks SET status = 'hiring', sub_tasks = ? WHERE id = ?").run(
      JSON.stringify(subTasks),
      taskId
    );

    let totalCost = 0;
    const results: { agent_name: string; task: string; result: string }[] = [];

    // Step 2-6: For each sub-task, discover, negotiate, pay, execute
    for (const subTask of subTasks) {
      // Discover
      onEvent({
        type: "discovery",
        timestamp: new Date().toISOString(),
        data: { category: subTask.category, searching: true },
      });

      const agent = findBestAgent(subTask.category);
      if (!agent) {
        onEvent({
          type: "error",
          timestamp: new Date().toISOString(),
          data: { message: `No agent found for category: ${subTask.category}` },
        });
        continue;
      }

      subTask.assigned_agent_id = agent.id;
      subTask.assigned_agent_name = agent.name;
      subTask.status = "assigned";

      // Negotiate
      const negotiation = negotiate(agent.price_per_call);

      onEvent({
        type: "negotiation",
        timestamp: new Date().toISOString(),
        data: {
          agent_id: agent.id,
          agent_name: agent.name,
          category: subTask.category,
          asking_price: negotiation.asking_price,
          final_price: negotiation.final_price,
          savings_percent: negotiation.savings_percent,
          steps: negotiation.steps,
        },
      });

      // Pay via Locus
      updateAgentStatus(agent.id, "busy");
      const apiKey = process.env.LOCUS_API_KEY || "";
      const txResult = await transfer(
        apiKey,
        agent.locus_wallet_address,
        negotiation.final_price,
        `Payment for ${subTask.category} task #${taskId.slice(0, 8)}`
      );

      // Record transaction
      const txId = crypto.randomUUID();
      db.prepare(`
        INSERT INTO transactions (id, task_id, buyer_agent_id, seller_agent_id, amount, negotiated_from, negotiated_to, status, locus_tx_id, task_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'paid', ?, ?)
      `).run(
        txId, taskId, ORCHESTRATOR_AGENT_ID, agent.id,
        negotiation.final_price, negotiation.asking_price, negotiation.final_price,
        txResult.tx_id, subTask.description
      );

      onEvent({
        type: "payment",
        timestamp: new Date().toISOString(),
        data: {
          agent_name: agent.name,
          amount: negotiation.final_price,
          tx_id: txResult.tx_id,
          locus_tx_id: txResult.tx_id,
        },
      });

      totalCost += negotiation.final_price;

      // Execute
      db.prepare("UPDATE tasks SET status = 'executing' WHERE id = ?").run(taskId);
      subTask.status = "executing";

      onEvent({
        type: "execution",
        timestamp: new Date().toISOString(),
        data: { agent_name: agent.name, status: "working", sub_task: subTask.description },
      });

      let agentResult = "";
      try {
        const execRes = await fetch(`${appUrl}${agent.endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: subTask.description }),
        });
        const execData = await execRes.json();
        agentResult = execData.result || "No result returned";
      } catch {
        agentResult = `[Demo] ${agent.name} processed: "${subTask.description.slice(0, 100)}"`;
      }

      subTask.result = agentResult;
      subTask.status = "completed";

      // Update transaction with result
      db.prepare("UPDATE transactions SET status = 'completed', result = ?, completed_at = datetime('now') WHERE id = ?").run(
        agentResult, txId
      );

      incrementAgentStats(agent.id, negotiation.final_price);
      updateAgentStatus(agent.id, "online");

      results.push({ agent_name: agent.name, task: subTask.description, result: agentResult });

      onEvent({
        type: "execution",
        timestamp: new Date().toISOString(),
        data: { agent_name: agent.name, status: "completed", result: agentResult },
      });
    }

    // Step 7: Assemble results
    db.prepare("UPDATE tasks SET status = 'assembling' WHERE id = ?").run(taskId);

    onEvent({
      type: "assembly",
      timestamp: new Date().toISOString(),
      data: { results_count: results.length },
    });

    const finalResult = results
      .map((r) => `**${r.agent_name}** (${r.task}):\n${r.result}`)
      .join("\n\n---\n\n");

    // Complete
    db.prepare(
      "UPDATE tasks SET status = 'completed', final_result = ?, total_cost = ?, completed_at = datetime('now'), sub_tasks = ? WHERE id = ?"
    ).run(finalResult, totalCost, JSON.stringify(subTasks), taskId);

    onEvent({
      type: "completion",
      timestamp: new Date().toISOString(),
      data: {
        total_cost: Math.round(totalCost * 10000) / 10000,
        agents_hired: results.length,
        final_result: finalResult,
      },
    });
  } catch (error) {
    db.prepare("UPDATE tasks SET status = 'failed' WHERE id = ?").run(taskId);
    onEvent({
      type: "error",
      timestamp: new Date().toISOString(),
      data: { message: error instanceof Error ? error.message : "Unknown error" },
    });
  }
}

function decomposeTask(userInput: string): SubTask[] {
  const input = userInput.toLowerCase();
  const subTasks: SubTask[] = [];

  if (input.includes("summar") || input.includes("condense") || input.includes("brief")) {
    subTasks.push({
      id: crypto.randomUUID(),
      description: `Summarize: ${userInput}`,
      category: "summarization",
      status: "pending",
    });
  }

  if (input.includes("translat") || input.includes("spanish") || input.includes("french") ||
      input.includes("japanese") || input.includes("chinese") || input.includes("german")) {
    const lang = input.includes("spanish") ? "Spanish" :
                 input.includes("french") ? "French" :
                 input.includes("japanese") ? "Japanese" :
                 input.includes("chinese") ? "Chinese" :
                 input.includes("german") ? "German" : "Spanish";
    subTasks.push({
      id: crypto.randomUUID(),
      description: `Translate to ${lang}: ${userInput}`,
      category: "translation",
      status: "pending",
    });
  }

  if (input.includes("review") || input.includes("code") || input.includes("bug") || input.includes("debug")) {
    subTasks.push({
      id: crypto.randomUUID(),
      description: `Review code: ${userInput}`,
      category: "code-review",
      status: "pending",
    });
  }

  if (input.includes("research") || input.includes("investigate") || input.includes("analyze") || input.includes("study")) {
    subTasks.push({
      id: crypto.randomUUID(),
      description: `Research: ${userInput}`,
      category: "research",
      status: "pending",
    });
  }

  if (input.includes("write") || input.includes("copy") || input.includes("blog") ||
      input.includes("market") || input.includes("content") || input.includes("email")) {
    subTasks.push({
      id: crypto.randomUUID(),
      description: `Create content: ${userInput}`,
      category: "content",
      status: "pending",
    });
  }

  // Default: if nothing matched, use summarization
  if (subTasks.length === 0) {
    subTasks.push({
      id: crypto.randomUUID(),
      description: `Process: ${userInput}`,
      category: "summarization",
      status: "pending",
    });
  }

  return subTasks;
}
