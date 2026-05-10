const Gemini_Url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

function stripCodeFences(text) {
  if (!text) return text;
  // Remove ```json ... ``` and ``` ... ``` wrappers
  return text
    .replace(/```\s*json\s*/gi, "")
    .replace(/```/g, "")
    .trim();
}

function extractFirstJsonObject(text) {
  if (!text) return null;

  const cleaned = stripCodeFences(text);

  // Find first '{' then attempt to parse a balanced JSON object by brace counting.
  const start = cleaned.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") depth++;
    else if (ch === "}") depth--;

    if (depth === 0) {
      const candidate = cleaned.slice(start, i + 1);
      return candidate;
    }
  }

  return null;
}

export const generateGeminiResponse = async (prompt) => {
  try {
    const response = await fetch(
      `${Gemini_Url}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      // Try to include body for easier debugging
      let bodyText = "";
      try {
        bodyText = await response.text();
      } catch (_) {}
      throw new Error(
        `Gemini API error: ${response.status}${bodyText ? ` - ${bodyText}` : ""}`
      );
    }

    const data = await response.json();

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!rawText) {
      throw new Error("Gemini returned empty response");
    }

    const jsonCandidate = extractFirstJsonObject(rawText);
    if (!jsonCandidate) {
      console.error("No JSON object extracted. Raw Gemini text:", rawText);
      throw new Error("No JSON found in Gemini response");
    }

    try {
      return JSON.parse(jsonCandidate);
    } catch (parseError) {
      // Log candidate + raw for debugging but avoid crashing without context
      console.error("JSON parse failed.");
      console.error("JSON candidate:", jsonCandidate);
      console.error("Raw Gemini text:", rawText);
      throw new Error("Invalid JSON from Gemini");
    }

  } catch (error) {
    console.error("Gemini generation failed:", error);
    throw error;
  }
};

