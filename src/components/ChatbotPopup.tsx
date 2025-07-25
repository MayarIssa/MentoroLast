"use client";

import React, { useState, useEffect, useRef } from "react";

// Speech Recognition types
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }
}

interface ChatbotResponse {
  reply: string;
  error?: string;
}

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  emotion?: Emotion;
  suggestions?: string[];
  tasks?: string[];
  language?: "en" | "ar";
}

type Emotion = "happy" | "sad" | "stressed" | "neutral";

const emotionStyles: Record<Emotion, { border: string; emoji: string }> = {
  happy: { border: "border-green-400", emoji: "😊" },
  sad: { border: "border-blue-500", emoji: "😢" },
  stressed: { border: "border-red-500", emoji: "😰" },
  neutral: { border: "border-gray-400", emoji: "😐" },
};

const getTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const detectEmotion = (text: string): Emotion => {
  const lowered = text.toLowerCase();
  if (
    /(happy|great|awesome|excited|fantastic|😊|🙂|😄|😃|love|amazing)/i.test(
      lowered,
    )
  )
    return "happy";
  if (
    /(sad|down|unhappy|depressed|disappointed|😢|😭|sorry|bad)/i.test(lowered)
  )
    return "sad";
  if (
    /(stress|anxious|worried|frustrated|overwhelmed|😰|😟|😥|struggle|hard)/i.test(
      lowered,
    )
  )
    return "stressed";
  return "neutral";
};

const detectLanguage = (text: string): "en" | "ar" => {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text) ? "ar" : "en";
};

