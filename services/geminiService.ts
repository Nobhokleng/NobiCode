
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODELS, CODE_REVIEW_PROMPTS } from '../constants';
import { UI_TRANSLATIONS } from '../constants/languages';
import { Language, StreamingOptions } from '../types/services';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.error("Gemini API Key (process.env.API_KEY) is not configured. The application may not function correctly.");
}

export const reviewCodeWithGemini = async (code: string, modelName: string = GEMINI_MODELS[0].id, language: Language = 'en', abortSignal?: AbortSignal): Promise<string> => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  if (!ai) {
    throw new Error(t.aiServiceNotInitialized);
  }
  if (!code.trim()) {
    throw new Error(t.emptyCodeError);
  }

  const promptTemplate = CODE_REVIEW_PROMPTS[language] || CODE_REVIEW_PROMPTS.en;
  const fullPrompt = promptTemplate.replace('[CODE_HERE]', code);

  try {
    // Check if the request was aborted before starting
    if (abortSignal?.aborted) {
      throw new Error("Request was cancelled");
    }

    // For code review, quality is important, so default thinking config (enabled) is good.
    // No specific thinkingConfig: { thinkingBudget: 0 } needed here.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
      // config: { // Optional: Add safetySettings, etc. if needed. For now, defaults are fine.
      //   temperature: 0.7, // Example: Adjust creativity if needed
      // }
    });

    // Check if the request was aborted after the API call
    if (abortSignal?.aborted) {
      throw new Error("Request was cancelled");
    }

    const text = response.text;
    if (!text) {
        throw new Error(`${t.apiFailureError}: No response received from Gemini AI.`);
    }
    return text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      // Check if the error is due to cancellation
      if (error.message.includes("Request was cancelled") || abortSignal?.aborted) {
        throw new Error("Request was cancelled");
      }
      // Check for common API key related errors or other specific Gemini errors if distinguishable
      if (error.message.includes("API_KEY_INVALID") || error.message.includes("API key not valid")) {
        throw new Error(`Gemini ${t.apiKeyInvalidError}`);
      }
      throw new Error(`${t.apiFailureError} (Gemini AI): ${error.message}`);
    }
    throw new Error(`${t.unknownApiError} (Gemini AI)`);
  }
};

export const reviewCodeWithGeminiStreaming = async (
  code: string,
  modelName: string = GEMINI_MODELS[0].id,
  language: Language = 'en',
  streamingOptions: StreamingOptions,
  abortSignal?: AbortSignal
): Promise<string> => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  if (!ai) {
    throw new Error(t.aiServiceNotInitialized);
  }
  if (!code.trim()) {
    throw new Error(t.emptyCodeError);
  }

  const promptTemplate = CODE_REVIEW_PROMPTS[language] || CODE_REVIEW_PROMPTS.en;
  const fullPrompt = promptTemplate.replace('[CODE_HERE]', code);

  try {
    // Check if the request was aborted before starting
    if (abortSignal?.aborted) {
      throw new Error("Request was cancelled");
    }

    const stream = await ai.models.generateContentStream({
      model: modelName,
      contents: fullPrompt,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      // Check if the request was aborted during streaming
      if (abortSignal?.aborted) {
        throw new Error("Request was cancelled");
      }

      const content = chunk.text || '';
      if (content) {
        fullResponse += content;

        // Call the streaming callback if provided
        if (streamingOptions.onChunk) {
          streamingOptions.onChunk(content);
        }
      }
    }

    // Call the completion callback if provided
    if (streamingOptions.onComplete) {
      streamingOptions.onComplete(fullResponse);
    }

    if (!fullResponse) {
      throw new Error(`${t.apiFailureError}: No response received from Gemini AI.`);
    }

    return fullResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);

    // Call the error callback if provided
    if (streamingOptions.onError && error instanceof Error) {
      streamingOptions.onError(error);
    }

    if (error instanceof Error) {
      // Check if the error is due to cancellation
      if (error.message.includes("Request was cancelled") || abortSignal?.aborted) {
        throw new Error("Request was cancelled");
      }
      // Check for common API key related errors or other specific Gemini errors if distinguishable
      if (error.message.includes("API_KEY_INVALID") || error.message.includes("API key not valid")) {
        throw new Error(`Gemini ${t.apiKeyInvalidError}`);
      }
      throw new Error(`${t.apiFailureError} (Gemini AI): ${error.message}`);
    }
    throw new Error(`${t.unknownApiError} (Gemini AI)`);
  }
};
