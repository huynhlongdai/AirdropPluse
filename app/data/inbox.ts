export type InboxStatus = "processing" | "review" | "approved" | "rejected";
export type InboxItemType = "task" | "news" | "flash-task";

export type NewsTag =
  | "Vesting"
  | "Mainnet"
  | "Partnership"
  | "Scam Alert"
  | "TGE"
  | "Snapshot"
  | "Funding"
  | "Airdrop"
  | "New Project"
  | "Update";

export type TaskClassification = "recurring" | "one-time" | "instant";

export interface ExtractedData {
  // Common
  projectName?: string;
  category?: string;
  chain?: string[];
  fundingAmount?: string;
  investors?: string[];
  steps?: string[];
  estimatedCost?: string;
  potentialValue?: string;
  // Task fields
  taskTitle?: string;
  taskType?: "onchain" | "social" | "daily-checkin" | "one-time";
  taskClassification?: TaskClassification;
  taskPriority?: "high" | "medium" | "low";
  deadline?: string;
  guideUrl?: string;
  gasFee?: string;
  isFlash?: boolean; // instant/flash tasks
  flashExpiresAt?: string;
  subtasks?: string[];
  // News fields
  newsTitle?: string;
  newsTags?: NewsTag[];
  newsType?: "news" | "milestone" | "status-change" | "announcement";
  newsSource?: string;
}

export interface InboxItem {
  id: string;
  rawContent: string;
  sourceType: "telegram" | "link" | "text" | "image";
  sourceUrl?: string;
  itemType: InboxItemType;
  status: InboxStatus;
  extractedData?: ExtractedData;
  createdAt: string;
  processedAt?: string;
}

