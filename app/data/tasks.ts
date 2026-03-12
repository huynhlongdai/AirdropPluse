export type TaskType = "onchain" | "social" | "daily-checkin" | "one-time";
export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "backlog" | "in-progress" | "review" | "completed";
export type RecurringCycle = "daily" | "weekly" | "monthly" | null;

export interface TaskExecution {
  walletId: string;
  walletName: string;
  address: string;
  status: "pending" | "done" | "failed";
  completedAt?: string;
  txHash?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  recurring: RecurringCycle;
  projectId?: string;
  projectName?: string;
  chainId?: string;
  estimatedGasFee?: string;
  gasCurrency?: string;
  deadline?: string;
  createdAt: string;
  executions: TaskExecution[];
  linkedIdentityIds?: string[];
  tags?: string[];
  isOverdue?: boolean;
  isDailyReset?: boolean;
}

// Type icons map (for reference in components)
export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  "onchain": "On-chain",
  "social": "Social",
  "daily-checkin": "Daily Check-in",
  "one-time": "One-time",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  "in-progress": "In Progress",
  review: "Review",
  completed: "Completed",
};

export const mockTasks: Task[] = [
  // --- zkSync Era ---
  {
    id: "task-1",
    title: "Bridge ETH to zkSync Era",
    description: "Use the official zkSync bridge to deposit at least 0.05 ETH",
    type: "onchain",
    priority: "high",
    status: "completed",
    recurring: null,
    projectId: "1",
    projectName: "zkSync Era",
    chainId: "zksync",
    estimatedGasFee: "0.005",
    gasCurrency: "ETH",
    deadline: "2024-03-15",
    createdAt: "2024-01-10",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "done", completedAt: "2024-01-15", txHash: "0xabc...001" },
      { walletId: "sub-1b", walletName: "Base Interactor", address: "0x1234...7890", status: "done", completedAt: "2024-01-16", txHash: "0xabc...002" },
    ],
    linkedIdentityIds: ["id1"],
    tags: ["bridge", "zksync"],
  },
  {
    id: "task-2",
    title: "Swap tokens on SyncSwap",
    description: "Perform at least 5 token swaps on SyncSwap DEX",
    type: "onchain",
    priority: "high",
    status: "in-progress",
    recurring: null,
    projectId: "1",
    projectName: "zkSync Era",
    chainId: "zksync",
    estimatedGasFee: "0.003",
    gasCurrency: "ETH",
    deadline: "2024-03-15",
    createdAt: "2024-01-12",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "done", completedAt: "2024-01-20", txHash: "0xdef...003" },
      { walletId: "sub-1b", walletName: "Base Interactor", address: "0x1234...7890", status: "pending" },
    ],
    linkedIdentityIds: [],
    tags: ["swap", "dex"],
  },
  {
    id: "task-3",
    title: "Provide liquidity on Mute.io",
    description: "Add ETH/USDC liquidity on Mute.io AMM",
    type: "onchain",
    priority: "medium",
    status: "backlog",
    recurring: null,
    projectId: "1",
    projectName: "zkSync Era",
    chainId: "zksync",
    estimatedGasFee: "0.007",
    gasCurrency: "ETH",
    deadline: "2024-03-01",
    createdAt: "2024-01-12",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "pending" },
    ],
    tags: ["liquidity", "defi"],
    isOverdue: true,
  },
  // --- LayerZero ---
  {
    id: "task-4",
    title: "Bridge using Stargate Finance",
    description: "Bridge USDC via Stargate to 3+ different chains",
    type: "onchain",
    priority: "high",
    status: "completed",
    recurring: null,
    projectId: "2",
    projectName: "LayerZero",
    chainId: "ethereum",
    estimatedGasFee: "0.012",
    gasCurrency: "ETH",
    deadline: "2024-02-01",
    createdAt: "2024-01-05",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "done", completedAt: "2024-01-20", txHash: "0xghi...004" },
    ],
    linkedIdentityIds: ["id1"],
    tags: ["bridge", "layerzero"],
  },
  {
    id: "task-5",
    title: "Bridge to 5+ different chains",
    description: "Use LayerZero omnichain routing to bridge to at least 5 chains",
    type: "onchain",
    priority: "high",
    status: "review",
    recurring: null,
    projectId: "2",
    projectName: "LayerZero",
    estimatedGasFee: "0.02",
    gasCurrency: "ETH",
    deadline: "2024-03-01",
    createdAt: "2024-01-05",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "done", completedAt: "2024-01-28" },
    ],
    tags: ["bridge", "cross-chain"],
  },
  // --- Social Tasks ---
  {
    id: "task-6",
    title: "Follow Arbitrum on Twitter",
    description: "Follow @arbitrum and retweet the latest announcement",
    type: "social",
    priority: "low",
    status: "completed",
    recurring: null,
    projectId: "4",
    projectName: "Galxe Campaign: Arbitrum",
    createdAt: "2024-01-17",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "done", completedAt: "2024-01-18" },
    ],
    linkedIdentityIds: ["id1", "id2"],
    tags: ["twitter", "social"],
  },
  {
    id: "task-7",
    title: "Join Discord server",
    description: "Join the Arbitrum Discord and complete verification",
    type: "social",
    priority: "low",
    status: "completed",
    recurring: null,
    projectId: "4",
    projectName: "Galxe Campaign: Arbitrum",
    createdAt: "2024-01-17",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "done", completedAt: "2024-01-18" },
    ],
    linkedIdentityIds: ["id2"],
    tags: ["discord", "social"],
  },
  {
    id: "task-8",
    title: "Complete quiz on Galxe",
    description: "Answer all 5 questions correctly to earn OAT",
    type: "one-time",
    priority: "medium",
    status: "in-progress",
    recurring: null,
    projectId: "4",
    projectName: "Galxe Campaign: Arbitrum",
    deadline: "2024-02-28",
    createdAt: "2024-01-17",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "pending" },
      { walletId: "sub-1b", walletName: "Base Interactor", address: "0x1234...7890", status: "pending" },
    ],
    linkedIdentityIds: ["id1"],
    tags: ["galxe", "quiz"],
    isOverdue: true,
  },
  // --- Daily Check-ins ---
  {
    id: "task-9",
    title: "zkSync Era Daily Check-in",
    description: "Log in and check the dashboard daily to maintain activity score",
    type: "daily-checkin",
    priority: "medium",
    status: "in-progress",
    recurring: "daily",
    projectId: "1",
    projectName: "zkSync Era",
    chainId: "zksync",
    createdAt: "2024-01-10",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "done", completedAt: "2024-03-12" },
      { walletId: "sub-1b", walletName: "Base Interactor", address: "0x1234...7890", status: "pending" },
      { walletId: "sub-3a", walletName: "Solana Airdrop Hunter", address: "GKot5...Xkq", status: "pending" },
    ],
    isDailyReset: true,
    tags: ["daily", "checkin"],
  },
  {
    id: "task-10",
    title: "Starknet Odyssey — Daily Quest",
    description: "Complete one daily quest on Starknet Odyssey to earn XP",
    type: "daily-checkin",
    priority: "high",
    status: "backlog",
    recurring: "daily",
    projectId: "3",
    projectName: "Starknet Odyssey",
    chainId: "starknet",
    estimatedGasFee: "0.001",
    gasCurrency: "ETH",
    createdAt: "2024-01-08",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "pending" },
      { walletId: "sub-2a", walletName: "BSC Runner", address: "0xAbCd...7890", status: "pending" },
    ],
    isDailyReset: true,
    tags: ["daily", "starknet"],
  },
  {
    id: "task-11",
    title: "Swap on Uniswap V3 (Base)",
    description: "Perform a swap on Uniswap V3 deployed on Base chain",
    type: "onchain",
    priority: "medium",
    status: "completed",
    recurring: null,
    projectId: "6",
    projectName: "Base Ecosystem",
    chainId: "base",
    estimatedGasFee: "0.002",
    gasCurrency: "ETH",
    createdAt: "2024-01-14",
    executions: [
      { walletId: "sub-1b", walletName: "Base Interactor", address: "0x1234...7890", status: "done", completedAt: "2024-01-19", txHash: "0xjkl...010" },
    ],
    linkedIdentityIds: ["id2"],
    tags: ["swap", "base", "uniswap"],
  },
  {
    id: "task-12",
    title: "Weekly Protocol Rotation (Sui)",
    description: "Interact with at least 3 Sui protocols every week to maintain activity",
    type: "onchain",
    priority: "medium",
    status: "backlog",
    recurring: "weekly",
    projectId: "5",
    projectName: "Sui Network",
    chainId: "sui",
    estimatedGasFee: "0.001",
    gasCurrency: "SUI",
    deadline: "2024-03-20",
    createdAt: "2024-01-22",
    executions: [
      { walletId: "sub-3a", walletName: "Solana Airdrop Hunter", address: "GKot5...Xkq", status: "pending" },
    ],
    tags: ["weekly", "sui", "protocol"],
  },
];
