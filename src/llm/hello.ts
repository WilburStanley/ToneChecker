import OpenAI from "openai";

const requiredVariables = ["LLM_BASE_URL", "LLM_API_KEY", "LLM_MODEL"];

const main = async () => {
  const missingVariables = requiredVariables.filter(
    (variableName) => !process.env[variableName]
  );

  if (missingVariables.length > 0) {
    console.error(`Missing in .env: ${missingVariables.join(", ")}`);
    process.exit(1);
  }

  const client = new OpenAI({
    baseURL: process.env.LLM_BASE_URL,
    apiKey: process.env.LLM_API_KEY,
  });

  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL as string,
    messages: [{ role: "user", content: "Reply with exactly the word: ready" }],
  });

  console.log(response.choices[0].message.content);
};

main().catch((error) => {
  console.error("Request failed:", error.message);
  process.exit(1);
});