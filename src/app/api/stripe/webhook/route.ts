import { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;

      case "customer.subscription.updated":
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return new Response("Webhook processing failed", { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  if (!userId || !planId) {
    console.error("Missing metadata in checkout session");
    return;
  }

  // Update user's subscription
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      status: "active",
      planId: planId,
    },
    create: {
      userId,
      planId,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      status: "active",
    },
  });

  // Update user's quota limit
  const quotaLimit = planId === "pro" ? -1 : planId === "enterprise" ? -1 : 20;
  await prisma.user.update({
    where: { id: userId },
    data: { quotaLimit },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Update subscription status
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Cancel subscription
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: "canceled" },
  });

  // Reset user to free plan
  const user = await prisma.user.findFirst({
    where: {
      subscription: {
        stripeSubscriptionId: subscription.id,
      },
    },
  });

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { quotaLimit: 20 },
    });
  }
}
