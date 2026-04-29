import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const generateDescription = async (req, res) => {
  const { title, category } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.8,
   messages: [
        {
          role: "system",
          content:
            "You write very simple, clear, and fun event invites. Use basic English that anyone can understand. Focus on inviting people to join the fun.",
        },
        {
          role: "user",
          content: `Write a very short, simple invitation for this event.
STRICT RULES:
- Use very simple English (no big or "smart" words)
- Tell people to come, play, or join
- 1 short sentence only (Max 20 words)
- Be friendly and fun
- don't use " "
Title: ${title}
Category: ${category}`,
        },
      ],
    });

    const text = completion.choices[0].message.content.trim();

    res.json({ success: true, text });
  } catch (err) {
    console.error("GROQ ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
