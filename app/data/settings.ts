/** Settings module — types and mock data for Integrations, AI, Taxonomy, Ingestion */

export type KeyStatus = "active" | "error" | "exhausted" | "untested";

export interface ApiKey {
  id: string;
  label: string;
  /** Masked display value, e.g. "sk-proj-••••TzAB" */
  valueMasked?: string;
  status: KeyStatus;
  /** 0–100 */
  usagePercent?: number;
  usageLabel?: string;
  quotaLimit?: string;
  lastChecked?: string;
  /** If true, this key is preferred / primary */
  isPrimary: boolean;
}

export type IntegrationCategory = "ai" | "scraper";

export interface ProviderIntegration {
  id: string;
  name: string;
  provider: string;
  category: IntegrationCategory;
  description: string;
  iconColor: string;
  docsUrl?: string;
  keys: ApiKey[];
}

export type AiFeature =
  | "inbox-analysis"
  | "guide-writer"
  | "risk-forecast"
  | "tag-extractor"
  | "task-summarizer"
  | "wallet-optimizer";

export interface AiFeatureMapping {
  feature: AiFeature;
  featureLabel: string;
  featureDescription: string;
  primaryModel: string;
  fallbackModel: string;
  temperature: number;
  maxTokens: number;
}

export type TaxonomyType = "project-category" | "task-tag" | "project-status" | "task-status";

export interface TaxonomyItem {
  id: string;
  type: TaxonomyType;
  label: string;
  color: string;
  builtIn: boolean;
  usageCount: number;
}

export interface IngestionSettings {
  crawlDepth: number;
  skipImages: boolean;
  textOnly: boolean;
  autoScrapeEnabled: boolean;
  scrapeIntervalHours: number;
  priorityDomains: string[];
  maxItemsPerRun: number;
  deduplication: boolean;
}

export interface ApiLog {
  id: string;
  timestamp: string;
  service: string;
  endpoint: string;
  statusCode: number;
  latencyMs: number;
  tokensUsed?: number;
  costUsd?: number;
  success: boolean;
  errorMessage?: string;
}

export const AI_MODELS = [
  "gpt-4o",
  "gpt-4-turbo",
  "gpt-3.5-turbo",
  "grok-2",
  "grok-beta",
  "claude-3-5-sonnet",
  "claude-3-haiku",
  "deepseek-v3",
];

