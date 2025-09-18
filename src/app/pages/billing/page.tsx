"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  quota: number;
  features: string[];
  popular?: boolean;
}

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState("free");
  const [usage, setUsage] = useState({ used: 0, limit: 20 });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading") {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
      </MainLayout>
    );
  }

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "month",
      quota: 20,
      features: [
        "20 generations per month",
        "Basic content templates",
        "Email support",
        "Standard processing speed"
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      period: "month",
      quota: -1, // Unlimited
      features: [
        "Unlimited generations",
        "Advanced content templates",
        "Priority support",
        "API access",
        "Custom branding",
        "Advanced analytics"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99,
      period: "month",
      quota: -1,
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom integrations",
        "White-label solution",
        "SLA guarantee",
        "On-premise deployment"
      ]
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return;
    
    setIsLoading(true);
    try {
      // In a real app, you'd redirect to Stripe checkout
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        console.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPlanData = plans.find(plan => plan.id === currentPlan);

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Plans</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage your subscription and billing information
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Plan */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {currentPlanData?.name}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      ${currentPlanData?.price}
                      <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                        /{currentPlanData?.period}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {currentPlanData?.quota === -1 ? "Unlimited" : `${currentPlanData?.quota} generations`}
                    </div>
                    <div className="w-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                      Active
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Usage */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Generations Used</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {usage.used} / {usage.limit === -1 ? "" : usage.limit}
                      </span>
                    </div>
                    {usage.limit !== -1 && (
                      <>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300" 
                            style={{width: `${Math.min((usage.used / usage.limit) * 100, 100)}%`}}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Resets on {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Available Plans */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Available Plans
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`relative ${plan.popular ? "ring-2 ring-blue-500" : ""} ${
                      plan.id === currentPlan ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader>
                      <div className="text-center">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="mt-2">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            ${plan.price}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {plan.quota === -1 ? "Unlimited" : `${plan.quota} generations`}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {plan.id === currentPlan ? (
                        <Button className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={() => handleUpgrade(plan.id)}
                          isLoading={isLoading}
                          variant={plan.popular ? "primary" : "outline"}
                        >
                          {plan.price === 0 ? "Downgrade" : "Upgrade"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 text-sm font-medium text-gray-900 dark:text-white">Date</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-900 dark:text-white">Description</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-900 dark:text-white">Amount</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-900 dark:text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                          Free Plan
                        </td>
                        <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                          $0.00
                        </td>
                        <td className="py-3 text-sm">
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded text-xs">
                            Active
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens to unused generations?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Unused generations don't roll over to the next month. Your quota resets on the first of each month.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a free trial?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes! Start with our free plan that includes 20 generations per month. No credit card required.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
