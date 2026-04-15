import { NextRequest, NextResponse } from "next/server";
import { transfer } from "@/lib/locus";

export async function POST(request: NextRequest) {
  const apiKey = process.env.LOCUS_API_KEY || "";
  const { to_address, amount, memo } = await request.json();

  if (!to_address || !amount || !memo) {
    return NextResponse.json({ error: "Missing required fields: to_address, amount, memo" }, { status: 400 });
  }

  const result = await transfer(apiKey, to_address, amount, memo);
  return NextResponse.json(result);
}
