import { NextRequest, NextResponse } from "next/server";
import { transfer } from "@/lib/locus";

export async function POST(request: NextRequest) {
  const apiKey = process.env.LOCUS_API_KEY || "";
  const { to_wallet, amount, justification } = await request.json();

  if (!to_wallet || !amount || !justification) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await transfer(apiKey, to_wallet, amount, justification);
  return NextResponse.json(result);
}
