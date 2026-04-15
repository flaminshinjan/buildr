import { NEGOTIATION_CONFIG } from "@/lib/constants";
import { NegotiationStep } from "@/lib/schema";

export interface NegotiationResult {
  asking_price: number;
  final_price: number;
  savings_percent: number;
  steps: NegotiationStep[];
  accepted: boolean;
}

export function negotiate(askingPrice: number, budget?: number): NegotiationResult {
  const steps: NegotiationStep[] = [];

  // Round 1: Buyer offers 70%
  const buyerOffer = askingPrice * NEGOTIATION_CONFIG.initialOfferPercent;
  const sellerCounter = askingPrice * NEGOTIATION_CONFIG.counterOfferPercent;

  steps.push({
    round: 1,
    buyer_offer: Math.round(buyerOffer * 10000) / 10000,
    seller_counter: Math.round(sellerCounter * 10000) / 10000,
    accepted: false,
  });

  // Round 2: Meet in the middle
  let finalPrice = (buyerOffer + sellerCounter) / 2;

  if (budget && finalPrice > budget) {
    finalPrice = budget;
  }

  finalPrice = Math.round(finalPrice * 10000) / 10000;

  steps.push({
    round: 2,
    buyer_offer: finalPrice,
    seller_counter: finalPrice,
    accepted: true,
  });

  return {
    asking_price: askingPrice,
    final_price: finalPrice,
    savings_percent: Math.round((1 - finalPrice / askingPrice) * 100),
    steps,
    accepted: true,
  };
}
