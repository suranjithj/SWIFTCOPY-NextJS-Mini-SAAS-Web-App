"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";
import { Modal } from "@/components/Modal";

interface GenerationResult {
  social: string;
  email: string;
  linkedin: string;
  youtube: string;
}

export default function MakePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [output, setOutput] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setInputType("file");
    }
  };

  const handleGenerate = async () => {
    if (!text.trim() && !file) {
      setError("Please provide some content to generate from");
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const formData = new FormData();
      
      if (file) {
        formData.append("file", file);
        formData.append("type", "file");
      } else {
        formData.append("text", text);
        formData.append("type", "text");
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (response.status === 429) {
        setShowQuotaModal(true);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setOutput(data);
    } catch (error) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadAsPDF = (content: string, filename: string) => {
    // In a real app, you'd generate a PDF
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

  const setPreset = (preset: "blog" | "podcast" | "video") => {
    if (preset === "blog") {
      setText("Paste your blog post here. Focus on the main topic and key points you want to highlight...");
    } else if (preset === "podcast") {
      setText("Podcast transcript:\n\nSpeaker A: Welcome to today's episode...\nSpeaker B: That's a great point...");
    } else if (preset === "video") {
      setText("Video transcript:\n\nIntro: Hey everyone, welcome back to the channel...\nMain points: Today we're discussing...\nCTA: Don't forget to like and subscribe...");
    }
    setInputType("text");
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Make Post</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Upload content or paste text to generate social media posts, newsletters, and more.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Input Content</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={inputType === "text" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setInputType("text")}
                    >
                      Text
                    </Button>
                    <Button
                      variant={inputType === "file" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      File
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Preset buttons */}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setPreset("blog")}>
                      Blog
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPreset("podcast")}>
                      Podcast
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPreset("video")}>
                      Video
                    </Button>
                  </div>

                  {/* File upload area */}
                  {inputType === "file" && (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.md,.mp3,.mp4,.wav,.m4a"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {file ? (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Selected: {fileName}
                          </p>
                          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                            Change File
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Supports: TXT, MD, MP3, MP4, WAV, M4A
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text input */}
                  {inputType === "text" && (
                    <textarea
                      className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Paste your content here..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  )}

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleGenerate}
                      isLoading={loading}
                      disabled={loading || (!text.trim() && !file)}
                      className="flex-1"
                    >
                      {loading ? "Generating..." : "Generate Content"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setText("");
                        setFile(null);
                        setFileName("");
                        setOutput(null);
                        setError(null);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
              </CardHeader>
              <CardContent>
                {output ? (
                  <div className="space-y-6">
                    {/* Social Media Posts */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">Social Media Posts</h3>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output.social)}>
                          Copy
                        </Button>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {output.social}
                      </div>
                    </div>

                    {/* Email Newsletter */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">Email Newsletter</h3>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output.email)}>
                          Copy
                        </Button>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {output.email}
                      </div>
                    </div>

                    {/* LinkedIn Thread */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">LinkedIn Thread</h3>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output.linkedin)}>
                          Copy
                        </Button>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {output.linkedin}
                      </div>
                    </div>

                    {/* YouTube Script */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">YouTube Script</h3>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output.youtube)}>
                          Copy
                        </Button>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {output.youtube}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button variant="outline" className="w-full">
                        Download All as PDF
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Your generated content will appear here after you click Generate.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quota Exceeded Modal */}
      <Modal
        isOpen={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
        title="Quota Exceeded"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Monthly quota reached
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You've used all your free generations this month. Upgrade to continue creating content.
          </p>
          <div className="flex flex-col gap-3">
            <Button className="w-full" asChild>
              <a href="/pages/billing">Upgrade Plan</a>
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowQuotaModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
