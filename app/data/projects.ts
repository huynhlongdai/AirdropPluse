export type ProjectStatus = "discovery" | "active" | "snapshot" | "claiming" | "claimed" | "archived";
export type ProjectCategory = "testnet" | "mainnet" | "galxe" | "zealy" | "layer3" | "social" | "other";
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
  | "aptos";
export type CostType = "free" | "paid";

export interface ProjectTask {
  id: string;
  description: string;
  completed: boolean;
  walletId?: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  chain: Chain[];
  status: ProjectStatus;
  costType: CostType;
  estimatedCost?: string;
  potentialValue: "low" | "medium" | "high" | "very-high";
  fundingAmount?: string;
  investors?: string[];
  imageUrl: string;
  tasks: ProjectTask[];
  snapshotDate?: string;
  claimDate?: string;
  expiryDate?: string;
  priority: "low" | "medium" | "high";
  sourceUrl?: string;
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
    chain: ["zksync"],
    status: "active",
    costType: "paid",
    estimatedCost: "$50-100",
    potentialValue: "very-high",
    fundingAmount: "$458M",
    investors: ["a16z", "Dragonfly", "Placeholder"],
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop",
    tasks: [
      { id: "t1", description: "Bridge ETH to zkSync Era", completed: true, walletId: "w1", completedAt: "2024-01-15" },
      { id: "t2", description: "Swap tokens on SyncSwap", completed: true, walletId: "w1", completedAt: "2024-01-16" },
      { id: "t3", description: "Provide liquidity on Mute.io", completed: false },
      { id: "t4", description: "Use zkSync Name Service", completed: false },
      { id: "t5", description: "Interact with 5+ protocols", completed: false },
    ],
    snapshotDate: "2024-03-15",
    priority: "high",
    sourceUrl: "https://zksync.io",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-16",
  },
  {
    id: "2",
    name: "LayerZero",
    description: "Omnichain interoperability protocol. Bridge assets across multiple chains to qualify.",
    category: "mainnet",
    chain: ["ethereum", "arbitrum", "optimism", "polygon"],
    status: "snapshot",
    costType: "paid",
    estimatedCost: "$100-200",
    potentialValue: "very-high",
    fundingAmount: "$293M",
    investors: ["a16z", "Sequoia", "FTX Ventures"],
    imageUrl: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=400&fit=crop",
    tasks: [
      {
        id: "t6",
        description: "Bridge using Stargate Finance",
        completed: true,
        walletId: "w1",
        completedAt: "2024-01-20",
      },
      { id: "t7", description: "Use Aptos Bridge", completed: true, walletId: "w1", completedAt: "2024-01-21" },
      {
        id: "t8",
        description: "Complete 10+ transactions",
        completed: true,
        walletId: "w1",
        completedAt: "2024-01-25",
      },
      { id: "t9", description: "Bridge to 5+ different chains", completed: false },
    ],
    snapshotDate: "2024-02-01",
    claimDate: "2024-03-01",
    priority: "high",
    sourceUrl: "https://layerzero.network",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-25",
  },
  {
    id: "3",
    name: "Starknet Odyssey",
    description: "Complete quests on Starknet testnet to earn NFTs and qualify for mainnet airdrop.",
    category: "testnet",
    chain: ["starknet"],
    status: "active",
    costType: "free",
    potentialValue: "high",
    fundingAmount: "$282M",
    investors: ["Paradigm", "Sequoia", "Alameda Research"],
    imageUrl: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400&h=400&fit=crop",
    tasks: [
      { id: "t10", description: "Create Starknet wallet", completed: true, walletId: "w2", completedAt: "2024-01-12" },
      { id: "t11", description: "Complete Identity Quest", completed: true, walletId: "w2", completedAt: "2024-01-13" },
      { id: "t12", description: "Bridge assets on testnet", completed: false },
      { id: "t13", description: "Swap on JediSwap", completed: false },
      { id: "t14", description: "Mint Starknet ID", completed: false },
    ],
    expiryDate: "2024-04-30",
    priority: "medium",
    sourceUrl: "https://starknet.io",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-13",
  },
  {
    id: "4",
    name: "Galxe Campaign: Arbitrum",
    description: "Complete social tasks and on-chain activities to earn Arbitrum ecosystem NFTs.",
    category: "galxe",
    chain: ["arbitrum"],
    status: "active",
    costType: "free",
    potentialValue: "medium",
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=400&fit=crop",
    tasks: [
      { id: "t15", description: "Follow Arbitrum on Twitter", completed: true, completedAt: "2024-01-18" },
      { id: "t16", description: "Join Discord server", completed: true, completedAt: "2024-01-18" },
      { id: "t17", description: "Complete quiz", completed: false },
      { id: "t18", description: "Make 3 swaps on Arbitrum", completed: false },
    ],
    expiryDate: "2024-02-28",
    priority: "low",
    sourceUrl: "https://galxe.com",
    createdAt: "2024-01-17",
    updatedAt: "2024-01-18",
  },
  {
    id: "5",
    name: "Sui Network",
    description: "Participate in Sui testnet waves and mainnet activities for potential airdrop.",
    category: "mainnet",
    chain: ["sui"],
    status: "discovery",
    costType: "paid",
    estimatedCost: "$30-50",
    potentialValue: "high",
    fundingAmount: "$336M",
    investors: ["a16z", "FTX Ventures", "Coinbase Ventures"],
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop",
    tasks: [
      { id: "t19", description: "Create Sui wallet", completed: false },
      { id: "t20", description: "Bridge assets to Sui", completed: false },
      { id: "t21", description: "Swap on Cetus Protocol", completed: false },
      { id: "t22", description: "Provide liquidity", completed: false },
      { id: "t23", description: "Mint Sui Name Service", completed: false },
    ],
    priority: "medium",
    sourceUrl: "https://sui.io",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
  },
  {
    id: "6",
    name: "Base Ecosystem",
    description: "Coinbase L2 - interact with Base protocols for potential rewards.",
    category: "mainnet",
    chain: ["base"],
    status: "active",
    costType: "paid",
    estimatedCost: "$40-80",
    potentialValue: "medium",
    imageUrl: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=400&h=400&fit=crop",
    tasks: [
      {
        id: "t24",
        description: "Bridge to Base via official bridge",
        completed: true,
        walletId: "w1",
        completedAt: "2024-01-19",
      },
      { id: "t25", description: "Swap on Uniswap V3", completed: true, walletId: "w1", completedAt: "2024-01-19" },
      { id: "t26", description: "Use Aerodrome Finance", completed: false },
      { id: "t27", description: "Mint Base NFT", completed: false },
    ],
    priority: "medium",
    sourceUrl: "https://base.org",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-19",
  },
];
