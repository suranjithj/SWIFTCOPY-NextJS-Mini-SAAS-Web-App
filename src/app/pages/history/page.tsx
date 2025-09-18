"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";

interface Generation {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
  upload: {
    content: string;
  };
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchGenerations();
    }
  }, [status]);

  const fetchGenerations = async () => {
    try {
      // In a real app, you'd fetch from your API
      // const response = await fetch("/api/generations");
      // const data = await response.json();
      
      // Mock data for demo
      setGenerations([
        {
          id: "1",
          title: "Blog to Social Media Posts",
          type: "social",
          content: "Generated social media posts from blog content...",
          createdAt: "2024-01-15",
          upload: {
            content: "How to build a SaaS product from scratch..."
          }
        },
        {
          id: "2",
          title: "Podcast to LinkedIn Thread",
          type: "linkedin", 
          content: "Key insights from my conversation with startup founder...",
          createdAt: "2024-01-14",
          upload: {
            content: "Interview transcript with startup founder discussing..."
          }
        },
        {
          id: "3",
          title: "Video to Newsletter",
          type: "email",
          content: "Newsletter content generated from video transcript...",
          createdAt: "2024-01-13",
          upload: {
            content: "Video transcript about marketing strategies..."
          }
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

  const filteredGenerations = generations.filter(generation => {
    const matchesFilter = filter === "all" || generation.type === filter;
    const matchesSearch = generation.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "social":
        return (
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
      case "linkedin":
        return (
          <svg className="w-5 h-5 text-blue-700 dark:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case "email":
        return (
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "youtube":
        return (
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deleteGeneration = async (id: string) => {
    if (confirm("Are you sure you want to delete this generation?")) {
      try {
        // In a real app, you'd call your API
        // await fetch(`/api/generations/${id}`, { method: "DELETE" });
        setGenerations(generations.filter(g => g.id !== id));
      } catch (error) {
        console.error("Failed to delete generation:", error);
      }
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content History</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              View and manage your generated content
            </p>
          </header>

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {["all", "social", "linkedin", "email", "youtube"].map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFilter(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Generations List */}
          <div className="space-y-6">
            {filteredGenerations.length > 0 ? (
              filteredGenerations.map((generation) => (
                <Card key={generation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          {getTypeIcon(generation.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{generation.title}</CardTitle>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(generation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generation.content)}>
                          Copy
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteGeneration(generation.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Original Content</h4>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto">
                          {generation.upload.content.substring(0, 200)}...
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Generated Content</h4>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto">
                          {generation.content.substring(0, 200)}...
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No content found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchTerm || filter !== "all" 
                      ? "Try adjusting your search or filter criteria."
                      : "Start creating amazing content with AI"
                    }
                  </p>
                  <Button asChild>
                    <a href="/pages/post">Create Your First Post</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
