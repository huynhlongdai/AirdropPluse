export type InboxStatus = "processing" | "review" | "approved" | "rejected";

export interface InboxItem {
  id: string;
  rawContent: string;
  sourceType: "telegram" | "link" | "text" | "image";
  sourceUrl?: string;
  status: InboxStatus;
  extractedData?: {
    projectName?: string;
    category?: string;
    chain?: string[];
    fundingAmount?: string;
    investors?: string[];
    steps?: string[];
    estimatedCost?: string;
    potentialValue?: string;
  };
  createdAt: string;
  processedAt?: string;
}

export const mockInboxItems: InboxItem[] = [
  {
    id: "i1",
    rawContent:
      "Check out Scroll - zkEVM L2 on Ethereum! Backed by Polychain ($50M Series A). Steps: 1) Bridge ETH 2) Swap on Ambient 3) Provide liquidity 4) Use Scroll Name Service. Snapshot expected Q1 2024.",
    sourceType: "telegram",
    status: "review",
    extractedData: {
      projectName: "Scroll",
      category: "mainnet",
      chain: ["ethereum", "scroll"],
      fundingAmount: "$50M",
      investors: ["Polychain Capital"],
      steps: ["Bridge ETH to Scroll", "Swap tokens on Ambient Finance", "Provide liquidity", "Use Scroll Name Service"],
      estimatedCost: "$60-120",
      potentialValue: "high",
    },
    createdAt: "2024-01-26T10:30:00Z",
    processedAt: "2024-01-26T10:31:00Z",
  },
  {
    id: "i2",
    rawContent:
      "https://twitter.com/MetaMaskInst/status/1234567890 - MetaMask Snaps airdrop rumors. Complete these: Install 3+ Snaps, Use Snaps for transactions, Provide feedback.",
    sourceType: "link",
    sourceUrl: "https://twitter.com/MetaMaskInst/status/1234567890",
    status: "review",
    extractedData: {
      projectName: "MetaMask Snaps",
      category: "other",
      chain: ["ethereum"],
      steps: ["Install 3+ MetaMask Snaps", "Use Snaps for transactions", "Provide feedback on Snaps"],
      estimatedCost: "Free",
      potentialValue: "medium",
    },
    createdAt: "2024-01-26T14:15:00Z",
    processedAt: "2024-01-26T14:16:00Z",
  },
  {
    id: "i3",
    rawContent:
      "New Galxe campaign for Linea! Free NFT + potential airdrop. Follow @LineaBuild, join Discord, complete quiz, bridge $10 to Linea.",
    sourceType: "text",
    status: "processing",
    createdAt: "2024-01-26T16:45:00Z",
  },
  {
    id: "i4",
    rawContent:
      "Berachain testnet is live! Artio testnet - get faucet tokens, swap on BEX, provide liquidity, mint Bera NFTs. Huge VC backing: Polychain, Framework, Hack VC.",
    sourceType: "telegram",
    status: "review",
    extractedData: {
      projectName: "Berachain",
      category: "testnet",
      chain: ["berachain"],
      investors: ["Polychain Capital", "Framework Ventures", "Hack VC"],
      steps: ["Get testnet tokens from faucet", "Swap tokens on BEX", "Provide liquidity", "Mint Bera NFTs"],
      estimatedCost: "Free",
      potentialValue: "very-high",
    },
    createdAt: "2024-01-26T09:20:00Z",
    processedAt: "2024-01-26T09:21:00Z",
  },
];
