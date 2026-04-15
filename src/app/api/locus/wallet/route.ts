import { NextResponse } from "next/server";
import { getWalletBalance } from "@/lib/locus";

export async function GET() {
  const apiKey = process.env.LOCUS_API_KEY || "";
  const balance = await getWalletBalance(apiKey);
  return NextResponse.json(balance);
}
