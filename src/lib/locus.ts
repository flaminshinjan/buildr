const LOCUS_BASE_URL = "https://api.paywithlocus.com/api";

interface LocusResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface BalanceData {
  balance: string;
  token: string;
  wallet_address: string;
}

interface SendData {
  transaction_id: string;
  queue_job_id: string;
  status: string;
  from_address: string;
  to_address: string;
  amount: number;
  token: string;
}

interface TransactionData {
  id: string;
  from_address: string;
  to_address: string;
  amount: number;
  token: string;
  memo: string;
  status: string;
  created_at: string;
}

export async function getWalletBalance(apiKey: string): Promise<{ balance: number; currency: string; wallet_address: string }> {
  try {
    const res = await fetch(`${LOCUS_BASE_URL}/pay/balance`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[Locus] Balance check failed:", res.status, err);
      return { balance: 0, currency: "USDC", wallet_address: "" };
    }
    const json: LocusResponse<BalanceData> = await res.json();
    if (!json.success || !json.data) {
      return { balance: 0, currency: "USDC", wallet_address: "" };
    }
    return {
      balance: parseFloat(json.data.balance) || 0,
      currency: json.data.token || "USDC",
      wallet_address: json.data.wallet_address || "",
    };
  } catch (err) {
    console.error("[Locus] Balance error:", err);
    return { balance: 0, currency: "USDC", wallet_address: "" };
  }
}

export async function transfer(
  apiKey: string,
  toAddress: string,
  amount: number,
  memo: string
): Promise<{ success: boolean; tx_id: string; status: string }> {
  try {
    const res = await fetch(`${LOCUS_BASE_URL}/pay/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to_address: toAddress,
        amount,
        memo,
      }),
    });

    const json: LocusResponse<SendData> = await res.json();

    if (!res.ok || !json.success || !json.data) {
      console.error("[Locus] Transfer failed:", res.status, json);
      return {
        success: false,
        tx_id: `failed_${crypto.randomUUID().slice(0, 8)}`,
        status: "failed",
      };
    }

    return {
      success: true,
      tx_id: json.data.transaction_id,
      status: json.data.status || "QUEUED",
    };
  } catch (err) {
    console.error("[Locus] Transfer error:", err);
    return {
      success: false,
      tx_id: `error_${crypto.randomUUID().slice(0, 8)}`,
      status: "error",
    };
  }
}

export async function getTransactions(apiKey: string): Promise<TransactionData[]> {
  try {
    const res = await fetch(`${LOCUS_BASE_URL}/pay/transactions`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return [];
    const json: LocusResponse<TransactionData[]> = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function getTransaction(apiKey: string, txId: string): Promise<TransactionData | null> {
  try {
    const res = await fetch(`${LOCUS_BASE_URL}/pay/transactions/${txId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return null;
    const json: LocusResponse<TransactionData> = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function checkoutPreflight(apiKey: string, sessionId: string) {
  try {
    const res = await fetch(`${LOCUS_BASE_URL}/checkout/agent/preflight/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function payCheckout(apiKey: string, sessionId: string) {
  try {
    const res = await fetch(`${LOCUS_BASE_URL}/checkout/agent/pay/${sessionId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      console.error("[Locus] Checkout pay failed:", res.status, json);
      return null;
    }
    return json.data || null;
  } catch (err) {
    console.error("[Locus] Checkout error:", err);
    return null;
  }
}

export async function getCheckoutPaymentStatus(apiKey: string, txId: string) {
  try {
    const res = await fetch(`${LOCUS_BASE_URL}/checkout/agent/payments/${txId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}
