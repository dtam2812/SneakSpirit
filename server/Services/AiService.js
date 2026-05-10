const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CHAT_MODEL = "llama-3.3-70b-versatile";
const LITE_MODEL = "llama-3.1-8b-instant";

const chat = async ({ system, messages }) => {
  const formattedMessages = messages.map((msg) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content,
  }));

  const response = await groq.chat.completions.create({
    model: CHAT_MODEL,
    messages: [{ role: "system", content: system }, ...formattedMessages],
    temperature: 0.7,
    max_tokens: 1024,
  });

  return response.choices[0].message.content;
};

const complete = async (prompt, options = {}) => {
  const response = await groq.chat.completions.create({
    model: LITE_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: options.temperature ?? 0,
    max_tokens: options.maxTokens ?? 512,
  });

  return response.choices[0].message.content;
};

module.exports = { chat, complete };
