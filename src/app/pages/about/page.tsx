"use client";

import { MainLayout } from "@/components/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About SwiftCopy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Empowering creators to maximize their content's reach and impact
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <Card className="mb-8">
              <CardContent>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  At SwiftCopy, we believe that great content deserves to reach its full potential. 
                  Our AI-powered platform transforms your existing content into multiple formats, 
                  helping you maximize your reach and engagement across all platforms.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Whether you're a blogger, podcaster, YouTuber, or business owner, SwiftCopy 
                  helps you repurpose your content efficiently and effectively.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardContent>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Content</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Upload your blog posts, podcasts, videos, or paste text directly
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Processing</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Our AI analyzes and transforms your content into multiple formats
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Publish & Share</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Copy, download, or share your repurposed content across platforms
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardContent>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Team</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  SwiftCopy is built by a team of content creators, developers, and AI researchers 
                  who understand the challenges of content marketing. We're passionate about 
                  helping creators focus on what they do best while we handle the repurposing.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Our mission is to democratize content creation and help everyone maximize 
                  their content's potential, regardless of their technical expertise or budget.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get Started</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Ready to transform your content strategy? Join thousands of creators who 
                  are already using SwiftCopy to maximize their content's reach and impact.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/signup" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Start Free Trial
                  </a>
                  <a 
                    href="/pages/pricing" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    View Pricing
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}