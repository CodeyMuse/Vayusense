import { Router, type IRouter } from "express";
import Anthropic from "@anthropic-ai/sdk";
import {
  GenerateAdvisoryBody,
  GenerateAdvisoryResponse,
  GenerateNoticeBody,
  GenerateNoticeResponse,
  SendChatMessageBody,
  SendChatMessageResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const FALLBACK_ADVISORY = {
  english:
    "Air quality is currently at unhealthy levels. Sensitive groups should avoid prolonged outdoor activity. Wear an N95 mask if going outdoors. Keep windows closed and use air purifiers indoors.",
  hindi:
    "वायु गुणवत्ता वर्तमान में अस्वस्थ स्तर पर है। संवेदनशील समूहों को लंबे समय तक बाहरी गतिविधि से बचना चाहिए। बाहर जाते समय N95 मास्क पहनें। खिड़कियाँ बंद रखें और घर के अंदर वायु शोधक का उपयोग करें।",
};

const FALLBACK_NOTICE =
  "MUNICIPAL ENFORCEMENT NOTICE\n\nThis notice is issued pursuant to the Air (Prevention and Control of Pollution) Act, 1981 and the Environment Protection Act, 1986. The designated zone is in violation of CPCB ambient air quality standards. Immediate corrective action is required within 48 hours. Failure to comply may result in closure orders and penalties under Section 31A of the Air Act.";

router.post("/ai/advisory", async (req, res): Promise<void> => {
  const parsed = GenerateAdvisoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { cityName, aqi, pollutants } = parsed.data;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Generate a 3-sentence public health advisory for ${cityName} with current AQI ${aqi} (PM2.5: ${pollutants.PM25} µg/m³, PM10: ${pollutants.PM10} µg/m³, NO2: ${pollutants.NO2} µg/m³). Include specific precautions for vulnerable groups. Then translate to Hindi. Format as JSON only with keys "english" and "hindi". No other text.`,
        },
      ],
    });

    const block = message.content[0];
    if (block.type !== "text") {
      res.json(GenerateAdvisoryResponse.parse(FALLBACK_ADVISORY));
      return;
    }

    try {
      const jsonMatch = block.text.match(/\{[\s\S]*\}/);
      const parsed_result = JSON.parse(jsonMatch ? jsonMatch[0] : block.text);
      res.json(GenerateAdvisoryResponse.parse(parsed_result));
    } catch {
      res.json(GenerateAdvisoryResponse.parse(FALLBACK_ADVISORY));
    }
  } catch (err) {
    logger.warn({ err }, "Claude advisory generation failed, using fallback");
    res.json(GenerateAdvisoryResponse.parse(FALLBACK_ADVISORY));
  }
});

router.post("/ai/notice", async (req, res): Promise<void> => {
  const parsed = GenerateNoticeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { zone, sourceType, cityAQI, confidence, cityName } = parsed.data;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Generate a formal municipal enforcement notice for:
City: ${cityName}
Zone: ${zone}
Source Type: ${sourceType}
Current AQI: ${cityAQI}
Detection Confidence: ${confidence}%

Include regulatory references to CPCB norms and the Air (Prevention and Control of Pollution) Act, 1981. Include a compliance deadline of 48 hours. Keep under 200 words. Use formal government notice language.`,
        },
      ],
    });

    const block = message.content[0];
    const notice = block.type === "text" ? block.text : FALLBACK_NOTICE;
    res.json(GenerateNoticeResponse.parse({ notice }));
  } catch (err) {
    logger.warn({ err }, "Claude notice generation failed, using fallback");
    res.json(GenerateNoticeResponse.parse({ notice: FALLBACK_NOTICE }));
  }
});

router.post("/ai/chat", async (req, res): Promise<void> => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { messages, cityData } = parsed.data;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: `You are VayuSense, an AI air quality analyst for Indian cities. You have access to current AQI, pollutant levels, and 72-hour forecasts. Answer administrator questions concisely with specific data references. Be precise and authoritative. Current city data: ${JSON.stringify(cityData)}`,
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const block = message.content[0];
    const reply =
      block.type === "text"
        ? block.text
        : "I was unable to process your query at this time. Please check the current AQI data directly.";

    res.json(SendChatMessageResponse.parse({ reply }));
  } catch (err) {
    logger.warn({ err }, "Claude chat failed, using fallback");
    res.json(
      SendChatMessageResponse.parse({
        reply:
          "I am currently experiencing connectivity issues. Please review the live AQI data and forecast charts for the information you need.",
      })
    );
  }
});

export default router;
