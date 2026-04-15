import { NextRequest, NextResponse } from "next/server";
import { checkoutPreflight, payCheckout, getCheckoutPaymentStatus } from "@/lib/locus";

export async function GET(request: NextRequest) {
  const apiKey = process.env.LOCUS_API_KEY || "";
  const { searchParams } = new URL(request.url);

  const txId = searchParams.get("tx_id");
  if (txId) {
    const status = await getCheckoutPaymentStatus(apiKey, txId);
    return NextResponse.json(status || { error: "Not found" });
  }

  const sessionId = searchParams.get("session_id");
  if (sessionId) {
    const preflight = await checkoutPreflight(apiKey, sessionId);
    return NextResponse.json(preflight || { error: "Preflight failed" });
  }

  return NextResponse.json({ error: "Provide session_id or tx_id" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.LOCUS_API_KEY || "";
  const { session_id } = await request.json();

  if (!session_id) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const result = await payCheckout(apiKey, session_id);
  return NextResponse.json(result || { error: "Checkout payment failed" });
}
