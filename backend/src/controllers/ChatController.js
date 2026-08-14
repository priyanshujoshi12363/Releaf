import OpenAI from "openai";
import config from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

const client = new OpenAI({
  apiKey: config.openRouter.apiKey,
  baseURL: config.openRouter.baseUrl,
});

const SYSTEM_PROMPT =
  "You are EcoBot, a friendly guide for the ReLeaf environmental learning platform. " +
  "Answer questions about the environment, sustainability, climate and conservation. " +
  "Always weave in a concrete, verifiable environmental fact. " +
  "Keep replies under 150 words and decline topics unrelated to the environment.";

export const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await client.chat.completions.create(
      {
        model: config.openRouter.model,
        max_tokens: 400,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
      },
      { timeout: 30_000 }
    );

    const reply = completion.choices?.[0]?.message?.content?.trim();
    if (!reply) throw ApiError.internal("EcoBot returned an empty response");

    return res.status(200).json({ reply });
  } catch (error) {
    if (error instanceof ApiError) throw error;

    logger.error("EcoBot request failed", {
      status: error?.status,
      message: error?.message,
    });

    if (error?.status === 429) {
      throw ApiError.tooManyRequests("EcoBot is busy right now, please try again shortly");
    }
    throw new ApiError(503, "EcoBot is temporarily unavailable");
  }
});
