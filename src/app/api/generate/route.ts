import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { genAI } from "../../../lib/geminiClient";
import { prisma } from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Check user quota
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Check if user has exceeded quota
    if (user.quotaUsed >= user.quotaLimit) {
      return new Response(JSON.stringify({ error: "Quota exceeded" }), { status: 429 });
    }

    const formData = await req.formData();
    const type = formData.get("type") as string;
    let content = "";

    if (type === "file") {
      const file = formData.get("file") as File;
      if (!file) {
        return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
      }

      // For demo purposes, we'll just read text files
      // In production, you'd handle audio/video transcription here
      if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        content = await file.text();
      } else {
        // Mock transcription for audio/video files
        content = `Mock transcription of ${file.name}:\n\nThis is a placeholder transcript. In a real application, you would use OpenAI Whisper or similar service to transcribe audio/video files.`;
      }
    } else {
      content = formData.get("text") as string;
    }

    if (!content || content.trim().length === 0) {
      return new Response(JSON.stringify({ error: "No content provided" }), { status: 400 });
    }

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a content repurposing expert. Take the following content and create 4 different formats:

1. SOCIAL MEDIA POSTS (Twitter, Instagram, Facebook) - 3-5 engaging posts with hashtags
2. EMAIL NEWSLETTER - A professional newsletter format with subject line
3. LINKEDIN THREAD - A professional LinkedIn thread (5-7 tweets)
4. YOUTUBE SCRIPT - A YouTube Shorts script (60-90 seconds)

Content to repurpose:
${content}

Please format your response as JSON with these exact keys:
{
  "social": "Social media posts here...",
  "email": "Email newsletter here...",
  "linkedin": "LinkedIn thread here...",
  "youtube": "YouTube script here..."
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    // Try to parse JSON response, fallback to structured text if needed
    let generatedContent;
    try {
      generatedContent = JSON.parse(response);
    } catch {
      // Fallback if Gemini doesn't return valid JSON
      generatedContent = {
        social: `Social Media Posts:\n\n${response.substring(0, 500)}...`,
        email: `Email Newsletter:\n\n${response.substring(500, 1000)}...`,
        linkedin: `LinkedIn Thread:\n\n${response.substring(1000, 1500)}...`,
        youtube: `YouTube Script:\n\n${response.substring(1500)}...`
      };
    }

    // Save generation to database
    const upload = await prisma.upload.create({
      data: {
        userId: session.user.id,
        title: `Generated Content - ${new Date().toLocaleDateString()}`,
        type: type === "file" ? "file" : "text",
        content: content.substring(0, 1000), // Store first 1000 chars
        status: "completed"
      }
    });

    // Save each generation type
    const generationTypes = ["social", "email", "linkedin", "youtube"];
    for (const genType of generationTypes) {
      await prisma.generation.create({
        data: {
          userId: session.user.id,
          uploadId: upload.id,
          type: genType,
          content: generatedContent[genType] || "No content generated",
          tokensUsed: Math.floor(Math.random() * 1000) + 500 // Mock token usage
        }
      });
    }

    // Update user quota
    await prisma.user.update({
      where: { id: session.user.id },
      data: { quotaUsed: user.quotaUsed + 1 }
    });

    return new Response(JSON.stringify(generatedContent), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Generation error:", err);
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), { status: 500 });
  }
}
