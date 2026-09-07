const Location = require("../models/Location");

async function generateContent(req, res) {
  try {
    const {
      locationId,
      topic,
      postType = "Update",
      tone = "Professional",
      language = "English"
    } = req.body;

    // Validate input
    if (!locationId || !topic?.trim()) {
      return res.status(400).json({
        message: "Location and topic are required."
      });
    }

    // Find user's location
    const location = await Location.findOne({
      _id: locationId,
      userId: req.userId
    });

    if (!location) {
      return res.status(404).json({
        message: "Location not found."
      });
    }

    // Check OpenRouter configuration
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is missing.");

      return res.status(503).json({
        message: "OpenRouter API key is not configured."
      });
    }

    const openRouterUrl =
      process.env.OPENROUTER_URL ||
      "https://openrouter.ai/api/v1/chat/completions";

    const model =
      process.env.OPENROUTER_MODEL ||
      "openai/gpt-4o-mini";

    const systemPrompt = `
You write Google Business Profile posts for local businesses.

Return only the post content.
Do not use headings or markdown.
Do not invent prices, dates, phone numbers, addresses or guarantees.
Keep the post natural and useful.
Write around 60-120 words.
`;

    const userPrompt = `
Business: ${location.businessName}
Address: ${location.address}
Category: ${location.category}
City: ${location.city}

Topic: ${topic}
Post Type: ${postType}
Tone: ${tone}
Language: ${language}

Create one Google Business Profile post using only the information above.
`;

    console.log("Sending request to OpenRouter...");
    console.log("Model:", model);
    console.log("URL:", openRouterUrl);

    const response = await fetch(openRouterUrl, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:3000",
        "X-Title": process.env.APP_NAME || "GBP Post Manager"
      },

      body: JSON.stringify({
        model,
        temperature: Number(process.env.AI_TEMPERATURE || 0.7),
        max_tokens: Number(process.env.AI_MAX_TOKENS || 300),

        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ]
      })
    });

    const rawResponse = await response.text();

    console.log("OpenRouter status:", response.status);
    console.log("OpenRouter response:", rawResponse);

    let data;

    try {
      data = JSON.parse(rawResponse);
    } catch {
      data = {};
    }

    // OpenRouter returned an error
    if (!response.ok) {
      const providerMessage =
        data?.error?.message ||
        data?.message ||
        "Unknown OpenRouter error.";

      console.error("OpenRouter API Error:", {
        status: response.status,
        message: providerMessage,
        error: data?.error
      });

      return res.status(502).json({
        message: `AI generation failed: ${providerMessage}`
      });
    }

    // Get generated content
    const content =
      data?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      console.error("OpenRouter returned no content:", data);

      return res.status(502).json({
        message: "AI returned empty content."
      });
    }

    return res.json({
      content
    });

  } catch (error) {
    console.error("AI controller error:", error);

    return res.status(500).json({
      message: "Unable to generate content."
    });
  }
}

module.exports = {
  generateContent
};