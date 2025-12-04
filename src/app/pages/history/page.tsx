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
  createdAt: string;
  content: string;
  status: "completed" | "processing" | "failed";
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "social" | "email" | "linkedin" | "youtube">("all");

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

  useEffect(() => {
    // Mock data for demo
    setGenerations([
      {
        id: "1",
        title: "Blog to Twitter Thread",
        type: "social",
        createdAt: "2024-01-15T10:30:00Z",
        content: "Generated Twitter thread from blog post...",
        status: "completed"
      },
      {
        id: "2", 
        title: "Podcast to LinkedIn Post",
        type: "linkedin",
        createdAt: "2024-01-14T15:45:00Z",
        content: "Generated LinkedIn post from podcast...",
        status: "completed"
      },
      {
        id: "3",
        title: "Video to Email Newsletter",
        type: "email",
        createdAt: "2024-01-13T09:15:00Z",
        content: "Generated email newsletter from video...",
        status: "completed"
      },
      {
        id: "4",
        title: "Blog to YouTube Script",
        type: "youtube",
        createdAt: "2024-01-12T14:20:00Z",
        content: "Generated YouTube script from blog...",
        status: "completed"
      }
    ]);
    setIsLoading(false);
  }, []);

  const filteredGenerations = filter === "all" 
    ? generations 
    : generations.filter(gen => gen.type === filter);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadContent = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      social: "📱",
      email: "📧",
      linkedin: "💼",
      youtube: "🎥"
    };
    return icons[type as keyof typeof icons] || "📄";
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      social: "Social Media",
      email: "Email Newsletter",
      linkedin: "LinkedIn Post",
      youtube: "YouTube Script"
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content History</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              View and manage your generated content
            </p>
          </header>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All ({generations.length})
              </Button>
              <Button
                variant={filter === "social" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("social")}
              >
                Social ({generations.filter(g => g.type === "social").length})
              </Button>
              <Button
                variant={filter === "email" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("email")}
              >
                Email ({generations.filter(g => g.type === "email").length})
              </Button>
              <Button
                variant={filter === "linkedin" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("linkedin")}
              >
                LinkedIn ({generations.filter(g => g.type === "linkedin").length})
              </Button>
              <Button
                variant={filter === "youtube" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("youtube")}
              >
                YouTube ({generations.filter(g => g.type === "youtube").length})
              </Button>
            </div>
          </div>

          {/* Content List */}
          {filteredGenerations.length > 0 ? (
            <div className="space-y-4">
              {filteredGenerations.map((generation) => (
                <Card key={generation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-2xl">{getTypeIcon(generation.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {generation.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {getTypeLabel(generation.type)} • {new Date(generation.createdAt).toLocaleDateString()}
                          </p>
                          <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                            {generation.content.substring(0, 150)}...
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generation.content)}
                        >
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadContent(generation.content, generation.title)}
                        >
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No content found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {filter === "all" 
                    ? "You haven't generated any content yet." 
                    : `No ${filter} content found.`}
                </p>
                <Button asChild>
                  <a href="/pages/post">Create Your First Post</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}