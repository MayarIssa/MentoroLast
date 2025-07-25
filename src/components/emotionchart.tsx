"use client";

import { useEffect, useState } from "react";

interface Message {
  sender: "user" | "bot";
  emotion?: string;
}

const EMOTIONS = ["happy", "sad", "stressed", "neutral"] as const;
type Emotion = (typeof EMOTIONS)[number];

const EMOTION_COLORS: Record<Emotion, string> = {
  happy: "bg-green-500",
  sad: "bg-blue-500",
  stressed: "bg-red-500",
  neutral: "bg-gray-400",
};

// const EMOTION_RECOMMENDATIONS: Record<Emotion, { suggestions: string[]; tasks: string[] }> = {
//   happy: {
//     suggestions: ['Deep dive into advanced AI', 'Explore complex algorithms'],
//     tasks: ['Try an advanced Python project', 'Take a machine learning quiz'],
//   },
//   sad: {
//     suggestions: ['Review CS basics', 'Learn about data visualization'],
//     tasks: ['Complete a simple coding exercise', 'Take a quiz on networking basics'],
//   },
//   stressed: {
//     suggestions: ['Explore cybersecurity tips', 'Learn about network protocols'],
//     tasks: ['Try a guided coding tutorial', 'Take a beginner AI quiz'],
//   },
//   neutral: {
//     suggestions: ['Learn about AI basics', 'Explore cybersecurity fundamentals'],
//     tasks: ['Try a Python coding challenge', 'Take a quiz on network protocols'],
//   },
// };

export function EmotionChart({ messages }: { messages: Message[] }) {
  const [counts, setCounts] = useState<Record<Emotion, number>>({
    happy: 0,
    sad: 0,
    stressed: 0,
    neutral: 0,
  });

  useEffect(() => {
    const lastMessages = messages.slice(-50);
    const newCounts: Record<Emotion, number> = {
      happy: 0,
      sad: 0,
      stressed: 0,
      neutral: 0,
    };

    lastMessages.forEach(({ emotion }) => {
      if (emotion && EMOTIONS.includes(emotion as Emotion)) {
        newCounts[emotion as Emotion]++;
      } else {
        newCounts.neutral++;
      }
    });

    // const dominantEmotion = Object.entries(newCounts).reduce((a, b) => (b[1] > a[1] ? b : a), ['neutral', 0])[0] as Emotion;
    setCounts(newCounts);
  }, [messages]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white p-4 shadow-lg dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Emotion Overview (Last 50 Messages)
      </h3>
      <div className="flex flex-col gap-3">
        {EMOTIONS.map((emo) => {
          const pct = (counts[emo] / total) * 100;
          return (
            <div key={emo} className="flex items-center gap-4">
              <span className={`h-3 w-3 rounded-full ${EMOTION_COLORS[emo]}`} />
              <span className="flex-grow text-gray-700 capitalize dark:text-gray-300">
                {emo}
              </span>
              <div className="h-4 flex-1 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                <div
                  style={{ width: `${pct}%` }}
                  className={`${EMOTION_COLORS[emo]} h-4 rounded`}
                />
              </div>
              <span className="w-8 text-right text-sm text-gray-600 dark:text-gray-400">
                {counts[emo]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
