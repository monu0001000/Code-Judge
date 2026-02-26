const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analyzeCode(problem, code) {
  try {
    const prompt = `
You are a competitive programming mentor.

Problem:
${problem.title}
${problem.description}

User Code:
${code}

Analyze and respond strictly in JSON format like this:

{
  "logic": "...",
  "edgeCases": "...",
  "timeComplexity": "...",
  "improvement": "...",
  "improvedCode": "..."
}

Do not add markdown. Do not add explanation outside JSON.
`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
    });

    const rawText = response.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("JSON Parse Failed:", rawText);
      throw new Error("AI returned invalid JSON");
    }

    return parsed;

  } catch (error) {
    console.error("GROQ ERROR:", error);
    throw new Error("AI analysis failed");
  }
}

module.exports = { analyzeCode };
