import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { stripe } from "@/lib/stripeClient";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { planId } = await req.json();

    if (!planId) {
      return new Response(JSON.stringify({ error: "Plan ID is required" }), { status: 400 });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pages/billing?canceled=true`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: (session.user as any).id,
      },
    });

    return new Response(JSON.stringify({ url: checkoutSession.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}