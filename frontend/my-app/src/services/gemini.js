import React from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.REACT_APP_GEMINI_API_KEY; // set in .env.local
let genAI;
try {
  if (apiKey) genAI = new GoogleGenerativeAI(apiKey);
} catch (_) {}

function safeParseIdeas(text) {
  try {
    const json = JSON.parse(text);
    if (Array.isArray(json))
      return json.map((t) => ({ title: String(t.title || t) }));
  } catch (_) {}
  // fallback: split lines
  // Avoid unnecessary escape warnings by building regex via constructor
  const bulletPattern = new RegExp('^[\\-\\*\\d\\.\\s]+');
  return String(text)
    .split("\n")
    .map((s) => s.replace(bulletPattern, "").trim())
    .filter(Boolean)
    .slice(0, 5)
    .map((title) => ({ title }));
}

async function callGemini(prompt) {
  if (!genAI) return [];
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const res = await model.generateContent(prompt);
  const text = res.response.text();
  return safeParseIdeas(text);
}

export function useGeminiIdeas() {
  const [ideas, setIdeas] = React.useState([]);
  const [thinking, setThinking] = React.useState(false);

  async function generateProjectIdeas() {
    setThinking(true);
    try {
      const out = await callGemini(
        "Suggest 5 concise project titles for a software team. Respond as a simple bullet list."
      );
      setIdeas(out);
    } finally {
      setThinking(false);
    }
  }

  async function generateTaskIdeas() {
    setThinking(true);
    try {
      const out = await callGemini(
        "Suggest 6 short task titles for a web project kanban board. Return a bullet list only."
      );
      setIdeas(out);
    } finally {
      setThinking(false);
    }
  }

  return { ideas, thinking, generateProjectIdeas, generateTaskIdeas };
}
