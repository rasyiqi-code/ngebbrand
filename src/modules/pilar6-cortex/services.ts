import OpenAI from "openai";

/**
 * OpenRouter Gateway — Compatible with OpenAI SDK
 * Single API key routes to GPT-4o, Claude 3.5, Gemini, Llama, etc.
 */
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  defaultHeaders: {
    "HTTP-Referer": "https://brandos.app",
    "X-Title": "BrandOS Platform",
  },
});

/** Model presets for different use cases */
const MODELS = {
  strategy: process.env.OPENROUTER_DEFAULT_MODEL || "openai/gpt-4o",
  writer: process.env.OPENROUTER_WRITER_MODEL || "anthropic/claude-3.5-sonnet",
  fast: process.env.OPENROUTER_FAST_MODEL || "google/gemini-2.0-flash-001",
};

type ModelPreset = keyof typeof MODELS;

interface ChatOptions {
  model?: string;
  preset?: ModelPreset;
  temperature?: number;
  jsonMode?: boolean;
  maxTokens?: number;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Pilar 6: Brand AI Cortex Service
 * The intelligence layer powering BrandOS via OpenRouter.
 */
export const AICortexService = {

  /**
   * Check if AI is configured (has a real API key)
   */
  isConfigured(): boolean {
    return !!(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.length > 10);
  },

  /**
   * Core chat function — routes to OpenRouter
   */
  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error("AI Cortex is not configured. Please add OPENROUTER_API_KEY to your environment variables.");
    }

    const model = options.model
      || (options.preset ? MODELS[options.preset] : MODELS.strategy);

