import OpenAI from 'openai';
import { OPENROUTER_MODELS, OPENROUTER_BASE_URL, CODE_REVIEW_PROMPTS } from '../constants';
import { UI_TRANSLATIONS } from '../constants/languages';
import { Language, StreamingOptions } from '../types/services';

// Note: In production, API keys should be handled server-side for security.
// This client-side implementation is for development/demo purposes.
// Consider implementing a backend proxy for production use.
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

let openai: OpenAI | null = null;

if (OPENROUTER_API_KEY) {
  openai = new OpenAI({
    baseURL: OPENROUTER_BASE_URL,
    apiKey: OPENROUTER_API_KEY,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });
} else {
  console.error("OpenRouter API Key (process.env.OPENROUTER_API_KEY) is not configured. The application may not function correctly.");
}

export const reviewCodeWithOpenRouter = async (code: string, modelName: string = OPENROUTER_MODELS[0].id, language: Language = 'en', abortSignal?: AbortSignal): Promise<string> => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  if (!openai) {
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

    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "user",
          content: fullPrompt
        }
      ]
    }, {
      headers: {
        "HTTP-Referer": "https://nobicode.app", // Optional: Site URL for rankings
        "X-Title": "NobiCode", // Optional: Site title for rankings
      },
      signal: abortSignal // Pass the abort signal to the OpenAI client
    });

    // Check if the request was aborted after the API call
    if (abortSignal?.aborted) {
      throw new Error("Request was cancelled");
    }

    const text = response.choices[0]?.message?.content;
    if (!text) {
        throw new Error(`${t.apiFailureError}: No response received from OpenRouter AI.`);
    }
    return text;

  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    if (error instanceof Error) {
      // Check if the error is due to cancellation
      if (error.message.includes("Request was cancelled") || error.name === 'AbortError' || abortSignal?.aborted) {
        throw new Error("Request was cancelled");
      }
      // Check for common API key related errors
      if (error.message.includes("401") || error.message.includes("Unauthorized") || error.message.includes("API key")) {
        throw new Error(`OpenRouter ${t.apiKeyInvalidError}`);
      }
      throw new Error(`${t.apiFailureError} (OpenRouter AI): ${error.message}`);
    }
    throw new Error(`${t.unknownApiError} (OpenRouter AI)`);
  }
};

export const reviewCodeWithOpenRouterStreaming = async (
  code: string,
  modelName: string = OPENROUTER_MODELS[0].id,
  language: Language = 'en',
  streamingOptions: StreamingOptions,
  abortSignal?: AbortSignal
): Promise<string> => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  if (!openai) {
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

    const stream = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "user",
          content: fullPrompt
        }
      ],
      stream: true
    }, {
      headers: {
        "HTTP-Referer": "https://nobicode.app",
        "X-Title": "NobiCode",
      },
      signal: abortSignal
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      // Check if the request was aborted during streaming
      if (abortSignal?.aborted) {
        throw new Error("Request was cancelled");
      }

      const content = chunk.choices[0]?.delta?.content || '';
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
      throw new Error(`${t.apiFailureError}: No response received from OpenRouter AI.`);
    }

    return fullResponse;

  } catch (error) {
    console.error("Error calling OpenRouter API:", error);

    // Call the error callback if provided
    if (streamingOptions.onError && error instanceof Error) {
      streamingOptions.onError(error);
    }

    if (error instanceof Error) {
      // Check if the error is due to cancellation
      if (error.message.includes("Request was cancelled") || error.name === 'AbortError' || abortSignal?.aborted) {
        throw new Error("Request was cancelled");
      }
      // Check for common API key related errors
      if (error.message.includes("401") || error.message.includes("Unauthorized") || error.message.includes("API key")) {
        throw new Error(`OpenRouter ${t.apiKeyInvalidError}`);
      }
      throw new Error(`${t.apiFailureError} (OpenRouter AI): ${error.message}`);
    }
    throw new Error(`${t.unknownApiError} (OpenRouter AI)`);
  }
};
