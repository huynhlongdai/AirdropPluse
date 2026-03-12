export type ProjectStatus = "discovery" | "active" | "snapshot" | "claiming" | "claimed" | "archived";
export type ProjectCategory =
  | "testnet"
  | "mainnet"
  | "galxe"
  | "zealy"
  | "layer3"
  | "social"
  | "defi"
  | "nft"
  | "ai"
  | "other";
export type Chain =
  | "ethereum"
  | "solana"
  | "arbitrum"
  | "optimism"
  | "base"
  | "polygon"
  | "zksync"
  | "starknet"
  | "sui"
  | "aptos"
  | "bnb"
  | "avalanche"
  | "near";
export type CostType = "free" | "paid";
export type FundingRound = "pre-seed" | "seed" | "series-a" | "series-b" | "series-c" | "strategic" | "public";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type Sentiment = "bullish" | "neutral" | "bearish";
export type ProjectType = "testnet" | "mainnet" | "incentivized" | "campaign" | "protocol";

export interface ProjectTask {
  id: string;
  description: string;
  completed: boolean;
  walletId?: string;
  completedAt?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

export interface FundingRoundInfo {
  round: FundingRound;
  amount: string;
  date: string;
  leadInvestors: string[];
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  description?: string;
}

export interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  content: string;
  source?: string;
  type: "news" | "milestone" | "status-change" | "announcement";
}

export interface LinkedWallet {
  walletId: string;
  walletName: string;
  address: string;
  tasksCompleted: number;
  totalTasks: number;
  lastInteraction?: string;
}

