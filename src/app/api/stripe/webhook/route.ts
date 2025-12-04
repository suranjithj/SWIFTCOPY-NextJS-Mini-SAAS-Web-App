import { headers } from "next/headers";
import { stripe } from "@/lib/stripeClient";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  if (!sig || !webhookSecret) {
    return new Response("Missing signature or secret", { status: 400 });
  }

  const body = await req.text();

  try {
    const event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (userId) {
          // Update user subscription status
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionId: session.subscription as string,
              planId: session.metadata?.planId,
            },
          });
        }
        break;

      case "customer.subscription.updated":
        const subscription = event.data.object;
        // Handle subscription updates
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;
        // Handle subscription cancellation
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response("ok", { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return new Response(`Webhook Error: ${err?.message || "unknown"}`, { status: 400 });
  }
}