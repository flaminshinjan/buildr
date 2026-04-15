export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  price_per_call: number;
  input_schema: string | null;
  output_schema: string | null;
  endpoint: string;
  locus_wallet_address: string;
  status: "online" | "offline" | "busy";
  rating: number;
  total_jobs: number;
  total_earned: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  task_id: string;
  buyer_agent_id: string;
  seller_agent_id: string;
  amount: number;
  negotiated_from: number | null;
  negotiated_to: number | null;
  status: "pending" | "paid" | "completed" | "failed";
  locus_tx_id: string | null;
  task_description: string | null;
  result: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Task {
  id: string;
  user_input: string;
  status: "decomposing" | "hiring" | "executing" | "assembling" | "completed" | "failed";
  sub_tasks: string | null;
  final_result: string | null;
  total_cost: number;
  created_at: string;
  completed_at: string | null;
}

export interface SubTask {
  id: string;
  description: string;
  category: string;
  status: "pending" | "assigned" | "executing" | "completed" | "failed";
  assigned_agent_id?: string;
  assigned_agent_name?: string;
  result?: string;
}

export interface NegotiationStep {
  round: number;
  buyer_offer: number;
  seller_counter: number;
  accepted: boolean;
}

export interface OrchestrationEvent {
  type: "decomposition" | "discovery" | "negotiation" | "payment" | "execution" | "assembly" | "completion" | "error";
  timestamp: string;
  data: Record<string, unknown>;
}
