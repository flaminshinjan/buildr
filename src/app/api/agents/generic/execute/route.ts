import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  const result = `Processed: ${text.slice(0, 200)}${text.length > 200 ? '...' : ''}`;

  return Response.json({ result });
}
