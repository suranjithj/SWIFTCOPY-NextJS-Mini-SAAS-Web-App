"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";
import { Modal } from "@/components/Modal";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show modal for first-time visitors
    const hasSeenModal = localStorage.getItem("hasSeenModal");
    if (!hasSeenModal) {
      setShowModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem("hasSeenModal", "true");
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.1),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.1),transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
             SwiftCopy - Create more, faster
          </span>
          <h1 className="mt-8 text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Repurpose your content in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              seconds
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Turn blogs, podcasts, and videos into threads, newsletters, scripts, and captions with AI-powered generation.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/pages/post">Make Post</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why choose SwiftCopy?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful AI-driven content repurposing that saves you time and boosts engagement.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <CardTitle>Multi-format Support</CardTitle>
              </CardHeader>
              <CardContent>
                Upload text, audio, or video files. We handle transcription and processing automatically.
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <CardTitle>AI-Powered Generation</CardTitle>
              </CardHeader>
              <CardContent>
                Gemini AI creates tailored social posts, newsletters, LinkedIn threads, and YouTube scripts.
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle>Built to Scale</CardTitle>
              </CardHeader>
              <CardContent>
                Start free with 20 generations per month. Upgrade for higher quotas and premium features.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Three simple steps to transform your content
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload or Paste",
                description: "Drop your file or paste a transcript. We'll transcribe audio/video automatically.",
                icon: ""
              },
              {
                step: "2", 
                title: "Generate",
                description: "AI analyzes your content and creates multiple repurposed drafts instantly.",
                icon: ""
              },
              {
                step: "3",
                title: "Edit & Export", 
                description: "Tweak the copy, then copy to clipboard or download as PDF.",
                icon: ""
              }
            ].map((item, index) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {item.description}
                </p>
                <div className="text-4xl mb-4">{item.icon}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/pages/post">Try it now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your content?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who save hours every week with SwiftCopy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/pages/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Welcome to SwiftCopy!"
        className="max-w-md"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Get started free!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Transform your content into engaging social media posts, newsletters, and more with AI.
          </p>
          <div className="flex flex-col gap-3">
            <Button className="w-full" asChild>
              <Link href="/signup">Sign Up Free</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/pages/post">Try Demo</Link>
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
