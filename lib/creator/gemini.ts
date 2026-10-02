import { GoogleGenerativeAI } from "@google/generative-ai";

import { buildCreatorPrompt } from "./creatorPrompt";
import { buildBrandOutreachPrompt } from "./outreach/prompt";

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
  );

export async function generateCreatorKit({
  productName,
  productDetails,
  niche,
  platform,
  image
}: {
  productName: string;

  productDetails: string;

  niche: string;

  platform: string;
  image: null
}) {
  const prompt =
    buildCreatorPrompt({
      productName,
      productDetails,
      niche,
      platform,
    });

  const model =
    genAI.getGenerativeModel({
      model:
        "gemini-2.5-flash",
    });

  let text = "";

  try {
    for (
      let attempt = 1;
      attempt <= 3;
      attempt++
    ) {
      try {
        console.log(
          `CREATOR GEMINI ATTEMPT ${attempt}`
        );

        const result =
          await model.generateContent(
            prompt
          );

        text =
          result.response.text();

        if (
          text &&
          text.trim()
        ) {
          break;
        }
      } catch (
        innerError
      ) {
        console.error(
          `CREATOR GEMINI ATTEMPT ${attempt} FAILED`,
          innerError
        );

        if (
          attempt === 3
        ) {
          throw innerError;
        }

        await new Promise(
          (
            resolve
          ) =>
            setTimeout(
              resolve,
              1000
            )
        );
      }
    }
  } catch (error) {
    console.error(
      "CREATOR GEMINI ERROR:",
      error
    );

    throw new Error(
      "Creator AI unavailable after retries"
    );
  }

  // Remove markdown fences

  text = text
    .replace(
      /```json/g,
      ""
    )
    .replace(
      /```/g,
      ""
    )
    .trim();

  console.log(
    "CREATOR RAW OUTPUT:",
    text
  );

  try {
    const parsed =
      JSON.parse(text);

    return parsed;
  } catch (
    parseError
  ) {
    console.error(
      "CREATOR JSON PARSE ERROR:",
      parseError
    );

    console.error(
      "FAILED CONTENT:",
      text
    );

    throw new SyntaxError(
      "Invalid AI JSON response"
    );
  }
}


// for brand outreach, we want to be more aggressive about retrying on empty or invalid output, since the format is more complex and there's no image generation step to worry about. For creator kits, we can be a bit more lenient since we have the fallback of the image and the content is less structured.

export async function generateBrandOutreach({
  creatorName,
  creatorNiche,
  platform,
  followers,
  targetBrandCategory,
}: {
  creatorName: string;
  creatorNiche: string;
  platform: string;
  followers: string;
  targetBrandCategory: string;
}) {
  const prompt =
    buildBrandOutreachPrompt({
      creatorName,
      creatorNiche,
      platform,
      followers,
      targetBrandCategory,
    });

  const model =
    genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

  let text = "";

  try {
    for (
      let attempt = 1;
      attempt <= 3;
      attempt++
    ) {
      try {
        console.log(
          `OUTREACH GEMINI ATTEMPT ${attempt}`
        );

        const result =
          await model.generateContent(
            prompt
          );

        text =
          result.response.text();

        if (
          text &&
          text.trim()
        ) {
          break;
        }
      } catch (
        innerError
      ) {
        console.error(
          `OUTREACH GEMINI ATTEMPT ${attempt} FAILED`,
          innerError
        );

        if (
          attempt === 3
        ) {
          throw innerError;
        }

        await new Promise(
          (
            resolve
          ) =>
            setTimeout(
              resolve,
              1000
            )
        );
      }
    }
  } catch (error) {
    console.error(
      "OUTREACH GEMINI ERROR:",
      error
    );

    throw new Error(
      "Outreach AI unavailable after retries"
    );
  }

  text = text
    .replace(
      /```json/g,
      ""
    )
    .replace(
      /```/g,
      ""
    )
    .trim();

  console.log(
    "OUTREACH RAW OUTPUT:",
    text
  );

  try {
    const parsed =
      JSON.parse(text);

    return parsed;
  } catch (
    parseError
  ) {
    console.error(
      "OUTREACH JSON PARSE ERROR:",
      parseError
    );

    console.error(
      "FAILED CONTENT:",
      text
    );

    throw new SyntaxError(
      "Invalid AI JSON response"
    );
  }
}