import dotenv from 'dotenv';
dotenv.config();

/**
 * Server-side Gemini API Service
 * NEVER exposes GEMINI_API_KEY to the client browser.
 */

export const getGeminiConfig = () => {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const hasKey = Boolean(apiKey && apiKey.trim().length > 5);

  return {
    hasKey,
    model,
    // Secret key is kept ONLY inside server process
    apiKey,
  };
};

/**
 * Generic Gemini content generator with fallback & JSON support
 */
export async function callGeminiAPI({ prompt, systemInstruction = '', responseJson = false }) {
  const { hasKey, apiKey, model } = getGeminiConfig();

  if (!hasKey) {
    return {
      success: false,
      error: 'GEMINI_API_KEY is missing or not configured on server.',
      status: 401,
      fallbackRequired: true,
    };
  }

  // List of models to try in sequence if primary fails
  const modelsToTry = [model, 'gemini-2.5-flash', 'gemini-1.5-flash'].filter((v, i, a) => a.indexOf(v) === i);

  let lastError = null;

  for (const currentModel of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;

      const contents = [];
      if (systemInstruction) {
        contents.push({ role: 'user', parts: [{ text: `SYSTEM INSTRUCTIONS:\n${systemInstruction}` }] });
        contents.push({ role: 'model', parts: [{ text: 'Understood. I will strictly follow these system instructions.' }] });
      }

      let userPrompt = prompt;
      if (responseJson) {
        userPrompt += '\n\nIMPORTANT: Respond ONLY with a valid JSON object matching the requested schema. Do not include markdown code blocks, backticks, or additional conversational text outside the JSON.';
      }

      contents.push({ role: 'user', parts: [{ text: userPrompt }] });

      const requestBody = {
        contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
          ...(responseJson ? { responseMimeType: 'application/json' } : {}),
        },
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: 'Invalid API key or unauthorized access to Gemini API.',
          status: response.status,
          fallbackRequired: true,
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          error: 'AI usage limit reached. Please try again later.',
          status: 429,
          fallbackRequired: true,
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Gemini API Warning] Model ${currentModel} returned ${response.status}:`, errorText);
        lastError = `Status ${response.status}`;
        continue; // Try fallback model
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!textOutput) {
        throw new Error('Empty response from Gemini model');
      }

      if (responseJson) {
        // Parse JSON
        try {
          const cleanText = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          return { success: true, data: parsed, text: textOutput, modelUsed: currentModel };
        } catch (parseError) {
          console.warn('[Gemini API Warning] Failed to parse JSON response. Retrying once...', parseError);
          // Retry once with explicit instruction
          return await callGeminiAPI({
            prompt: prompt + '\nYour previous response was invalid JSON. Return strictly valid JSON.',
            systemInstruction,
            responseJson: true,
          });
        }
      }

      return { success: true, data: textOutput, text: textOutput, modelUsed: currentModel };
    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn(`[Gemini API Warning] Model ${currentModel} timed out.`);
        lastError = 'Request timed out';
      } else {
        console.warn(`[Gemini API Warning] Error with model ${currentModel}:`, err.message);
        lastError = err.message;
      }
    }
  }

  return {
    success: false,
    error: 'AI service is temporarily unavailable.',
    details: lastError,
    status: 500,
    fallbackRequired: true,
  };
}