export default function ChatbotPopup({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [shouldBotSpeak, setShouldBotSpeak] = useState(true);
  const [speechLang, setSpeechLang] = useState<"en" | "ar">("en");
  const [userName, setUserName] = useState<string>("Guest");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesis =
    typeof window !== "undefined" ? window.speechSynthesis : null;

  // Check for SpeechRecognition support
  const isSpeechSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition ?? window.webkitSpeechRecognition);

  useEffect(() => {
    // Fetch user name on component mount
    const fetchUserName = async () => {
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
          setUserName(userData.name ?? userData.username ?? "Guest");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    void fetchUserName();

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: Message = {
        sender: "bot",
        text: `Hello ${userName}! I'm Mentoro AI, here to help you excel in tech with our affordable, personalized learning platform built by six Pharos CS students (Mayar, Ghena, Mohamed, Ibrahim, Mariem, Ibrahim). Ask me about CS, AI, or cybersecurity! 😊`,
        timestamp: getTimestamp(),
        emotion: "happy",
        language: "en",
      };
      setMessages([initialMessage]);
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (!isSpeechSupported && isVoiceMode) {
      setIsVoiceMode(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Speech recognition is not supported in your browser. Please use text input.",
          timestamp: getTimestamp(),
          emotion: "stressed",
          language: "en",
        },
      ]);
      return;
    }

    if (isVoiceMode) {
      const SpeechRecognitionClass =
        window.SpeechRecognition ?? window.webkitSpeechRecognition;
      if (!SpeechRecognitionClass) {
        setIsVoiceMode(false);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Speech recognition is not supported in your browser. Please use text input.",
            timestamp: getTimestamp(),
            emotion: "stressed",
            language: "en",
          },
        ]);
        return;
      }
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = speechLang === "en" ? "en-US" : "ar-SA";
      recognition.onstart = () => setIsDetecting(true);
      recognition.onend = () => setIsDetecting(false);
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (!transcript) return;
        const language = detectLanguage(transcript);
        setInput(transcript);
        void handleSendMessage(transcript, language);
      };
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsDetecting(false);
        let errorMessage =
          "Speech recognition failed. Please try again or type.";
        switch (event.error) {
          case "network":
            errorMessage =
              "Network issue detected. Please check your connection.";
            break;
          case "language-not-supported":
            errorMessage = `Language ${speechLang === "en" ? "English" : "Arabic"} is not supported. Switching to ${speechLang === "en" ? "Arabic" : "English"}.`;
            setSpeechLang(speechLang === "en" ? "ar" : "en");
            break;
          case "not-allowed":
          case "permission-denied":
            errorMessage =
              "Microphone access denied. Please allow permission in your browser settings.";
            setIsVoiceMode(false);
            break;
          case "no-speech":
            errorMessage = "No speech detected. Please try speaking again.";
            break;
          case "aborted":
            errorMessage = "Speech recognition was aborted. Please try again.";
            break;
        }
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: errorMessage,
            timestamp: getTimestamp(),
            emotion: "stressed",
            language: "en",
          },
        ]);
      };
      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        setIsVoiceMode(false);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Speech recognition failed to start. Check network or browser settings.",
            timestamp: getTimestamp(),
            emotion: "stressed",
            language: "en",
          },
        ]);
      }
    }
    return () => recognitionRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoiceMode, speechLang, isSpeechSupported, userName, messages]);

  useEffect(() => {
    if (!synthesis || !shouldBotSpeak) return;

    const lastMessage = messages[messages.length - 1];
    const lastUserMessage = messages.filter((m) => m.sender === "user").pop();
    if (lastMessage?.sender === "bot" && lastMessage.text) {
      const utterance = new SpeechSynthesisUtterance(lastMessage.text);
      utterance.lang = lastUserMessage?.language === "ar" ? "ar-SA" : "en-US";
      const voices = synthesis.getVoices();
      const targetVoice = voices.find(
        (voice) =>
          voice.lang ===
          (lastUserMessage?.language === "ar" ? "ar-SA" : "en-US"),
      );
      if (targetVoice) utterance.voice = targetVoice;
      utterance.onend = () => synthesis.cancel();
      synthesis.speak(utterance);
    }
  }, [messages, shouldBotSpeak, synthesis]);

  const handleSendMessage = async (
    text: string,
    language: "en" | "ar" = "en",
  ) => {
    if (!text.trim()) return;
    const userMessage: Message = {
      sender: "user",
      text,
      timestamp: getTimestamp(),
      emotion: detectEmotion(text),
      language,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        messages: [...messages, { role: "user", content: text }],
      };
      console.log("Sending payload:", JSON.stringify(payload));
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorText = await res.text();
        if (errorText.includes("402") || errorText.includes("401")) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Sorry, there was an issue processing your request. Please try again later or contact support.",
              timestamp: getTimestamp(),
              emotion: "stressed",
              language: "en",
            },
          ]);
        } else {
          throw new Error(
            `API request failed with status ${res.status}: ${errorText}`,
          );
        }
      } else {
        const data = (await res.json()) as ChatbotResponse;
        if (data.error) {
          throw new Error(data.error);
        }
        const reply = data.reply || "Sorry, no response available.";
        const suggestionsRegex =
          /\[\[suggestions: (.*?)(?:\s*\|\s*tasks: (.*?))?\]\]/i;
        const suggestionsMatch = suggestionsRegex.exec(reply);
        const suggestions = suggestionsMatch
          ? suggestionsMatch[1]?.split(",").map((s: string) => s.trim())
          : [];
        const tasks = suggestionsMatch?.[2]
          ? suggestionsMatch[2].split(",").map((t: string) => t.trim())
          : [];
        const botMessageText = suggestionsMatch
          ? reply.replace(suggestionsRegex, "")
          : reply;
        const botMessage: Message = {
          sender: "bot",
          text: botMessageText.trim(),
          timestamp: getTimestamp(),
          emotion: detectEmotion(botMessageText),
          suggestions,
          tasks,
          language,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Chatbot API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "An unexpected error occurred. Please try again later.",
          timestamp: getTimestamp(),
          emotion: "stressed",
          language: "en",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    void handleSendMessage(suggestion); // Treat tasks as suggestions, send as new message
  };

  const toggleVoice = () => {
    if (!isSpeechSupported) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Speech recognition is not supported in your browser.",
          timestamp: getTimestamp(),
          emotion: "stressed",
          language: "en",
        },
      ]);
      return;
    }
    setIsVoiceMode(!isVoiceMode);
    if (isVoiceMode && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsDetecting(false);
    }
  };

  const toggleBotSpeech = () => {
    setShouldBotSpeak(!shouldBotSpeak);
    if (shouldBotSpeak && synthesis) {
      synthesis.cancel();
    }
  };

  const toggleSpeechLang = () => {
    setSpeechLang(speechLang === "en" ? "ar" : "en");
    if (isVoiceMode && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsDetecting(false);
    }
  };

  return (
    <div className="bg-card dark:bg-card border-border fixed right-6 bottom-20 z-50 flex max-h-[550px] w-[380px] flex-col overflow-hidden rounded-2xl border shadow-xl transition-all duration-300">
      <div className="bg-card dark:bg-card border-border flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary dark:bg-accent text-primary-foreground dark:text-accent-foreground flex h-10 w-10 animate-bounce items-center justify-center rounded-full text-2xl">
            🤖
          </div>
          <span className="text-card-foreground dark:text-card-foreground text-lg font-bold">
            Mentoro AI
          </span>
          <button
            onClick={toggleSpeechLang}
            className="bg-secondary dark:bg-muted text-primary-foreground dark:text-accent-foreground border-accent dark:border-accent-foreground hover:bg-accent dark:hover:bg-accent hover:text-accent-foreground dark:hover:text-accent ml-4 flex h-8 w-16 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200 focus:outline-none"
            aria-label={`Switch to ${speechLang === "en" ? "Arabic" : "English"} speech recognition`}
          >
            {speechLang === "en" ? "EN" : "AR"}
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-colors"
          aria-label="Close chatbot"
        >
          ✖️
        </button>
      </div>

      <div className="bg-background dark:bg-background flex-1 space-y-4 overflow-y-auto p-5">
        {messages.map((msg, i) => {
          const emotionKey: Emotion = msg.emotion ?? "neutral";
          const style = emotionStyles[emotionKey];
          return (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 transition-all duration-200 ${
                  msg.sender === "user"
                    ? "bg-primary dark:bg-accent text-primary-foreground dark:text-accent-foreground rounded-br-none"
                    : "bg-card dark:bg-card text-card-foreground dark:text-card-foreground rounded-bl-none"
                } ${style.border} shadow-sm hover:shadow-md`}
              >
                {msg.text}
              </div>
              {(msg.suggestions ?? msg.tasks) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {msg.suggestions?.map((s, idx) => (
                    <button
                      key={`sug-${idx}`}
                      onClick={() => handleSuggestionClick(s)}
                      className="bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground hover:bg-accent dark:hover:bg-accent hover:text-accent-foreground dark:hover:text-accent-foreground rounded-full px-3 py-1 text-sm transition-colors"
                      aria-label={`Explore ${s}`}
                    >
                      {s}
                    </button>
                  ))}
                  {msg.tasks?.map((t, idx) => (
                    <button
                      key={`task-${idx}`}
                      onClick={() => handleSuggestionClick(t)}
                      className="bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground hover:bg-accent dark:hover:bg-accent hover:text-accent-foreground dark:hover:text-accent-foreground rounded-full px-3 py-1 text-sm transition-colors"
                      aria-label={`Try ${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
              <div className="text-muted-foreground dark:text-muted-foreground mt-1 text-xs">
                {msg.timestamp} {style.emoji}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-card dark:bg-card border-border flex items-center gap-3 border-t p-4">
        <button
          onClick={toggleVoice}
          className={`text-primary-foreground dark:text-accent-foreground flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 focus:outline-none ${
            isVoiceMode
              ? "bg-primary dark:bg-accent ring-primary/50 dark:ring-accent/50 animate-pulse ring-2"
              : "bg-secondary dark:bg-muted hover:bg-primary/90 dark:hover:bg-accent/90"
          } ${isDetecting ? "ring-primary/30 dark:ring-accent/30 animate-pulse ring-4" : ""}`}
          aria-label={isVoiceMode ? "Stop voice input" : "Start voice input"}
          disabled={!isSpeechSupported}
        >
          🎙️
        </button>
        <button
          onClick={toggleBotSpeech}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 focus:outline-none ${
            shouldBotSpeak
              ? "bg-primary dark:bg-accent text-primary-foreground dark:text-accent-foreground"
              : "bg-muted dark:bg-secondary text-muted-foreground dark:text-secondary-foreground"
          } hover:bg-primary/90 dark:hover:bg-accent/90`}
          aria-label={
            shouldBotSpeak ? "Disable bot speech" : "Enable bot speech"
          }
        >
          {shouldBotSpeak ? "🔊" : "🔇"}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !loading && void handleSendMessage(input)
          }
          className="bg-muted dark:bg-muted text-foreground dark:text-foreground focus:ring-ring flex-grow rounded-full px-4 py-2 transition-all focus:ring-2 focus:outline-none"
          placeholder="Ask about tech topics..."
          disabled={loading || isVoiceMode}
          aria-label="Type your message"
        />
        <button
          onClick={() => void handleSendMessage(input)}
          className="bg-primary dark:bg-accent text-primary-foreground dark:text-accent-foreground hover:bg-primary/90 dark:hover:bg-accent/90 rounded-full px-4 py-2 transition-colors disabled:opacity-50"
          disabled={loading || isVoiceMode}
          aria-label="Send message"
        >
          {loading ? "⏳" : "➤"}
        </button>
      </div>
    </div>
  );
}