export interface LinkedIdentity {
  identityId: string;
  username: string;
  platform: string;
  tasksCompleted: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  projectType: ProjectType;
  chain: Chain[];
  ecosystem: string[];
  status: ProjectStatus;
  costType: CostType;
  estimatedCost?: string;
  potentialValue: "low" | "medium" | "high" | "very-high";
  hypeScore: number; // 0-100
  riskLevel: RiskLevel;
  riskFactors: string[];
  sentiment: Sentiment;
  fundingAmount?: string;
  fundingRounds?: FundingRoundInfo[];
  investors?: string[];
  tgeDate?: string;
  totalSupply?: string;
  vestingInfo?: string;
  milestones: Milestone[];
  imageUrl: string;
  logoUrl?: string;
  tasks: ProjectTask[];
  snapshotDate?: string;
  claimDate?: string;
  expiryDate?: string;
  priority: "low" | "medium" | "high";
  isHot?: boolean;
  isNew?: boolean;
  sourceUrl?: string;
  twitterUrl?: string;
  discordUrl?: string;
  telegramUrl?: string;
  /** IDs of SubWallets participating in this project */
  participatingWalletIds: string[];
  // -- end participation --
  linkedWallets: LinkedWallet[];
  linkedIdentities: LinkedIdentity[];
  updates: ProjectUpdate[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "zkSync Era",
    description:
      "Layer 2 scaling solution using zero-knowledge rollups. Complete transactions to qualify for potential airdrop.",
    category: "mainnet",
    projectType: "mainnet",
    chain: ["zksync", "ethereum"],
    ecosystem: ["Layer 2", "ZK Rollup", "EVM"],
    status: "active",
    costType: "paid",
    estimatedCost: "$50-100",
    potentialValue: "very-high",
    hypeScore: 92,
    riskLevel: "low",
    riskFactors: [],
    sentiment: "bullish",
    fundingAmount: "$458M",
    fundingRounds: [
      { round: "series-b", amount: "$200M", date: "2022-11", leadInvestors: ["a16z", "Dragonfly"] },
      { round: "series-a", amount: "$50M", date: "2021-11", leadInvestors: ["Placeholder", "1kx"] },
    ],
    investors: ["a16z", "Dragonfly", "Placeholder", "1kx"],
    tgeDate: "2024-Q2",
    totalSupply: "21,000,000,000",
    vestingInfo: "Linear vesting over 4 years",
    milestones: [
      { id: "m1", title: "Mainnet Launch", date: "2023-03-24", completed: true, description: "zkSync Era mainnet goes live" },
      { id: "m2", title: "1M Transactions", date: "2023-06-01", completed: true },
      { id: "m3", title: "Token Launch (TGE)", date: "2024-06-01", completed: false, description: "Expected Q2 2024" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    tasks: [
      { id: "t1", description: "Bridge ETH to zkSync Era", completed: true, walletId: "w1", completedAt: "2024-01-15", priority: "high" },
      { id: "t2", description: "Swap tokens on SyncSwap", completed: true, walletId: "w1", completedAt: "2024-01-16", priority: "high" },
      { id: "t3", description: "Provide liquidity on Mute.io", completed: false, priority: "medium", dueDate: "2024-03-01" },
      { id: "t4", description: "Use zkSync Name Service", completed: false, priority: "low" },
      { id: "t5", description: "Interact with 5+ protocols", completed: false, priority: "high", dueDate: "2024-03-15" },
    ],
    snapshotDate: "2024-03-15",
    priority: "high",
    isHot: true,
    sourceUrl: "https://zksync.io",
    twitterUrl: "https://twitter.com/zksync",
    discordUrl: "https://discord.gg/zksync",
    participatingWalletIds: ["sub-1a", "sub-1b"],
    linkedWallets: [
      { walletId: "w1", walletName: "Main Wallet", address: "0x1a2b...3c4d", tasksCompleted: 2, totalTasks: 5, lastInteraction: "2024-01-16" },
      { walletId: "w2", walletName: "Farming Wallet 1", address: "0x5e6f...7a8b", tasksCompleted: 1, totalTasks: 5, lastInteraction: "2024-01-12" },
    ],
    linkedIdentities: [
      { identityId: "id1", username: "@cryptofarmer", platform: "Twitter", tasksCompleted: 1 },
    ],
    updates: [
      { id: "u1", date: "2024-01-25", title: "zkSync Era Surpasses $2B TVL", content: "zkSync Era has crossed $2 billion in total value locked, marking a new milestone.", source: "Twitter", type: "news" },
      { id: "u2", date: "2024-01-10", title: "New Protocol Integration: Mute.io", content: "Mute.io DEX is now live on zkSync Era with full AMM functionality.", type: "milestone" },
    ],
    notes: "High priority — snapshot coming in March. Need to complete liquidity tasks.",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-25",
  },
  {
    id: "2",
    name: "LayerZero",
    description: "Omnichain interoperability protocol. Bridge assets across multiple chains to qualify.",
    category: "mainnet",
    projectType: "protocol",
    chain: ["ethereum", "arbitrum", "optimism", "polygon"],
    ecosystem: ["Interoperability", "Cross-chain", "Omnichain"],
    status: "snapshot",
    costType: "paid",
    estimatedCost: "$100-200",
    potentialValue: "very-high",
    hypeScore: 88,
    riskLevel: "low",
    riskFactors: [],
    sentiment: "bullish",
    fundingAmount: "$293M",
    fundingRounds: [
      { round: "series-b", amount: "$135M", date: "2022-11", leadInvestors: ["a16z", "Sequoia"] },
    ],
    investors: ["a16z", "Sequoia", "FTX Ventures"],
    tgeDate: "2024-Q1",
    totalSupply: "1,000,000,000",
    vestingInfo: "4-year vesting with 1-year cliff",
    milestones: [
      { id: "m4", title: "V1 Launch", date: "2022-03-01", completed: true },
      { id: "m5", title: "Snapshot", date: "2024-02-01", completed: true },
      { id: "m6", title: "ZRO Token Claim", date: "2024-03-01", completed: false },
    ],
    imageUrl: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=400&fit=crop",
    tasks: [
      { id: "t6", description: "Bridge using Stargate Finance", completed: true, walletId: "w1", completedAt: "2024-01-20", priority: "high" },
      { id: "t7", description: "Use Aptos Bridge", completed: true, walletId: "w1", completedAt: "2024-01-21", priority: "medium" },
      { id: "t8", description: "Complete 10+ transactions", completed: true, walletId: "w1", completedAt: "2024-01-25", priority: "high" },
      { id: "t9", description: "Bridge to 5+ different chains", completed: false, priority: "high", dueDate: "2024-02-01" },
    ],
    snapshotDate: "2024-02-01",
    claimDate: "2024-03-01",
    priority: "high",
    isHot: true,
    sourceUrl: "https://layerzero.network",
    twitterUrl: "https://twitter.com/LayerZero_Labs",
    participatingWalletIds: ["sub-1a", "sub-2a"],
    linkedWallets: [
      { walletId: "w1", walletName: "Main Wallet", address: "0x1a2b...3c4d", tasksCompleted: 3, totalTasks: 4, lastInteraction: "2024-01-25" },
    ],
    linkedIdentities: [
      { identityId: "id1", username: "@cryptofarmer", platform: "Twitter", tasksCompleted: 2 },
      { identityId: "id2", username: "cryptofarmer#1234", platform: "Discord", tasksCompleted: 1 },
    ],
    updates: [
      { id: "u3", date: "2024-02-01", title: "Snapshot Completed", content: "LayerZero snapshot has been taken. Claim date announced for March 1st.", type: "status-change" },
      { id: "u4", date: "2024-01-15", title: "Sybil Check Warning", content: "Team announced sybil filtering will be applied. Avoid using multiple wallets from same IP.", source: "Discord", type: "announcement" },
    ],
    createdAt: "2024-01-05",
    updatedAt: "2024-02-01",
  },
  {
    id: "3",
    name: "Starknet Odyssey",
    description: "Complete quests on Starknet testnet to earn NFTs and qualify for mainnet airdrop.",
    category: "testnet",
    projectType: "testnet",
    chain: ["starknet"],
    ecosystem: ["Layer 2", "ZK-STARK", "Cairo"],
    status: "active",
    costType: "free",
    potentialValue: "high",
    hypeScore: 74,
    riskLevel: "medium",
    riskFactors: ["Sybil filter risk", "Low activity on testnet"],
    sentiment: "bullish",
    fundingAmount: "$282M",
    fundingRounds: [
      { round: "series-c", amount: "$100M", date: "2022-11", leadInvestors: ["Paradigm", "Sequoia"] },
    ],
    investors: ["Paradigm", "Sequoia", "Alameda Research"],
    tgeDate: "2024-Q3",
    totalSupply: "10,000,000,000",
    vestingInfo: "Community allocation unlocked at TGE",
    milestones: [
      { id: "m7", title: "Mainnet Alpha", date: "2022-11-29", completed: true },
      { id: "m8", title: "Cairo 1.0", date: "2023-07-01", completed: true },
      { id: "m9", title: "Token Launch", date: "2024-09-01", completed: false },
    ],
    imageUrl: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&h=400&fit=crop",
    tasks: [
      { id: "t10", description: "Create Starknet wallet", completed: true, walletId: "w2", completedAt: "2024-01-12", priority: "high" },
      { id: "t11", description: "Complete Identity Quest", completed: true, walletId: "w2", completedAt: "2024-01-13", priority: "medium" },
      { id: "t12", description: "Bridge assets on testnet", completed: false, priority: "high", dueDate: "2024-04-15" },
      { id: "t13", description: "Swap on JediSwap", completed: false, priority: "medium" },
      { id: "t14", description: "Mint Starknet ID", completed: false, priority: "low" },
    ],
    expiryDate: "2024-04-30",
    priority: "medium",
    sourceUrl: "https://starknet.io",
    twitterUrl: "https://twitter.com/Starknet",
    discordUrl: "https://discord.gg/starknet",
    participatingWalletIds: ["sub-1a", "sub-2a"],
    linkedWallets: [
      { walletId: "w2", walletName: "Farming Wallet 1", address: "0x5e6f...7a8b", tasksCompleted: 2, totalTasks: 5, lastInteraction: "2024-01-13" },
      { walletId: "w3", walletName: "Farming Wallet 2", address: "0x9c0d...1e2f", tasksCompleted: 0, totalTasks: 5 },
    ],
    linkedIdentities: [],
    updates: [
      { id: "u5", date: "2024-01-20", title: "New Quest Added: DeFi Mastery", content: "Starknet Odyssey adds a new DeFi quest track with 500 XP rewards.", type: "announcement" },
    ],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-20",
  },
  {
    id: "4",
    name: "Galxe Campaign: Arbitrum",
    description: "Complete social tasks and on-chain activities to earn Arbitrum ecosystem NFTs.",
    category: "galxe",
    projectType: "campaign",
    chain: ["arbitrum"],
    ecosystem: ["Layer 2", "Optimistic Rollup"],
    status: "active",
    costType: "free",
    potentialValue: "medium",
    hypeScore: 55,
    riskLevel: "low",
    riskFactors: [],
    sentiment: "neutral",
    milestones: [],
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=400&fit=crop",
    tasks: [
      { id: "t15", description: "Follow Arbitrum on Twitter", completed: true, completedAt: "2024-01-18", priority: "low" },
      { id: "t16", description: "Join Discord server", completed: true, completedAt: "2024-01-18", priority: "low" },
      { id: "t17", description: "Complete quiz", completed: false, priority: "medium" },
      { id: "t18", description: "Make 3 swaps on Arbitrum", completed: false, priority: "medium", dueDate: "2024-02-28" },
    ],
    expiryDate: "2024-02-28",
    priority: "low",
    sourceUrl: "https://galxe.com",
    participatingWalletIds: ["sub-1a", "sub-1b", "sub-2a"],
    linkedWallets: [
      { walletId: "w1", walletName: "Main Wallet", address: "0x1a2b...3c4d", tasksCompleted: 2, totalTasks: 4, lastInteraction: "2024-01-18" },
    ],
    linkedIdentities: [
      { identityId: "id1", username: "@cryptofarmer", platform: "Twitter", tasksCompleted: 1 },
    ],
    updates: [],
    createdAt: "2024-01-17",
    updatedAt: "2024-01-18",
  },
  {
    id: "5",
    name: "Sui Network",
    description: "Participate in Sui testnet waves and mainnet activities for potential airdrop.",
    category: "mainnet",
    projectType: "mainnet",
    chain: ["sui"],
    ecosystem: ["Layer 1", "Move VM", "Parallel Execution"],
    status: "discovery",
    costType: "paid",
    estimatedCost: "$30-50",
    potentialValue: "high",
    hypeScore: 68,
    riskLevel: "medium",
    riskFactors: ["No confirmed airdrop", "Team anonymous participation unclear"],
    sentiment: "bullish",
    fundingAmount: "$336M",
    fundingRounds: [
      { round: "series-b", amount: "$300M", date: "2022-09", leadInvestors: ["a16z", "FTX Ventures"] },
    ],
    investors: ["a16z", "FTX Ventures", "Coinbase Ventures"],
    milestones: [
      { id: "m10", title: "Mainnet Launch", date: "2023-05-03", completed: true },
      { id: "m11", title: "SuiNS Launch", date: "2023-09-01", completed: true },
      { id: "m12", title: "Ecosystem Fund Distribution", date: "2024-06-01", completed: false },
    ],
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
    tasks: [
      { id: "t19", description: "Create Sui wallet", completed: false, priority: "high" },
      { id: "t20", description: "Bridge assets to Sui", completed: false, priority: "high" },
      { id: "t21", description: "Swap on Cetus Protocol", completed: false, priority: "medium" },
      { id: "t22", description: "Provide liquidity", completed: false, priority: "medium" },
      { id: "t23", description: "Mint Sui Name Service", completed: false, priority: "low" },
    ],
    priority: "medium",
    isNew: true,
    sourceUrl: "https://sui.io",
    twitterUrl: "https://twitter.com/SuiNetwork",
    discordUrl: "https://discord.gg/sui",
    participatingWalletIds: ["sub-3a"],
    linkedWallets: [],
    linkedIdentities: [],
    updates: [
      { id: "u6", date: "2024-01-22", title: "Sui Ecosystem Fund Announced", content: "$100M ecosystem fund announced to support builders on Sui.", source: "Twitter", type: "announcement" },
    ],
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
  },
  {
    id: "6",
    name: "Base Ecosystem",
    description: "Coinbase L2 - interact with Base protocols for potential rewards.",
    category: "mainnet",
    projectType: "incentivized",
    chain: ["base"],
    ecosystem: ["Layer 2", "Optimistic Rollup", "Coinbase"],
    status: "active",
    costType: "paid",
    estimatedCost: "$40-80",
    potentialValue: "medium",
    hypeScore: 72,
    riskLevel: "low",
    riskFactors: [],
    sentiment: "bullish",
    milestones: [
      { id: "m13", title: "Base Mainnet Launch", date: "2023-08-09", completed: true },
      { id: "m14", title: "Onchain Summer Campaign", date: "2023-08-15", completed: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=800&h=400&fit=crop",
    tasks: [
      { id: "t24", description: "Bridge to Base via official bridge", completed: true, walletId: "w1", completedAt: "2024-01-19", priority: "high" },
      { id: "t25", description: "Swap on Uniswap V3", completed: true, walletId: "w1", completedAt: "2024-01-19", priority: "high" },
      { id: "t26", description: "Use Aerodrome Finance", completed: false, priority: "medium" },
      { id: "t27", description: "Mint Base NFT", completed: false, priority: "low" },
    ],
    priority: "medium",
    sourceUrl: "https://base.org",
    twitterUrl: "https://twitter.com/base",
    participatingWalletIds: ["sub-1b"],
    linkedWallets: [
      { walletId: "w1", walletName: "Main Wallet", address: "0x1a2b...3c4d", tasksCompleted: 2, totalTasks: 4, lastInteraction: "2024-01-19" },
    ],
    linkedIdentities: [],
    updates: [
      { id: "u7", date: "2024-01-18", title: "Base Surpasses 100M Transactions", content: "Base has processed over 100M transactions since mainnet launch.", type: "milestone" },
    ],
    createdAt: "2024-01-14",
    updatedAt: "2024-01-19",
  },
];
