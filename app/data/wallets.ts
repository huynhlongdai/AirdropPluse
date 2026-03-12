export interface Wallet {
  id: string;
  name: string;
  address: string;
  group: "main" | "sybil-1" | "sybil-2" | "testnet" | "other";
  chain: string[];
  isActive: boolean;
  createdAt: string;
}

export interface SocialProfile {
  id: string;
  platform: "twitter" | "discord" | "telegram" | "email";
  username: string;
  linkedWallets: string[];
  browserProfile?: string;
}

export const mockWallets: Wallet[] = [
  {
    id: "w1",
    name: "Main Wallet",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    group: "main",
    chain: ["ethereum", "arbitrum", "optimism", "base", "zksync"],
    isActive: true,
    createdAt: "2023-12-01",
  },
  {
    id: "w2",
    name: "Testnet Hunter",
    address: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72",
    group: "testnet",
    chain: ["starknet", "sui", "aptos"],
    isActive: true,
    createdAt: "2024-01-05",
  },
  {
    id: "w3",
    name: "Sybil Alpha",
    address: "0x1234567890123456789012345678901234567890",
    group: "sybil-1",
    chain: ["ethereum", "polygon", "arbitrum"],
    isActive: true,
    createdAt: "2024-01-10",
  },
  {
    id: "w4",
    name: "Sybil Beta",
    address: "0x0987654321098765432109876543210987654321",
    group: "sybil-1",
    chain: ["ethereum", "optimism", "base"],
    isActive: true,
    createdAt: "2024-01-10",
  },
  {
    id: "w5",
    name: "SOL Main",
    address: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK",
    group: "main",
    chain: ["solana"],
    isActive: true,
    createdAt: "2024-01-15",
  },
];

export const mockSocialProfiles: SocialProfile[] = [
  {
    id: "s1",
    platform: "twitter",
    username: "@cryptohunter_main",
    linkedWallets: ["w1", "w2"],
    browserProfile: "Profile 1",
  },
  {
    id: "s2",
    platform: "discord",
    username: "CryptoHunter#1234",
    linkedWallets: ["w1"],
    browserProfile: "Profile 1",
  },
  {
    id: "s3",
    platform: "twitter",
    username: "@airdrop_farmer_1",
    linkedWallets: ["w3"],
    browserProfile: "Profile 2",
  },
  {
    id: "s4",
    platform: "email",
    username: "main.crypto@gmail.com",
    linkedWallets: ["w1", "w2"],
  },
];