export const mockInboxItems: InboxItem[] = [
  {
    id: "i1",
    rawContent:
      "🚨 FLASH MINT ALERT 🚨\nScroll Genesis NFT — FREE mint, only 500 spots left! FCFS. Must bridge ETH to Scroll first. Mint ends in 2 hours!\nhttps://scroll.io/genesis-nft",
    sourceType: "telegram",
    itemType: "flash-task",
    status: "review",
    extractedData: {
      projectName: "Scroll",
      taskTitle: "Mint Scroll Genesis NFT (FCFS)",
      taskType: "onchain",
      taskClassification: "instant",
      taskPriority: "high",
      isFlash: true,
      flashExpiresAt: "2024-03-13T08:00:00Z",
      guideUrl: "https://scroll.io/genesis-nft",
      chain: ["scroll", "ethereum"],
      steps: ["Bridge ETH to Scroll", "Go to genesis-nft page", "Connect wallet", "Click Mint"],
      gasFee: "~$5",
      newsTags: ["Airdrop"],
    },
    createdAt: "2024-03-12T06:00:00Z",
    processedAt: "2024-03-12T06:01:00Z",
  },
  {
    id: "i2",
    rawContent:
      "Check out Scroll - zkEVM L2 on Ethereum! Backed by Polychain ($50M Series A). Steps: 1) Bridge ETH 2) Swap on Ambient 3) Provide liquidity 4) Use Scroll Name Service. Snapshot expected Q1 2024.",
    sourceType: "telegram",
    itemType: "task",
    status: "review",
    extractedData: {
      projectName: "Scroll",
      category: "mainnet",
      chain: ["ethereum", "scroll"],
      fundingAmount: "$50M",
      investors: ["Polychain Capital"],
      taskTitle: "Complete Scroll Ecosystem Tasks",
      taskType: "onchain",
      taskClassification: "one-time",
      taskPriority: "high",
      steps: ["Bridge ETH to Scroll", "Swap tokens on Ambient Finance", "Provide liquidity", "Use Scroll Name Service"],
      estimatedCost: "$60-120",
      potentialValue: "high",
      subtasks: ["Bridge ETH to Scroll", "Swap on Ambient Finance", "Provide liquidity", "Register Scroll Name Service"],
    },
    createdAt: "2024-01-26T10:30:00Z",
    processedAt: "2024-01-26T10:31:00Z",
  },
  {
    id: "i3",
    rawContent:
      "⚡ Linea Daily Voyage Quest is LIVE!\nComplete a swap on Lynex every day this week to earn Linea XP.\nTask resets at 00:00 UTC daily.\nhttps://linea.build/voyage",
    sourceType: "telegram",
    itemType: "task",
    status: "review",
    extractedData: {
      projectName: "Linea",
      taskTitle: "Linea Daily Voyage — Swap on Lynex",
      taskType: "daily-checkin",
      taskClassification: "recurring",
      taskPriority: "medium",
      chain: ["linea"],
      guideUrl: "https://linea.build/voyage",
      steps: ["Go to Lynex", "Swap any token pair", "Claim XP"],
      gasFee: "~$2",
      subtasks: ["Connect wallet on Linea", "Perform swap on Lynex", "Verify XP credited"],
    },
    createdAt: "2024-01-26T14:15:00Z",
    processedAt: "2024-01-26T14:16:00Z",
  },
  {
    id: "i4",
    rawContent:
      "New Galxe campaign for Linea! Free NFT + potential airdrop. Follow @LineaBuild, join Discord, complete quiz, bridge $10 to Linea.",
    sourceType: "text",
    itemType: "task",
    status: "processing",
    createdAt: "2024-01-26T16:45:00Z",
  },
  {
    id: "i5",
    rawContent:
      "📢 zkSync Era announces ZK Token Airdrop!\n💰 Total supply: 21B ZK\n🗓 Snapshot: Already taken\n📅 Claim date: June 17, 2024\n⚠️ Sybil filter applied — only genuine users qualify\nSource: @zksync on Twitter",
    sourceType: "telegram",
    itemType: "news",
    status: "review",
    extractedData: {
      projectName: "zkSync Era",
      newsTitle: "ZK Token Airdrop Announced — Claim June 17",
      newsType: "announcement",
      newsTags: ["TGE", "Airdrop", "Snapshot"],
      newsSource: "Twitter @zksync",
      chain: ["zksync"],
    },
    createdAt: "2024-03-10T09:00:00Z",
    processedAt: "2024-03-10T09:01:00Z",
  },
  {
    id: "i6",
    rawContent:
      "🚨 SCAM ALERT: Fake LayerZero airdrop site circulating. Do NOT connect your wallet to layerzero-claim.io — it's a drainer. Official claim will be at layerzero.network only.",
    sourceType: "telegram",
    itemType: "news",
    status: "review",
    extractedData: {
      projectName: "LayerZero",
      newsTitle: "Scam Alert: Fake LayerZero Claim Site",
      newsType: "announcement",
      newsTags: ["Scam Alert"],
      newsSource: "Telegram",
    },
    createdAt: "2024-03-11T15:30:00Z",
    processedAt: "2024-03-11T15:31:00Z",
  },
  {
    id: "i7",
    rawContent:
      "Berachain testnet is live! Artio testnet - get faucet tokens, swap on BEX, provide liquidity, mint Bera NFTs. Huge VC backing: Polychain, Framework, Hack VC.",
    sourceType: "telegram",
    itemType: "task",
    status: "review",
    extractedData: {
      projectName: "Berachain",
      category: "testnet",
      chain: ["berachain"],
      investors: ["Polychain Capital", "Framework Ventures", "Hack VC"],
      taskTitle: "Berachain Artio Testnet Tasks",
      taskType: "onchain",
      taskClassification: "one-time",
      taskPriority: "high",
      steps: ["Get testnet tokens from faucet", "Swap tokens on BEX", "Provide liquidity", "Mint Bera NFTs"],
      estimatedCost: "Free",
      potentialValue: "very-high",
      subtasks: ["Claim faucet tokens", "Swap on BEX", "Add liquidity", "Mint Bera NFT"],
    },
    createdAt: "2024-01-26T09:20:00Z",
    processedAt: "2024-01-26T09:21:00Z",
  },
];