export const mockProviders: ProviderIntegration[] = [
  /* ── AI Providers ─────────────────────────────────────────── */
  {
    id: "prov-openai",
    name: "OpenAI",
    provider: "OpenAI",
    category: "ai",
    description: "GPT-4o, GPT-4 Turbo, GPT-3.5 — inbox analysis, guide writing, summarization.",
    iconColor: "#10a37f",
    docsUrl: "https://platform.openai.com/docs",
    keys: [
      {
        id: "oai-k1",
        label: "Primary",
        valueMasked: "sk-proj-••••••••••••••••••••••••TzAB",
        status: "active",
        usagePercent: 68,
        usageLabel: "136,000 / 200,000 tokens",
        quotaLimit: "200,000 tokens/day",
        lastChecked: "2026-03-12T06:00:00Z",
        isPrimary: true,
      },
      {
        id: "oai-k2",
        label: "Backup #1",
        valueMasked: "sk-proj-••••••••••••••••••••••••Hm7K",
        status: "active",
        usagePercent: 12,
        usageLabel: "24,000 / 200,000 tokens",
        quotaLimit: "200,000 tokens/day",
        lastChecked: "2026-03-12T05:00:00Z",
        isPrimary: false,
      },
      {
        id: "oai-k3",
        label: "Backup #2",
        valueMasked: "sk-proj-••••••••••••••••••••••••Xp9Q",
        status: "exhausted",
        usagePercent: 100,
        usageLabel: "200,000 / 200,000 tokens",
        quotaLimit: "200,000 tokens/day",
        lastChecked: "2026-03-12T04:00:00Z",
        isPrimary: false,
      },
    ],
  },
  {
    id: "prov-grok",
    name: "Grok",
    provider: "xAI",
    category: "ai",
    description: "Grok-2 for risk forecasting and real-time crypto data interpretation.",
    iconColor: "#1a1a1a",
    docsUrl: "https://docs.x.ai",
    keys: [
      {
        id: "grok-k1",
        label: "Primary",
        valueMasked: "xai-••••••••••••••••••••••••••KmR1",
        status: "error",
        usagePercent: 0,
        usageLabel: "Key expired",
        lastChecked: "2026-03-11T22:00:00Z",
        isPrimary: true,
      },
      {
        id: "grok-k2",
        label: "Backup #1",
        status: "untested",
        isPrimary: false,
      },
    ],
  },
  {
    id: "prov-anthropic",
    name: "Anthropic",
    provider: "Anthropic",
    category: "ai",
    description: "Claude 3.5 Sonnet & Haiku — nuanced summaries and long-form guide generation.",
    iconColor: "#cc785c",
    docsUrl: "https://docs.anthropic.com",
    keys: [
      {
        id: "anth-k1",
        label: "Primary",
        status: "untested",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prov-cometapi",
    name: "CometAPI",
    provider: "CometAPI",
    category: "ai",
    description: "Telegram & social channel monitoring — routes airdrop signals to Inbox.",
    iconColor: "#7c3aed",
    docsUrl: "https://cometapi.com/docs",
    keys: [
      {
        id: "comet-k1",
        label: "Primary",
        valueMasked: "comet-••••••••••••••••••••••wL5M",
        status: "active",
        usagePercent: 88,
        usageLabel: "880 / 1,000 credits",
        quotaLimit: "1,000 credits/month",
        lastChecked: "2026-03-12T04:30:00Z",
        isPrimary: true,
      },
      {
        id: "comet-k2",
        label: "Backup #1",
        valueMasked: "comet-••••••••••••••••••••••Jd3N",
        status: "active",
        usagePercent: 14,
        usageLabel: "140 / 1,000 credits",
        quotaLimit: "1,000 credits/month",
        lastChecked: "2026-03-12T04:30:00Z",
        isPrimary: false,
      },
    ],
  },
  /* ── Scraper ──────────────────────────────────────────────── */
  {
    id: "prov-firecrawl",
    name: "Firecrawl",
    provider: "Mendable",
    category: "scraper",
    description: "Web scraping & deep crawling — extracts airdrop details from project docs and announcements.",
    iconColor: "#e05d3c",
    docsUrl: "https://docs.firecrawl.dev",
    keys: [
      {
        id: "fc-k1",
        label: "Primary",
        valueMasked: "fc-••••••••••••••••••••••••9xY2",
        status: "active",
        usagePercent: 45,
        usageLabel: "450 / 1,000 pages",
        quotaLimit: "1,000 pages/month",
        lastChecked: "2026-03-12T05:45:00Z",
        isPrimary: true,
      },
      {
        id: "fc-k2",
        label: "Backup #1",
        valueMasked: "fc-••••••••••••••••••••••••Rk8T",
        status: "active",
        usagePercent: 8,
        usageLabel: "80 / 1,000 pages",
        quotaLimit: "1,000 pages/month",
        lastChecked: "2026-03-12T05:00:00Z",
        isPrimary: false,
      },
      {
        id: "fc-k3",
        label: "Backup #2",
        status: "untested",
        isPrimary: false,
      },
    ],
  },
];

export const mockAiMappings: AiFeatureMapping[] = [
  {
    feature: "inbox-analysis",
    featureLabel: "Inbox Analysis",
    featureDescription: "Classify and extract actionable data from Telegram/Twitter messages.",
    primaryModel: "grok-2",
    fallbackModel: "gpt-3.5-turbo",
    temperature: 0.3,
    maxTokens: 2048,
  },
  {
    feature: "guide-writer",
    featureLabel: "Guide Writer",
    featureDescription: "Generate step-by-step task guides from raw airdrop instructions.",
    primaryModel: "gpt-4o",
    fallbackModel: "claude-3-5-sonnet",
    temperature: 0.7,
    maxTokens: 4096,
  },
  {
    feature: "risk-forecast",
    featureLabel: "Risk Forecast",
    featureDescription: "Assess airdrop legitimacy and estimate Sybil-detection risk.",
    primaryModel: "grok-2",
    fallbackModel: "gpt-4-turbo",
    temperature: 0.4,
    maxTokens: 1024,
  },
  {
    feature: "tag-extractor",
    featureLabel: "Tag Extractor",
    featureDescription: "Auto-tag projects and tasks with relevant ecosystem labels.",
    primaryModel: "gpt-3.5-turbo",
    fallbackModel: "claude-3-haiku",
    temperature: 0.2,
    maxTokens: 512,
  },
  {
    feature: "task-summarizer",
    featureLabel: "Task Summarizer",
    featureDescription: "Generate concise task descriptions from long-form project docs.",
    primaryModel: "claude-3-haiku",
    fallbackModel: "gpt-3.5-turbo",
    temperature: 0.5,
    maxTokens: 1024,
  },
  {
    feature: "wallet-optimizer",
    featureLabel: "Wallet Optimizer",
    featureDescription: "Suggest optimal wallet rotation and task scheduling strategies.",
    primaryModel: "gpt-4o",
    fallbackModel: "claude-3-5-sonnet",
    temperature: 0.6,
    maxTokens: 2048,
  },
];

export const mockTaxonomy: TaxonomyItem[] = [
  // Project categories
  { id: "tax-1", type: "project-category", label: "Layer 1", color: "#3e63dd", builtIn: true, usageCount: 3 },
  { id: "tax-2", type: "project-category", label: "Layer 2", color: "#8e4ec6", builtIn: true, usageCount: 5 },
  { id: "tax-3", type: "project-category", label: "DeFi", color: "#12a594", builtIn: true, usageCount: 8 },
  { id: "tax-4", type: "project-category", label: "GameFi", color: "#f76b15", builtIn: true, usageCount: 2 },
  { id: "tax-5", type: "project-category", label: "DePIN", color: "#e5484d", builtIn: true, usageCount: 1 },
  { id: "tax-6", type: "project-category", label: "AI Agents", color: "#46a758", builtIn: false, usageCount: 0 },
  { id: "tax-7", type: "project-category", label: "SocialFi", color: "#d6409f", builtIn: false, usageCount: 1 },
  // Task tags
  { id: "tax-8", type: "task-tag", label: "On-chain", color: "#3e63dd", builtIn: true, usageCount: 24 },
  { id: "tax-9", type: "task-tag", label: "Social", color: "#d6409f", builtIn: true, usageCount: 12 },
  { id: "tax-10", type: "task-tag", label: "KYC", color: "#e5484d", builtIn: true, usageCount: 3 },
  { id: "tax-11", type: "task-tag", label: "Faucet", color: "#46a758", builtIn: true, usageCount: 5 },
  { id: "tax-12", type: "task-tag", label: "Bridge", color: "#f76b15", builtIn: false, usageCount: 8 },
  { id: "tax-13", type: "task-tag", label: "Daily", color: "#00a2c7", builtIn: false, usageCount: 6 },
  // Project statuses
  { id: "tax-14", type: "project-status", label: "Active", color: "#46a758", builtIn: true, usageCount: 4 },
  { id: "tax-15", type: "project-status", label: "Snapshot", color: "#f76b15", builtIn: true, usageCount: 1 },
  { id: "tax-16", type: "project-status", label: "Completed", color: "#8e8c99", builtIn: true, usageCount: 1 },
  { id: "tax-17", type: "project-status", label: "Paused", color: "#e54d2e", builtIn: false, usageCount: 0 },
];

export const mockIngestionSettings: IngestionSettings = {
  crawlDepth: 3,
  skipImages: true,
  textOnly: false,
  autoScrapeEnabled: true,
  scrapeIntervalHours: 6,
  priorityDomains: ["mirror.xyz", "medium.com", "docs.layerzero.network", "l2beat.com"],
  maxItemsPerRun: 50,
  deduplication: true,
};

export const mockApiLogs: ApiLog[] = [
  { id: "log-1", timestamp: "2026-03-12T07:10:00Z", service: "OpenAI", endpoint: "/v1/chat/completions", statusCode: 200, latencyMs: 1240, tokensUsed: 1820, costUsd: 0.018, success: true },
  { id: "log-2", timestamp: "2026-03-12T07:08:30Z", service: "Firecrawl", endpoint: "/v1/scrape", statusCode: 200, latencyMs: 3400, success: true },
  { id: "log-3", timestamp: "2026-03-12T07:05:00Z", service: "Grok", endpoint: "/v1/chat", statusCode: 200, latencyMs: 880, tokensUsed: 950, costUsd: 0.004, success: true },
  { id: "log-4", timestamp: "2026-03-12T06:58:12Z", service: "CometAPI", endpoint: "/channels/fetch", statusCode: 200, latencyMs: 2100, success: true },
  { id: "log-5", timestamp: "2026-03-12T06:45:00Z", service: "Grok", endpoint: "/v1/chat", statusCode: 401, latencyMs: 340, success: false, errorMessage: "Invalid API key. Token has expired." },
  { id: "log-6", timestamp: "2026-03-12T06:30:00Z", service: "OpenAI", endpoint: "/v1/chat/completions", statusCode: 200, latencyMs: 1560, tokensUsed: 2240, costUsd: 0.022, success: true },
  { id: "log-7", timestamp: "2026-03-12T06:15:00Z", service: "Firecrawl", endpoint: "/v1/crawl", statusCode: 429, latencyMs: 120, success: false, errorMessage: "Rate limit exceeded. Retry after 60s." },
  { id: "log-8", timestamp: "2026-03-12T06:00:00Z", service: "Anthropic", endpoint: "/v1/messages", statusCode: 200, latencyMs: 720, tokensUsed: 600, costUsd: 0.003, success: true },
  { id: "log-9", timestamp: "2026-03-12T05:45:00Z", service: "CometAPI", endpoint: "/channels/fetch", statusCode: 200, latencyMs: 1800, success: true },
  { id: "log-10", timestamp: "2026-03-12T05:30:00Z", service: "OpenAI", endpoint: "/v1/chat/completions", statusCode: 200, latencyMs: 980, tokensUsed: 1100, costUsd: 0.011, success: true },
];