    try {
      const response = await openrouter.chat.completions.create({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
        ...(options.jsonMode ? { response_format: { type: "json_object" as const } } : {}),
      });

      return response.choices[0]?.message?.content || "";
    } catch (error: any) {
      console.error(`AI Cortex Error [${model}]:`, error?.message || error);
      throw error;
    }
  },

  /**
   * Generate structured JSON output
   */
  async generateJSON<T = any>(
    systemPrompt: string,
    userPrompt: string,
    options: Omit<ChatOptions, "jsonMode"> = {}
  ): Promise<T> {
    const response = await this.chat(
      [
        { role: "system", content: systemPrompt + "\n\nYou MUST respond with valid JSON only. No markdown, no code fences." },
        { role: "user", content: userPrompt },
      ],
      { ...options, jsonMode: true, preset: options.preset || "strategy" }
    );

    try {
      return JSON.parse(response) as T;
    } catch {
      console.error("Failed to parse AI JSON response:", response.substring(0, 200));
      throw new Error("AI returned invalid JSON");
    }
  },

  /**
   * Helper for simple text generation
   */
  async generateText(systemPrompt: string, userPrompt: string, options: ChatOptions = {}): Promise<string> {
    return this.chat([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ], options);
  },

  /**
   * Generate Visual DNA Keywords from Aaker Canvas input
   */
  async generateVisualDNA(input: {
    product?: string;
    organization?: string;
    person?: string;
    symbol?: string;
  }, language: string = "id"): Promise<{ keywords: string[]; summary: string }> {
    const langName = language === "id" ? "Bahasa Indonesia" : "English";
    const systemPrompt = `You are a visual branding expert trained in David Aaker's Brand Identity Model.
Based on the user's Aaker Canvas input (Brand as Product, Organization, Person, Symbol), 
generate 6-8 Visual DNA Keywords that capture the visual essence of this brand.
Also provide a 2-sentence summary of the visual direction.

Note: Brand data is typically provided in English. Treat it as the source of truth.
Respond in ${langName}.`;

    const userPrompt = `Brand as Product: ${input.product || "Not filled"}
Brand as Organization: ${input.organization || "Not filled"}
Brand as Person: ${input.person || "Not filled"}
Brand as Symbol: ${input.symbol || "Not filled"}`;

    return this.generateJSON(systemPrompt, userPrompt);
  },

  /**
   * Generate color palette based on archetype and keywords
   */
  async generatePalette(archetype: string, keywords: string[], language: string = "id"): Promise<{
    options: Array<{
      name: string;
      score: number;
      colors: { primary: string; secondary: string; accent: string; neutral1: string; neutral2: string };
      description: string;
    }>;
  }> {
    const langName = language === "id" ? "Bahasa Indonesia" : "English";
    const systemPrompt = `You are a color psychology and branding expert. 
Based on the brand archetype and visual DNA keywords, generate exactly 3 color palette options.
Each palette should have 5 colors: primary, secondary, accent, neutral1, neutral2 (all hex codes).
Each option should have a creative name, a relevance score (0-100), and a short description.
Use color psychology aligned with the archetype. 

Note: Brand context is provided in English.
Respond in ${langName} for descriptions.`;

    const userPrompt = `Archetype: ${archetype}
Visual DNA Keywords: ${keywords.join(", ")}`;

    return this.generateJSON(systemPrompt, userPrompt);
  },

  /**
   * Generate typography recommendations
   */
  async generateTypography(archetype: string, keywords: string[], language: string = "id"): Promise<{
    options: Array<{
      name: string;
      score: number;
      heading: { family: string; weight: string; style: string };
      body: { family: string; weight: string; style: string };
      description: string;
    }>;
  }> {
    const langName = language === "id" ? "Bahasa Indonesia" : "English";
    const systemPrompt = `You are a typography expert for brand identity. 
Based on the brand archetype and visual DNA keywords, recommend exactly 3 font pairing options.
Use only Google Fonts that are freely available. Each pair should have heading and body fonts.
Include a creative name, relevance score (0-100), and description.

Note: Brand context is provided in English.
Respond in ${langName} for descriptions.`;

    const userPrompt = `Archetype: ${archetype}
Visual DNA Keywords: ${keywords.join(", ")}`;

    return this.generateJSON(systemPrompt, userPrompt);
  },

  /**
   * Analyze brand consistency from scraped data
   */
  async analyzeBrandCompliance(pageContent: string, context: { name: string; tone: string; colors: any; keywords: string[]; language?: string }): Promise<{
    score: number;
    findings: Array<{ severity: string; category: string; description: string; recommendation: string }>;
    colorAnalysis?: any;
    toneAnalysis?: any;
  }> {
    const langName = context.language === "en" ? "English" : "Bahasa Indonesia";
    const systemPrompt = `You are a world-class Brand Consistency Auditor. 
Analyze the provided page content (HTML/Text) against the official Brand Strategy.
Identify discrepancies in tone of voice, visual mentions, and key messaging.
Provide a Compliance Score (0-100) and specific findings.
Each finding MUST have: severity (high/medium/low), category (Logo, Typography, Color, Tone), description, and recommendation.
Respond in ${langName} for descriptions and recommendations.`;

    const userPrompt = `BRAND CONTEXT:
${JSON.stringify(context, null, 2)}

PAGE CONTENT:
${pageContent.substring(0, 10000)} // Truncated for token limits`;

    return this.generateJSON(systemPrompt, userPrompt);
  },

  /**
   * Co-Strategist context-aware chat
   */
  async coStrategistChat(
    messages: ChatMessage[],
    context: {
      currentPage: string;
      brandEssence?: string;
      archetype?: string;
      expert?: string;
      language?: string;
    }
  ): Promise<string> {
    const expertName = context.expert || "David Aaker";
    const langName = context.language === "en" ? "English" : "Bahasa Indonesia";
    const systemMessage: ChatMessage = {
      role: "system",
      content: `You are an AI Co-Strategist for BrandOS, channeling the wisdom of ${expertName}.
You are world-class at Socratic questioning — challenge generic answers.

Current context:
- Page: ${context.currentPage}
- Brand Essence: ${context.brandEssence || "Not defined yet"}
- Archetype: ${context.archetype || "Not defined yet"}

Note: Brand context data is provided in English. Use it as the source of truth.

Rules:
1. Never accept vague answers like "high quality" or "best service" without asking for evidence.
2. Reference ${expertName}'s specific theories and frameworks.
3. Be professional, critical, but inspiring. Use analogies.
4. Respond in ${langName} consistently.
5. Keep responses concise (max 3 paragraphs).`,
    };

    return this.chat([systemMessage, ...messages]);
  },
};
