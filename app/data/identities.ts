export type ProfileStatus = "active" | "locked" | "shadowbanned" | "paused" | "archived";

export interface EmailAccount {
  address: string;
  password: string;
  backupEmail?: string;
}

export interface TwitterAccount {
  username: string;
  password: string;
  token?: string;
  twoFaSecret?: string;
}

export interface DiscordAccount {
  username: string;
  token?: string;
  twoFaSecret?: string;
}

export interface TelegramAccount {
  phone: string;
  username?: string;
  twoFaPassword?: string;
}

export interface TikTokAccount {
  username: string;
  password: string;
}

export interface OtherAccount {
  platform: string;
  username: string;
  password?: string;
  url?: string;
}

export interface IdentityProfile {
  id: string;
  alias: string;
  status: ProfileStatus;
  email?: EmailAccount;
  twitter?: TwitterAccount;
  discord?: DiscordAccount;
  telegram?: TelegramAccount;
  tiktok?: TikTokAccount;
  others: OtherAccount[];
  linkedWallets: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockIdentities: IdentityProfile[] = [
  {
    id: "id1",
    alias: "Alpha Farmer",
    status: "active",
    email: {
      address: "alpha.farmer.main@gmail.com",
      password: "Sup3rS3cr3t!",
      backupEmail: "alpha.backup@proton.me",
    },
    twitter: {
      username: "@alpha_farmer_eth",
      password: "Tw1tt3rPass!",
      twoFaSecret: "JBSWY3DPEHPK3PXP",
    },
    discord: {
      username: "AlphaFarmer#4521",
      token: "MTA2NjY2NjY2NjY2NjY2Ng.XXXXXX.YYYYYY",
      twoFaSecret: "JBSWY3DPEHPK3PXP",
    },
    telegram: {
      phone: "+84901234567",
      username: "@alpha_farmer",
      twoFaPassword: "Telegram2FA!",
    },
    others: [
      { platform: "GitHub", username: "alpha-farmer-eth", url: "https://github.com/alpha-farmer-eth" },
      { platform: "Medium", username: "@alpha.farmer", url: "https://medium.com/@alpha.farmer" },
    ],
    linkedWallets: ["w1", "w2"],
    notes: "Main identity for tier-1 protocols. Keep activity organic.",
    createdAt: "2024-01-01",
    updatedAt: "2024-03-10",
  },
  {
    id: "id2",
    alias: "Sybil Runner 1",
    status: "active",
    email: {
      address: "sybil.r1@outlook.com",
      password: "R1Pass123!",
      backupEmail: "sybil.r1.backup@gmail.com",
    },
    twitter: {
      username: "@sybil_r1_eth",
      password: "R1Tw1tt3r!",
      twoFaSecret: "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD",
    },
    discord: {
      username: "SybilRunner1#7788",
      twoFaSecret: "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD",
    },
    telegram: {
      phone: "+84912345678",
      username: "@sybil_r1",
    },
    others: [],
    linkedWallets: ["w3"],
    notes: "Secondary identity for testnet farming.",
    createdAt: "2024-01-15",
    updatedAt: "2024-03-08",
  },
  {
    id: "id3",
    alias: "Sybil Runner 2",
    status: "paused",
    email: {
      address: "sybil.r2@yahoo.com",
      password: "R2Pass456!",
    },
    twitter: {
      username: "@sybil_r2_crypto",
      password: "R2Tw1tt3r!",
    },
    discord: {
      username: "SybilRunner2#3344",
    },
    others: [
      { platform: "Reddit", username: "u/sybil_r2_crypto", url: "https://reddit.com/u/sybil_r2_crypto" },
    ],
    linkedWallets: ["w4"],
    notes: "On hold - waiting for new campaign batch.",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-28",
  },
  {
    id: "id4",
    alias: "NFT Hunter",
    status: "active",
    email: {
      address: "nft.hunter.pro@gmail.com",
      password: "NFTHunt3r!",
      backupEmail: "nft.hunter.backup@proton.me",
    },
    twitter: {
      username: "@nft_hunter_pro",
      password: "NFTTw1tt3r!",
      twoFaSecret: "MFRGGZDFMZTWQ2LK",
    },
    discord: {
      username: "NFTHunter#9900",
      token: "MTIzNDU2Nzg5MDEyMzQ1Ng.AAAAAA.BBBBBB",
      twoFaSecret: "MFRGGZDFMZTWQ2LK",
    },
    telegram: {
      phone: "+84923456789",
      username: "@nft_hunter_pro",
      twoFaPassword: "NFTTelegram2FA!",
    },
    tiktok: {
      username: "@nft_hunter_pro",
      password: "TikTok123!",
    },
    others: [
      { platform: "YouTube", username: "NFT Hunter Pro", url: "https://youtube.com/@nfthunterpro" },
      { platform: "Facebook", username: "NFT Hunter", url: "https://facebook.com/nfthunter" },
    ],
    linkedWallets: ["w1", "w5"],
    notes: "NFT-focused identity. Active on OpenSea, Blur.",
    createdAt: "2024-01-20",
    updatedAt: "2024-03-11",
  },
  {
    id: "id5",
    alias: "Shadowbanned Acc",
    status: "shadowbanned",
    email: {
      address: "shadow.acc@gmail.com",
      password: "Sh4d0wPass!",
    },
    twitter: {
      username: "@shadow_acc_eth",
      password: "Sh4d0wTw1tt3r!",
    },
    others: [],
    linkedWallets: [],
    notes: "Twitter shadowbanned - investigate & rotate.",
    createdAt: "2024-02-10",
    updatedAt: "2024-03-01",
  },
];
