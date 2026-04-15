import { NextRequest, NextResponse } from "next/server";
import { NEGOTIATION_CONFIG } from "@/lib/constants";
import { NegotiationStep } from "@/lib/schema";

export async function POST(request: NextRequest) {
  const { asking_price, budget } = await request.json();

  if (!asking_price) {
    return NextResponse.json({ error: "asking_price required" }, { status: 400 });
  }

  const steps: NegotiationStep[] = [];
  let finalPrice = asking_price;

  // Round 1: Buyer offers 70% of asking
  const buyerOffer = asking_price * NEGOTIATION_CONFIG.initialOfferPercent;
  // Round 2: Seller counters at 90%
  const sellerCounter = asking_price * NEGOTIATION_CONFIG.counterOfferPercent;

  steps.push({ round: 1, buyer_offer: buyerOffer, seller_counter: sellerCounter, accepted: false });

  // Round 2: They meet in the middle
  finalPrice = (buyerOffer + sellerCounter) / 2;

  if (budget && finalPrice > budget) {
    finalPrice = budget;
  }

  steps.push({ round: 2, buyer_offer: finalPrice, seller_counter: finalPrice, accepted: true });

  return NextResponse.json({
    asking_price,
    final_price: Math.round(finalPrice * 10000) / 10000,
    savings_percent: Math.round((1 - finalPrice / asking_price) * 100),
    steps,
    accepted: true,
  });
}
