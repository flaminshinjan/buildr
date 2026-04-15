import { NextRequest, NextResponse } from "next/server";
import { createCheckout } from "@/lib/locus";

export async function POST(request: NextRequest) {
  const apiKey = process.env.LOCUS_API_KEY || "";
  const { amount, description } = await request.json();

  if (!amount || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await createCheckout(apiKey, amount, description);
  return NextResponse.json(result);
}
