import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const plans = {
  pro: {
    priceId: "price_pro_monthly", // Replace with actual Stripe price ID
    quota: -1, // Unlimited
  },
  enterprise: {
    priceId: "price_enterprise_monthly", // Replace with actual Stripe price ID
    quota: -1, // Unlimited
  },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { planId } = await req.json();
    
    if (!planId || !plans[planId as keyof typeof plans]) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400 });
    }

    const plan = plans[planId as keyof typeof plans];

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/pages/billing?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pages/billing?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        planId: planId,
      },
    });

    return new Response(JSON.stringify({ url: checkoutSession.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return new Response(JSON.stringify({ error: "Failed to create checkout session" }), { status: 500 });
  }
}
