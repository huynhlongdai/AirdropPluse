export type TaskType = "onchain" | "social" | "daily-checkin" | "one-time";
export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "backlog" | "in-progress" | "review" | "completed";
export type RecurringCycle = "daily" | "weekly" | "monthly" | null;

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface TaskNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  type: "status-change" | "wallet-update" | "note-added" | "subtask-completed" | "deadline-changed" | "project-update";
  message: string;
  timestamp: string;
}

export interface TaskExecution {
  walletId: string;
  walletName: string;
  address: string;
  status: "pending" | "done" | "failed";
  completedAt?: string;
  txHash?: string;
  actualGasFee?: string;
  note?: string;
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
  subtasks?: Subtask[];
  notes?: TaskNote[];
  activityLog?: ActivityLog[];
  guideUrl?: string;
  proofImages?: string[];
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
    description: "Use the official zkSync bridge to deposit at least 0.05 ETH. This is a critical step for establishing on-chain activity on the zkSync ecosystem. Make sure to bridge from Ethereum mainnet for maximum weight.",
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
    guideUrl: "https://bridge.zksync.io/",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "done", completedAt: "2024-01-15", txHash: "0xabc123...001", actualGasFee: "0.0048" },
      { walletId: "sub-1b", walletName: "Base Interactor", address: "0x1234...7890", status: "done", completedAt: "2024-01-16", txHash: "0xabc123...002", actualGasFee: "0.0051" },
    ],
    linkedIdentityIds: ["id1"],
    tags: ["bridge", "zksync", "mainnet"],
    subtasks: [
      { id: "st-1-1", title: "Approve ETH transfer on Ethereum", completed: true, completedAt: "2024-01-15" },
      { id: "st-1-2", title: "Initiate bridge transaction", completed: true, completedAt: "2024-01-15" },
      { id: "st-1-3", title: "Wait for confirmation (~15 min)", completed: true, completedAt: "2024-01-15" },
      { id: "st-1-4", title: "Verify ETH received on zkSync", completed: true, completedAt: "2024-01-15" },
    ],
    notes: [
      { id: "n-1-1", content: "Used official bridge. Gas was around 0.005 ETH. Transaction confirmed in ~12 minutes.", createdAt: "2024-01-15" },
    ],
    activityLog: [
      { id: "al-1-1", type: "status-change", message: "Status changed from Backlog → In Progress", timestamp: "2024-01-14" },
      { id: "al-1-2", type: "wallet-update", message: "zkSync Farmer marked as Done (tx: 0xabc...001)", timestamp: "2024-01-15" },
      { id: "al-1-3", type: "wallet-update", message: "Base Interactor marked as Done (tx: 0xabc...002)", timestamp: "2024-01-16" },
      { id: "al-1-4", type: "status-change", message: "Status changed from In Progress → Completed", timestamp: "2024-01-16" },
    ],
  },
  {
    id: "task-2",
    title: "Swap tokens on SyncSwap",
    description: "Perform at least 5 token swaps on SyncSwap DEX. Vary your token pairs and amounts to look organic. Recommended pairs: ETH/USDC, ETH/USDT, USDC/DAI.",
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
    guideUrl: "https://syncswap.xyz/",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "done", completedAt: "2024-01-20", txHash: "0xdef456...003", actualGasFee: "0.0029" },
      { walletId: "sub-1b", walletName: "Base Interactor", address: "0x1234...7890", status: "pending" },
    ],
    linkedIdentityIds: [],
    tags: ["swap", "dex", "zksync"],
    subtasks: [
      { id: "st-2-1", title: "Connect wallet to SyncSwap", completed: true, completedAt: "2024-01-20" },
      { id: "st-2-2", title: "Swap ETH → USDC (3x)", completed: true, completedAt: "2024-01-20" },
      { id: "st-2-3", title: "Swap USDC → DAI (2x)", completed: false },
      { id: "st-2-4", title: "Record txHashes", completed: false },
    ],
    notes: [],
    activityLog: [
      { id: "al-2-1", type: "status-change", message: "Status changed from Backlog → In Progress", timestamp: "2024-01-20" },
      { id: "al-2-2", type: "wallet-update", message: "zkSync Farmer marked as Done (tx: 0xdef...003)", timestamp: "2024-01-20" },
    ],
  },
  {
    id: "task-3",
    title: "Provide liquidity on Mute.io",
    description: "Add ETH/USDC liquidity on Mute.io AMM. Minimum $50 worth of liquidity. Keep it for at least 7 days before removing.",
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
    guideUrl: "https://app.mute.io/",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "pending" },
    ],
    tags: ["liquidity", "defi", "zksync"],
    isOverdue: true,
    subtasks: [
      { id: "st-3-1", title: "Approve USDC spending", completed: false },
      { id: "st-3-2", title: "Add ETH/USDC liquidity", completed: false },
      { id: "st-3-3", title: "Confirm LP tokens received", completed: false },
    ],
    notes: [],
    activityLog: [],
  },
  // --- LayerZero ---
  {
    id: "task-4",
    title: "Bridge using Stargate Finance",
    description: "Bridge USDC via Stargate to 3+ different chains. This helps establish cross-chain activity for the LayerZero airdrop. Target chains: Arbitrum, Optimism, Polygon.",
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
    guideUrl: "https://stargate.finance/",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "done", completedAt: "2024-01-20", txHash: "0xghi789...004", actualGasFee: "0.011" },
    ],
    linkedIdentityIds: ["id1"],
    tags: ["bridge", "layerzero", "cross-chain"],
    subtasks: [
      { id: "st-4-1", title: "Bridge USDC to Arbitrum", completed: true, completedAt: "2024-01-20" },
      { id: "st-4-2", title: "Bridge USDC to Optimism", completed: true, completedAt: "2024-01-20" },
      { id: "st-4-3", title: "Bridge USDC to Polygon", completed: true, completedAt: "2024-01-20" },
    ],
    notes: [
      { id: "n-4-1", content: "All 3 bridges confirmed. Stargate V2 had slightly lower fees. Total actual gas: 0.011 ETH.", createdAt: "2024-01-20" },
    ],
    activityLog: [
      { id: "al-4-1", type: "status-change", message: "Status changed from Backlog → Completed", timestamp: "2024-01-20" },
    ],
  },
  {
    id: "task-5",
    title: "Bridge to 5+ different chains",
    description: "Use LayerZero omnichain routing to bridge to at least 5 chains. More unique chains = higher score.",
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
    tags: ["bridge", "cross-chain", "layerzero"],
    subtasks: [
      { id: "st-5-1", title: "Bridge to Avalanche", completed: true, completedAt: "2024-01-28" },
      { id: "st-5-2", title: "Bridge to BSC", completed: true, completedAt: "2024-01-28" },
      { id: "st-5-3", title: "Bridge to Fantom", completed: true, completedAt: "2024-01-28" },
      { id: "st-5-4", title: "Bridge to Metis", completed: true, completedAt: "2024-01-28" },
      { id: "st-5-5", title: "Bridge to Celo", completed: true, completedAt: "2024-01-28" },
    ],
    notes: [],
    activityLog: [
      { id: "al-5-1", type: "status-change", message: "Status changed to Review — pending verification", timestamp: "2024-01-28" },
    ],
  },
  // --- Social Tasks ---
  {
    id: "task-6",
    title: "Follow Arbitrum on Twitter",
    description: "Follow @arbitrum and retweet the latest announcement. Also engage with at least 3 posts (like + reply).",
    type: "social",
    priority: "low",
    status: "completed",
    recurring: null,
    projectId: "4",
    projectName: "Galxe Campaign: Arbitrum",
    createdAt: "2024-01-17",
    guideUrl: "https://twitter.com/arbitrum",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "done", completedAt: "2024-01-18" },
    ],
    linkedIdentityIds: ["id1", "id2"],
    tags: ["twitter", "social", "arbitrum"],
    subtasks: [
      { id: "st-6-1", title: "Follow @arbitrum", completed: true, completedAt: "2024-01-18" },
      { id: "st-6-2", title: "Retweet latest announcement", completed: true, completedAt: "2024-01-18" },
      { id: "st-6-3", title: "Like & reply to 3 posts", completed: true, completedAt: "2024-01-18" },
    ],
    notes: [],
    activityLog: [
      { id: "al-6-1", type: "status-change", message: "Status changed from Backlog → Completed", timestamp: "2024-01-18" },
    ],
  },
  {
    id: "task-7",
    title: "Join Discord server",
    description: "Join the Arbitrum Discord and complete verification. Reach Level 1 role.",
    type: "social",
    priority: "low",
    status: "completed",
    recurring: null,
    projectId: "4",
    projectName: "Galxe Campaign: Arbitrum",
    createdAt: "2024-01-17",
    guideUrl: "https://discord.gg/arbitrum",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "done", completedAt: "2024-01-18" },
    ],
    linkedIdentityIds: ["id2"],
    tags: ["discord", "social", "arbitrum"],
    subtasks: [
      { id: "st-7-1", title: "Join Discord server", completed: true, completedAt: "2024-01-18" },
      { id: "st-7-2", title: "Complete CAPTCHA/verification", completed: true, completedAt: "2024-01-18" },
      { id: "st-7-3", title: "Introduce in #gm channel", completed: true, completedAt: "2024-01-18" },
    ],
    notes: [],
    activityLog: [],
  },
  {
    id: "task-8",
    title: "Complete quiz on Galxe",
    description: "Answer all 5 questions correctly to earn OAT. Questions are about Arbitrum's technology.",
    type: "one-time",
    priority: "medium",
    status: "in-progress",
    recurring: null,
    projectId: "4",
    projectName: "Galxe Campaign: Arbitrum",
    deadline: "2024-02-28",
    createdAt: "2024-01-17",
    guideUrl: "https://galxe.com/arbitrum",
    executions: [
      { walletId: "sub-1a", walletName: "zkSync Farmer", address: "0x8Ba1...BA72", status: "pending" },
      { walletId: "sub-1b", walletName: "Base Interactor", address: "0x1234...7890", status: "pending" },
    ],
    linkedIdentityIds: ["id1"],
    tags: ["galxe", "quiz", "arbitrum"],
    isOverdue: true,
    subtasks: [
      { id: "st-8-1", title: "Connect wallet on Galxe", completed: true, completedAt: "2024-01-20" },
      { id: "st-8-2", title: "Complete quiz (5 questions)", completed: false },
      { id: "st-8-3", title: "Claim OAT NFT", completed: false },
    ],
    notes: [
      { id: "n-8-1", content: "Answers: Q1=B, Q2=A, Q3=C, Q4=B, Q5=D — need to verify if still correct.", createdAt: "2024-01-20" },
    ],
    activityLog: [
      { id: "al-8-1", type: "project-update", message: "Project updated quiz questions — reverify answers", timestamp: "2024-02-15" },
    ],
  },
  // --- Daily Check-ins ---
  {
    id: "task-9",
    title: "zkSync Era Daily Check-in",
    description: "Log in and check the dashboard daily to maintain activity score. Optional: interact with at least 1 protocol per day.",
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
    tags: ["daily", "checkin", "zksync"],
    subtasks: [
      { id: "st-9-1", title: "Login to zkSync portal", completed: false },
      { id: "st-9-2", title: "Perform 1 small swap", completed: false },
    ],
    notes: [],
    activityLog: [
      { id: "al-9-1", type: "subtask-completed", message: "Daily reset at 00:00 UTC — all wallets reset to pending", timestamp: "2024-03-12" },
    ],
  },
  {
    id: "task-10",
    title: "Starknet Odyssey — Daily Quest",
    description: "Complete one daily quest on Starknet Odyssey to earn XP. Quests rotate daily — check the dashboard each morning.",
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
    tags: ["daily", "starknet", "xp"],
    subtasks: [
      { id: "st-10-1", title: "Check today's daily quest", completed: false },
      { id: "st-10-2", title: "Complete quest interaction", completed: false },
      { id: "st-10-3", title: "Claim XP reward", completed: false },
    ],
    notes: [],
    activityLog: [],
  },
  {
    id: "task-11",
    title: "Swap on Uniswap V3 (Base)",
    description: "Perform a swap on Uniswap V3 deployed on Base chain. ETH/USDC pair recommended. Min $20 swap amount.",
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
    guideUrl: "https://app.uniswap.org/",
    executions: [
      { walletId: "sub-1b", walletName: "Base Interactor", address: "0x1234...7890", status: "done", completedAt: "2024-01-19", txHash: "0xjkl012...010", actualGasFee: "0.0019" },
    ],
    linkedIdentityIds: ["id2"],
    tags: ["swap", "base", "uniswap", "mainnet"],
    subtasks: [
      { id: "st-11-1", title: "Connect to Base network", completed: true, completedAt: "2024-01-19" },
      { id: "st-11-2", title: "Swap ETH → USDC on Uniswap", completed: true, completedAt: "2024-01-19" },
      { id: "st-11-3", title: "Verify transaction on BaseScan", completed: true, completedAt: "2024-01-19" },
    ],
    notes: [],
    activityLog: [
      { id: "al-11-1", type: "status-change", message: "Status changed from Backlog → Completed", timestamp: "2024-01-19" },
    ],
  },
  {
    id: "task-12",
    title: "Weekly Protocol Rotation (Sui)",
    description: "Interact with at least 3 Sui protocols every week to maintain activity. Recommended: Cetus (swap), Navi (lending), Turbos (liquidity).",
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
    guideUrl: "https://sui.io/ecosystem",
    executions: [
      { walletId: "sub-3a", walletName: "Solana Airdrop Hunter", address: "GKot5...Xkq", status: "pending" },
    ],
    tags: ["weekly", "sui", "protocol"],
    subtasks: [
      { id: "st-12-1", title: "Swap on Cetus DEX", completed: false },
      { id: "st-12-2", title: "Deposit on Navi lending", completed: false },
      { id: "st-12-3", title: "Provide liquidity on Turbos", completed: false },
    ],
    notes: [],
    activityLog: [],
  },
];
