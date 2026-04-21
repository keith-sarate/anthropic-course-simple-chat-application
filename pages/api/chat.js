import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });

  const text = response.content[0].text;

  return res.status(200).json({ response: text });
}
