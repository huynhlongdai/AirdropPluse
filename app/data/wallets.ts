export type WalletType = "hot" | "cold" | "cex" | "burner";
export type WalletStatus = "active" | "idle" | "low-gas" | "archived";
export type ChainId =
  | "ethereum"
  | "arbitrum"
  | "optimism"
  | "base"
  | "zksync"
  | "polygon"
  | "solana"
  | "starknet"
  | "sui"
  | "aptos"
  | "bsc";

export interface GasBalance {
  chain: ChainId;
  balance: number; // in native token
  symbol: string;
}

export interface SubWallet {
  id: string;
  name: string;
  address: string;
  type: WalletType;
  chains: ChainId[];
  status: WalletStatus;
  purpose?: string;
  linkedIdentityIds: string[];
  gasBalances: GasBalance[];
  activeProjectIds: string[];
  createdAt: string;
}

export interface MainWallet {
  id: string;
  name: string;
  address: string;
  type: WalletType;
  chains: ChainId[];
  notes?: string;
  subWallets: SubWallet[];
  createdAt: string;
}

export const CHAIN_EXPLORERS: Record<ChainId, string> = {
  ethereum: "https://etherscan.io/address/",
  arbitrum: "https://arbiscan.io/address/",
  optimism: "https://optimistic.etherscan.io/address/",
  base: "https://basescan.org/address/",
  zksync: "https://explorer.zksync.io/address/",
  polygon: "https://polygonscan.com/address/",
  solana: "https://solscan.io/account/",
  starknet: "https://starkscan.co/contract/",
  sui: "https://suiscan.xyz/mainnet/account/",
  aptos: "https://explorer.aptoslabs.com/account/",
  bsc: "https://bscscan.com/address/",
};

export const CHAIN_LABELS: Record<ChainId, string> = {
  ethereum: "ETH",
  arbitrum: "ARB",
  optimism: "OP",
  base: "Base",
  zksync: "zkSync",
  polygon: "MATIC",
  solana: "SOL",
  starknet: "STRK",
  sui: "SUI",
  aptos: "APT",
  bsc: "BSC",
};

export const mockMainWallets: MainWallet[] = [
  {
    id: "main-1",
    name: "Master Vault",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    type: "cold",
    chains: ["ethereum", "arbitrum", "optimism", "base"],
    notes: "Primary cold wallet. Never interact with dApps directly.",
    subWallets: [
      {
        id: "sub-1a",
        name: "zkSync Farmer",
        address: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72",
        type: "burner",
        chains: ["zksync", "ethereum"],
        status: "active",
        purpose: "zkSync Era mainnet farming",
        linkedIdentityIds: ["id1"],
        gasBalances: [
          { chain: "zksync", balance: 0.012, symbol: "ETH" },
          { chain: "ethereum", balance: 0.005, symbol: "ETH" },
        ],
        activeProjectIds: ["p1", "p2"],
        createdAt: "2024-01-10",
      },
      {
        id: "sub-1b",
        name: "Base Interactor",
        address: "0x1234567890123456789012345678901234567890",
        type: "burner",
        chains: ["base", "optimism"],
        status: "active",
        purpose: "Base ecosystem - Aerodrome, Moonwell",
        linkedIdentityIds: ["id2"],
        gasBalances: [
          { chain: "base", balance: 0.008, symbol: "ETH" },
          { chain: "optimism", balance: 0.002, symbol: "ETH" },
        ],
        activeProjectIds: ["p3"],
        createdAt: "2024-01-12",
      },
      {
        id: "sub-1c",
        name: "Arb DeFi Bot",
        address: "0x0987654321098765432109876543210987654321",
        type: "hot",
        chains: ["arbitrum"],
        status: "low-gas",
        purpose: "Arbitrum DeFi - GMX, Camelot",
        linkedIdentityIds: ["id3"],
        gasBalances: [{ chain: "arbitrum", balance: 0.0008, symbol: "ETH" }],
        activeProjectIds: [],
        createdAt: "2024-01-15",
      },
    ],
    createdAt: "2023-12-01",
  },
  {
    id: "main-2",
    name: "Binance Hot",
    address: "0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43",
    type: "cex",
    chains: ["ethereum", "bsc"],
    notes: "Binance exchange wallet. Source of funds.",
    subWallets: [
      {
        id: "sub-2a",
        name: "BSC Runner",
        address: "0xAbCd1234EfGh5678IjKl9012MnOp3456QrSt7890",
        type: "burner",
        chains: ["bsc", "polygon"],
        status: "idle",
        purpose: "BSC & Polygon farming",
        linkedIdentityIds: ["id4"],
        gasBalances: [
          { chain: "bsc", balance: 0.15, symbol: "BNB" },
          { chain: "polygon", balance: 2.5, symbol: "MATIC" },
        ],
        activeProjectIds: ["p4"],
        createdAt: "2024-02-01",
      },
      {
        id: "sub-2b",
        name: "Polygon Minter",
        address: "0xDeAd0000BeEf0000DeAd0000BeEf0000DeAd0000",
        type: "burner",
        chains: ["polygon"],
        status: "archived",
        purpose: "NFT minting on Polygon",
        linkedIdentityIds: [],
        gasBalances: [{ chain: "polygon", balance: 0.0, symbol: "MATIC" }],
        activeProjectIds: [],
        createdAt: "2024-02-10",
      },
    ],
    createdAt: "2023-11-15",
  },
  {
    id: "main-3",
    name: "Solana Main",
    address: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK",
    type: "hot",
    chains: ["solana"],
    notes: "Solana ecosystem wallet.",
    subWallets: [
      {
        id: "sub-3a",
        name: "Solana Airdrop Hunter",
        address: "GKot5hBsd81kMupNCXHaqbhv3quXso4DNbpoBK7BCXkq",
        type: "burner",
        chains: ["solana"],
        status: "active",
        purpose: "Jupiter, Drift, Marginfi interactions",
        linkedIdentityIds: ["id1"],
        gasBalances: [{ chain: "solana", balance: 0.5, symbol: "SOL" }],
        activeProjectIds: ["p1", "p5"],
        createdAt: "2024-01-20",
      },
    ],
    createdAt: "2024-01-15",
  },
];

// For backwards compatibility with old wallets page references
export const mockWallets = mockMainWallets.flatMap((m) => [
  { id: m.id, name: m.name, address: m.address, group: "main" as const, chain: m.chains, isActive: true, createdAt: m.createdAt },
  ...m.subWallets.map((s) => ({
    id: s.id,
    name: s.name,
    address: s.address,
    group: "sybil-1" as const,
    chain: s.chains,
    isActive: s.status !== "archived",
    createdAt: s.createdAt,
  })),
]);

export const mockSocialProfiles = [] as never[];
