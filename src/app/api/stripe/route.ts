import { headers } from "next/headers";
import { stripe } from "../../../lib/stripeClient";

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
        // handle subscription activation
        break;
      default:
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (err: any) {
    return new Response(`Webhook Error: ${err?.message || "unknown"}`, { status: 400 });
  }
} 