"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";

interface Generation {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  content: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      // Fetch user's generations
      fetchGenerations();
    }
  }, [status, router]);

  const fetchGenerations = async () => {
    try {
      // In a real app, you'd fetch from your API
      // const response = await fetch("/api/generations");
      // const data = await response.json();
      
      // Mock data for demo
      setGenerations([
        {
          id: "1",
          title: "Blog to Twitter Thread",
          type: "social",
          createdAt: "2024-01-15",
          content: "Generated Twitter thread from blog post..."
        },
        {
          id: "2", 
          title: "Podcast to LinkedIn Post",
          type: "linkedin",
          createdAt: "2024-01-14",
          content: "Generated LinkedIn post from podcast..."
        }
      ]);
    } catch (error) {
      console.error("Failed to fetch generations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
      </MainLayout>
    );
  }

  if (!session) {
    return null;
  }

  const stats = {
    totalGenerations: generations.length,
    thisMonth: generations.filter(g => {
      const genDate = new Date(g.createdAt);
      const now = new Date();
      return genDate.getMonth() === now.getMonth() && genDate.getFullYear() === now.getFullYear();
    }).length,
    monthlyLimit: 20,
    plan: "Free"
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Welcome back, {session.user?.name || "User"}! Here's your content generation overview.
            </p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalGenerations}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total Generations
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.thisMonth}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  This Month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.plan}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Current Plan
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.monthlyLimit - stats.thisMonth}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Remaining
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/pages/post">Make New Post</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/pages/history">View History</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/pages/settings">Settings</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/pages/billing">Billing</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Usage Chart */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Generations Used</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {stats.thisMonth} / {stats.monthlyLimit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300" 
                        style={{width: `${Math.min((stats.thisMonth / stats.monthlyLimit) * 100, 100)}%`}}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Free tier limit</span>
                      <span>{stats.monthlyLimit - stats.thisMonth} remaining</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/pages/history">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {generations.length > 0 ? (
                  <div className="space-y-4">
                    {generations.slice(0, 5).map((generation) => (
                      <div key={generation.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{generation.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{generation.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Copy</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No content yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Start creating amazing content with AI</p>
                    <Button asChild>
                      <Link href="/pages/post">Create Your First Post</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upgrade Banner */}
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Upgrade to Pro</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Get unlimited generations, priority support, and advanced features.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/pages/billing">Upgrade Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
