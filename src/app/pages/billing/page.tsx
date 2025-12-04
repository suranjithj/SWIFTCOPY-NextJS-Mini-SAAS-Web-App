"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleUpgrade = async (plan: string) => {
    setIsLoading(true);
    // In a real app, you'd redirect to Stripe checkout
    console.log(`Upgrading to ${plan}`);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Plans</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage your subscription and billing information
            </p>
          </header>

          <div className="space-y-8">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Free Plan</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      20 generations per month
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$0</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">per month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Generations Used</span>
                    <span className="font-medium text-gray-900 dark:text-white">5 / 20</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300" 
                      style={{width: "25%"}}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Free tier limit</span>
                    <span>15 remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Options */}
            <Card>
              <CardHeader>
                <CardTitle>Upgrade Your Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pro Plan</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">$29<span className="text-lg text-gray-600 dark:text-gray-300">/month</span></p>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
                      <li>• Unlimited generations</li>
                      <li>• All content types</li>
                      <li>• Priority support</li>
                      <li>• Advanced templates</li>
                    </ul>
                    <Button 
                      className="w-full" 
                      onClick={() => handleUpgrade("pro")}
                      isLoading={isLoading}
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Enterprise</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">$99<span className="text-lg text-gray-600 dark:text-gray-300">/month</span></p>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
                      <li>• Everything in Pro</li>
                      <li>• Team collaboration</li>
                      <li>• Custom integrations</li>
                      <li>• Dedicated support</li>
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleUpgrade("enterprise")}
                      isLoading={isLoading}
                    >
                      Contact Sales
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No billing history</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    You're currently on the free plan. Upgrade to see your billing history.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}