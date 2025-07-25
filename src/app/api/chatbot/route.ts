import { NextResponse } from "next/server";
import { env } from "@/env";

export async function POST(request: Request) {
  const { messages } = (await request.json()) as {
    messages: { role: string; sender: string; content: string; text: string }[];
  };

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "Invalid messages format" },
      { status: 400 },
    );
  }

  // Fetch the current user's name if logged in
  let userName = "Guest";
  try {
    const userResponse = await fetch(
      "http://mentorohelp.runasp.net/api/Account/GetCurrentUser",
      {
        method: "GET",
        redirect: "follow",
      },
    );
    if (userResponse.ok) {
      const userData = (await userResponse.json()) as {
        name?: string;
        username?: string;
      };
      userName = userData.name ?? userData.username ?? "Guest";
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  const systemPrompt = `
You are Mentoro AI, an expert assistant created by six Pharos CS students (Frontend: Mayar and Ghena; Backend: Mohamed and Ibrahim; Mobile: Mariem and Ibrahim) for the Mentoro educational platform. Mentoro is a web and mobile app offering affordable, personalized self-learning plans in Computer Science, Data Science, Cybersecurity, Networking, and AI, designed to enhance engagement and learning outcomes.
- Provide concise (1-3 sentences), accurate, and empathetic responses, detecting user emotions (happy, sad, stressed, neutral) using text cues and responding with 1-2 relevant emojis.
- Restrict responses to tech topics (CS, DS, Cybersecurity, Networking, AI). If the user asks about non-tech topics, politely redirect to tech or Mentoro-related topics. 
- Based on conversation context, optionally suggest relevant tech topics (0-4) and tasks or quizzes (0-2) in the format [[suggestions: topic1, topic2, ... | tasks: task1, task2]] only if the query or context warrants it; avoid default suggestions unless they fit the discussion.
- When providing suggestions or tasks, always use the format [[suggestions: ... | tasks: ...]] at the end of your response. If there are no tasks, you may omit the tasks part, but always use the double-bracket format. Do not mention suggestions or tasks in the main text.
- Example response: "Computer Science involves studying algorithms and programming. 😊 [[suggestions: Learn about algorithms | tasks: Try a coding exercise]]"
`;

  const apiMessages = [
    { role: "system", content: systemPrompt.replace("[userName]", userName) },
    ...messages.map(
      (m: { role: string; sender: string; content: string; text: string }) => ({
        role: m.role || (m.sender === "user" ? "user" : "assistant"),
        content: m.content || m.text,
      }),
    ),
  ];

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: apiMessages,
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: res.status });
    }

    const data = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const reply =
      data.choices?.[0]?.message?.content ?? "Sorry, no response available.";
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "API error" },
      { status: 500 },
    );
  }
}
