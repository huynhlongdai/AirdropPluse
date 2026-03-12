-- =====================================================
-- AIRDROP MANAGER — Seed Data
-- =====================================================

-- ─────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────
insert into projects (id, name, description, category, project_type, chain, ecosystem, status, cost_type, estimated_cost, potential_value, hype_score, risk_level, risk_factors, sentiment, funding_amount, funding_rounds, investors, tge_date, total_supply, vesting_info, milestones, image_url, snapshot_date, priority, is_hot, source_url, twitter_url, discord_url, participating_wallet_ids, linked_wallets, linked_identities, updates, notes, created_at, updated_at)
values
(
  '1', 'zkSync Era',
  'Layer 2 scaling solution using zero-knowledge rollups. Complete transactions to qualify for potential airdrop.',
  'mainnet', 'mainnet', '{zksync,ethereum}', '{"Layer 2","ZK Rollup","EVM"}',
  'active', 'paid', '$50-100', 'very-high', 92, 'low', '{}', 'bullish',
  '$458M',
  '[{"round":"series-b","amount":"$200M","date":"2022-11","leadInvestors":["a16z","Dragonfly"]},{"round":"series-a","amount":"$50M","date":"2021-11","leadInvestors":["Placeholder","1kx"]}]',
  '{a16z,Dragonfly,Placeholder,"1kx"}',
  '2024-Q2', '21,000,000,000', 'Linear vesting over 4 years',
  '[{"id":"m1","title":"Mainnet Launch","date":"2023-03-24","completed":true,"description":"zkSync Era mainnet goes live"},{"id":"m2","title":"1M Transactions","date":"2023-06-01","completed":true},{"id":"m3","title":"Token Launch (TGE)","date":"2024-06-01","completed":false,"description":"Expected Q2 2024"}]',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
  '2024-03-15', 'high', true,
  'https://zksync.io', 'https://twitter.com/zksync', 'https://discord.gg/zksync',
  '{sub-1a,sub-1b}',
  '[{"walletId":"w1","walletName":"Main Wallet","address":"0x1a2b...3c4d","tasksCompleted":2,"totalTasks":5,"lastInteraction":"2024-01-16"},{"walletId":"w2","walletName":"Farming Wallet 1","address":"0x5e6f...7a8b","tasksCompleted":1,"totalTasks":5,"lastInteraction":"2024-01-12"}]',
  '[{"identityId":"id1","username":"@cryptofarmer","platform":"Twitter","tasksCompleted":1}]',
  '[{"id":"u1","date":"2024-01-25","title":"zkSync Era Surpasses $2B TVL","content":"zkSync Era has crossed $2 billion in total value locked, marking a new milestone.","source":"Twitter","type":"news"},{"id":"u2","date":"2024-01-10","title":"New Protocol Integration: Mute.io","content":"Mute.io DEX is now live on zkSync Era with full AMM functionality.","type":"milestone"}]',
  'High priority — snapshot coming in March. Need to complete liquidity tasks.',
  '2024-01-10', '2024-01-25'
),
(
  '2', 'LayerZero',
  'Omnichain interoperability protocol. Bridge assets across multiple chains to qualify.',
  'mainnet', 'protocol', '{ethereum,arbitrum,optimism,polygon}', '{Interoperability,"Cross-chain","Omnichain"}',
  'snapshot', 'paid', '$100-200', 'very-high', 88, 'low', '{}', 'bullish',
  '$293M',
  '[{"round":"series-b","amount":"$135M","date":"2022-11","leadInvestors":["a16z","Sequoia"]}]',
  '{a16z,Sequoia,"FTX Ventures"}',
  '2024-Q1', '1,000,000,000', '4-year vesting with 1-year cliff',
  '[{"id":"m4","title":"V1 Launch","date":"2022-03-01","completed":true},{"id":"m5","title":"Snapshot","date":"2024-02-01","completed":true},{"id":"m6","title":"ZRO Token Claim","date":"2024-03-01","completed":false}]',
  'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=400&fit=crop',
  null, 'high', true,
  'https://layerzero.network', 'https://twitter.com/LayerZero_Labs', null,
  '{sub-1a,sub-2a}',
  '[{"walletId":"w1","walletName":"Main Wallet","address":"0x1a2b...3c4d","tasksCompleted":3,"totalTasks":4,"lastInteraction":"2024-01-25"}]',
  '[{"identityId":"id1","username":"@cryptofarmer","platform":"Twitter","tasksCompleted":2},{"identityId":"id2","username":"cryptofarmer#1234","platform":"Discord","tasksCompleted":1}]',
  '[{"id":"u3","date":"2024-02-01","title":"Snapshot Completed","content":"LayerZero snapshot has been taken. Claim date announced for March 1st.","type":"status-change"},{"id":"u4","date":"2024-01-15","title":"Sybil Check Warning","content":"Team announced sybil filtering will be applied. Avoid using multiple wallets from same IP.","source":"Discord","type":"announcement"}]',
  null,
  '2024-01-05', '2024-02-01'
),
(
  '3', 'Starknet Odyssey',
  'Complete quests on Starknet testnet to earn NFTs and qualify for mainnet airdrop.',
  'testnet', 'testnet', '{starknet}', '{"Layer 2","ZK-STARK","Cairo"}',
  'active', 'free', null, 'high', 74, 'medium', '{"Sybil filter risk","Low activity on testnet"}', 'bullish',
  '$282M',
  '[{"round":"series-c","amount":"$100M","date":"2022-11","leadInvestors":["Paradigm","Sequoia"]}]',
  '{Paradigm,Sequoia,"Alameda Research"}',
  '2024-Q3', '10,000,000,000', 'Community allocation unlocked at TGE',
  '[{"id":"m7","title":"Mainnet Alpha","date":"2022-11-29","completed":true},{"id":"m8","title":"Cairo 1.0","date":"2023-07-01","completed":true},{"id":"m9","title":"Token Launch","date":"2024-09-01","completed":false}]',
  'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&h=400&fit=crop',
  null, 'medium', false,
  'https://starknet.io', 'https://twitter.com/Starknet', 'https://discord.gg/starknet',
  '{sub-1a,sub-2a}',
  '[{"walletId":"w2","walletName":"Farming Wallet 1","address":"0x5e6f...7a8b","tasksCompleted":2,"totalTasks":5,"lastInteraction":"2024-01-13"},{"walletId":"w3","walletName":"Farming Wallet 2","address":"0x9c0d...1e2f","tasksCompleted":0,"totalTasks":5}]',
  '[]',
  '[{"id":"u5","date":"2024-01-20","title":"New Quest Added: DeFi Mastery","content":"Starknet Odyssey adds a new DeFi quest track with 500 XP rewards.","type":"announcement"}]',
  null,
  '2024-01-08', '2024-01-20'
),
(
  '4', 'Galxe Campaign: Arbitrum',
  'Complete social tasks and on-chain activities to earn Arbitrum ecosystem NFTs.',
  'galxe', 'campaign', '{arbitrum}', '{"Layer 2","Optimistic Rollup"}',
  'active', 'free', null, 'medium', 55, 'low', '{}', 'neutral',
  null, '[]', '{}', null, null, null, '[]',
  'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=400&fit=crop',
  null, 'low', false,
  'https://galxe.com', null, null,
  '{sub-1a,sub-1b,sub-2a}',
  '[{"walletId":"w1","walletName":"Main Wallet","address":"0x1a2b...3c4d","tasksCompleted":2,"totalTasks":4,"lastInteraction":"2024-01-18"}]',
  '[{"identityId":"id1","username":"@cryptofarmer","platform":"Twitter","tasksCompleted":1}]',
  '[]', null,
  '2024-01-17', '2024-01-18'
),
(
  '5', 'Sui Network',
  'Participate in Sui testnet waves and mainnet activities for potential airdrop.',
  'mainnet', 'mainnet', '{sui}', '{"Layer 1","Move VM","Parallel Execution"}',
  'discovery', 'paid', '$30-50', 'high', 68, 'medium', '{"No confirmed airdrop","Team anonymous participation unclear"}', 'bullish',
  '$336M',
  '[{"round":"series-b","amount":"$300M","date":"2022-09","leadInvestors":["a16z","FTX Ventures"]}]',
  '{a16z,"FTX Ventures","Coinbase Ventures"}',
  null, null, null,
  '[{"id":"m10","title":"Mainnet Launch","date":"2023-05-03","completed":true},{"id":"m11","title":"SuiNS Launch","date":"2023-09-01","completed":true},{"id":"m12","title":"Ecosystem Fund Distribution","date":"2024-06-01","completed":false}]',
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop',
  null, 'medium', false,
  'https://sui.io', 'https://twitter.com/SuiNetwork', 'https://discord.gg/sui',
  '{sub-3a}', '[]', '[]',
  '[{"id":"u6","date":"2024-01-22","title":"Sui Ecosystem Fund Announced","content":"$100M ecosystem fund announced to support builders on Sui.","source":"Twitter","type":"announcement"}]',
  null,
  '2024-01-22', '2024-01-22'
),
(
  '6', 'Base Ecosystem',
  'Coinbase L2 - interact with Base protocols for potential rewards.',
  'mainnet', 'incentivized', '{base}', '{"Layer 2","Optimistic Rollup","Coinbase"}',
  'active', 'paid', '$40-80', 'medium', 72, 'low', '{}', 'bullish',
  null, '[]', '{}', null, null, null,
  '[{"id":"m13","title":"Base Mainnet Launch","date":"2023-08-09","completed":true},{"id":"m14","title":"Onchain Summer Campaign","date":"2023-08-15","completed":true}]',
  'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=800&h=400&fit=crop',
  null, 'medium', false,
  'https://base.org', 'https://twitter.com/base', null,
  '{sub-1b}',
  '[{"walletId":"w1","walletName":"Main Wallet","address":"0x1a2b...3c4d","tasksCompleted":2,"totalTasks":4,"lastInteraction":"2024-01-19"}]',
  '[]',
  '[{"id":"u7","date":"2024-01-18","title":"Base Surpasses 100M Transactions","content":"Base has processed over 100M transactions since mainnet launch.","type":"milestone"}]',
  null,
  '2024-01-14', '2024-01-19'
)
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- PROJECT TASKS
-- ─────────────────────────────────────────
insert into project_tasks (id, project_id, description, completed, wallet_id, completed_at, priority) values
('t1','1','Bridge ETH to zkSync Era',true,'w1','2024-01-15','high'),
('t2','1','Swap tokens on SyncSwap',true,'w1','2024-01-16','high'),
('t3','1','Provide liquidity on Mute.io',false,null,null,'medium'),
('t4','1','Use zkSync Name Service',false,null,null,'low'),
('t5','1','Interact with 5+ protocols',false,null,null,'high'),
('t6','2','Bridge using Stargate Finance',true,'w1','2024-01-20','high'),
('t7','2','Use Aptos Bridge',true,'w1','2024-01-21','medium'),
('t8','2','Complete 10+ transactions',true,'w1','2024-01-25','high'),
('t9','2','Bridge to 5+ different chains',false,null,null,'high'),
('t10','3','Create Starknet wallet',true,'w2','2024-01-12','high'),
('t11','3','Complete Identity Quest',true,'w2','2024-01-13','medium'),
('t12','3','Bridge assets on testnet',false,null,null,'high'),
('t13','3','Swap on JediSwap',false,null,null,'medium'),
('t14','3','Mint Starknet ID',false,null,null,'low'),
('t15','4','Follow Arbitrum on Twitter',true,null,'2024-01-18','low'),
('t16','4','Join Discord server',true,null,'2024-01-18','low'),
('t17','4','Complete quiz',false,null,null,'medium'),
('t18','4','Make 3 swaps on Arbitrum',false,null,null,'medium'),
('t19','5','Create Sui wallet',false,null,null,'high'),
('t20','5','Bridge assets to Sui',false,null,null,'high'),
('t21','5','Swap on Cetus Protocol',false,null,null,'medium'),
('t22','5','Provide liquidity',false,null,null,'medium'),
('t23','5','Mint Sui Name Service',false,null,null,'low'),
('t24','6','Bridge to Base via official bridge',true,'w1','2024-01-19','high'),
('t25','6','Swap on Uniswap V3',true,'w1','2024-01-19','high'),
('t26','6','Use Aerodrome Finance',false,null,null,'medium'),
('t27','6','Mint Base NFT',false,null,null,'low')
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- WALLETS
-- ─────────────────────────────────────────
insert into wallets (id, name, address, type, chains, notes) values
('main-1','Master Vault','0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb','cold','{ethereum,arbitrum,optimism,base}','Primary cold wallet. Never interact with dApps directly.'),
('main-2','Binance Hot','0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43','cex','{ethereum,bsc}','Binance exchange wallet. Source of funds.'),
('main-3','Solana Main','DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK','hot','{solana}','Solana ecosystem wallet.')
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- SUB WALLETS
-- ─────────────────────────────────────────
insert into sub_wallets (id, main_wallet_id, name, address, type, chains, status, purpose, linked_identity_ids, gas_balances, active_project_ids) values
('sub-1a','main-1','zkSync Farmer','0x8Ba1f109551bD432803012645Ac136ddd64DBA72','burner','{zksync,ethereum}','active','zkSync Era mainnet farming','{id1}','[{"chain":"zksync","balance":0.012,"symbol":"ETH"},{"chain":"ethereum","balance":0.005,"symbol":"ETH"}]','{p1,p2}'),
('sub-1b','main-1','Base Interactor','0x1234567890123456789012345678901234567890','burner','{base,optimism}','active','Base ecosystem - Aerodrome, Moonwell','{id2}','[{"chain":"base","balance":0.008,"symbol":"ETH"},{"chain":"optimism","balance":0.002,"symbol":"ETH"}]','{p3}'),
('sub-1c','main-1','Arb DeFi Bot','0x0987654321098765432109876543210987654321','hot','{arbitrum}','low-gas','Arbitrum DeFi - GMX, Camelot','{id3}','[{"chain":"arbitrum","balance":0.0008,"symbol":"ETH"}]','{}'),
('sub-2a','main-2','BSC Runner','0xAbCd1234EfGh5678IjKl9012MnOp3456QrSt7890','burner','{bsc,polygon}','idle','BSC & Polygon farming','{id4}','[{"chain":"bsc","balance":0.15,"symbol":"BNB"},{"chain":"polygon","balance":2.5,"symbol":"MATIC"}]','{p4}'),
('sub-2b','main-2','Polygon Minter','0xDeAd0000BeEf0000DeAd0000BeEf0000DeAd0000','burner','{polygon}','archived','NFT minting on Polygon','{}','[{"chain":"polygon","balance":0.0,"symbol":"MATIC"}]','{}'),
('sub-3a','main-3','Solana Airdrop Hunter','GKot5hBsd81kMupNCXHaqbhv3quXso4DNbpoBK7BCXkq','burner','{solana}','active','Jupiter, Drift, Marginfi interactions','{id1}','[{"chain":"solana","balance":0.5,"symbol":"SOL"}]','{p1,p5}')
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- TASKS
-- ─────────────────────────────────────────
insert into tasks (id, title, description, guide, guide_source, guide_source_label, type, priority, status, recurring, project_id, project_name, chain_id, estimated_gas_fee, gas_currency, deadline, linked_identity_ids, tags, is_overdue, is_daily_reset, guide_url) values
('task-1','Bridge ETH to zkSync Era','Use the official zkSync bridge to deposit at least 0.05 ETH. This is a critical step for establishing on-chain activity on the zkSync ecosystem.','## Bridge ETH to zkSync Era\n\n**Goal:** Establish on-chain presence on zkSync by bridging ETH from Ethereum mainnet.\n\n### Steps\n\n1. Go to [bridge.zksync.io](https://bridge.zksync.io/) and connect your wallet.\n2. Select **Ethereum → zkSync Era** direction.\n3. Enter **at least 0.05 ETH**.\n4. Click **Bridge** and approve the transaction (~15 min confirmation).\n5. Verify ETH appears on zkSync using the portfolio tab.','manual',null,'onchain','high','completed',null,'1','zkSync Era','zksync','0.005','ETH','2024-03-15','{id1}','{bridge,zksync,mainnet}',false,false,'https://bridge.zksync.io/'),
('task-2','Swap tokens on SyncSwap','Perform at least 5 token swaps on SyncSwap DEX. Vary your token pairs and amounts to look organic.','## Swap Tokens on SyncSwap\n\n**Goal:** Perform at least 5 organic-looking token swaps across different pairs.\n\n### Recommended Pairs\n- ETH → USDC\n- ETH → USDT\n- USDC → DAI\n\n### Steps\n\n1. Open [syncswap.xyz](https://syncswap.xyz/) and connect your zkSync wallet.\n2. Select a token pair and enter your swap amount.\n3. Confirm the swap — record the **transaction hash**.\n4. Repeat for remaining pairs.\n5. Minimum **5 swaps** required.','manual',null,'onchain','high','in-progress',null,'1','zkSync Era','zksync','0.003','ETH','2024-03-15','{}','{swap,dex,zksync}',false,false,'https://syncswap.xyz/'),
('task-3','Provide liquidity on Mute.io','Add ETH/USDC liquidity on Mute.io AMM. Minimum $50 worth of liquidity.',null,null,null,'onchain','medium','backlog',null,'1','zkSync Era','zksync','0.007','ETH','2024-03-01','{}','{liquidity,defi,zksync}',true,false,'https://app.mute.io/'),
('task-4','Bridge using Stargate Finance','Bridge USDC via Stargate to 3+ different chains. Target chains: Arbitrum, Optimism, Polygon.','## Bridge via Stargate Finance\n\n**Goal:** Bridge USDC to 3+ different chains using Stargate.\n\n### Target Chains\n1. Arbitrum\n2. Optimism\n3. Polygon\n\n### Steps\n\n1. Go to [stargate.finance](https://stargate.finance/) and connect your wallet.\n2. Select **USDC** as the token to bridge.\n3. Bridge at least **$20 USDC** to each chain.','ai-extracted','Telegram @layerzero_alpha','onchain','high','completed',null,'2','LayerZero','ethereum','0.012','ETH','2024-02-01','{id1}','{bridge,layerzero,cross-chain}',false,false,'https://stargate.finance/'),
('task-5','Bridge to 5+ different chains','Use LayerZero omnichain routing to bridge to at least 5 chains. More unique chains = higher score.',null,null,null,'onchain','high','review',null,'2','LayerZero',null,'0.02','ETH','2024-03-01','{}','{bridge,cross-chain,layerzero}',false,false,null),
('task-6','Follow Arbitrum on Twitter','Follow @arbitrum and retweet the latest announcement. Also engage with at least 3 posts.',null,null,null,'social','low','completed',null,'4','Galxe Campaign: Arbitrum',null,null,null,null,'{id1,id2}','{twitter,social,arbitrum}',false,false,'https://twitter.com/arbitrum'),
('task-7','Join Discord server','Join the Arbitrum Discord and complete verification. Reach Level 1 role.',null,null,null,'social','low','completed',null,'4','Galxe Campaign: Arbitrum',null,null,null,null,'{id2}','{discord,social,arbitrum}',false,false,'https://discord.gg/arbitrum'),
('task-8','Complete quiz on Galxe','Answer all 5 questions correctly to earn OAT. Questions are about Arbitrum''s technology.',null,null,null,'one-time','medium','in-progress',null,'4','Galxe Campaign: Arbitrum',null,null,null,'2024-02-28','{id1}','{galxe,quiz,arbitrum}',true,false,'https://galxe.com/arbitrum'),
('task-9','zkSync Era Daily Check-in','Log in and check the dashboard daily to maintain activity score.',null,null,null,'daily-checkin','medium','in-progress','daily','1','zkSync Era','zksync',null,null,null,'{}','{daily,checkin,zksync}',false,true,null),
('task-10','Starknet Odyssey — Daily Quest','Complete one daily quest on Starknet Odyssey to earn XP. Quests rotate daily.',null,null,null,'daily-checkin','high','backlog','daily','3','Starknet Odyssey','starknet','0.001','ETH',null,'{}','{daily,starknet,xp}',false,true,null),
('task-11','Swap on Uniswap V3 (Base)','Perform a swap on Uniswap V3 deployed on Base chain. ETH/USDC pair recommended.',null,null,null,'onchain','medium','completed',null,'6','Base Ecosystem','base','0.002','ETH',null,'{id2}','{swap,base,uniswap,mainnet}',false,false,'https://app.uniswap.org/'),
('task-12','Weekly Protocol Rotation (Sui)','Interact with at least 3 Sui protocols every week. Recommended: Cetus (swap), Navi (lending), Turbos (liquidity).',null,null,null,'onchain','medium','backlog','weekly','5','Sui Network','sui','0.001','SUI','2024-03-20','{}','{weekly,sui,protocol}',false,false,'https://sui.io/ecosystem')
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- TASK EXECUTIONS
-- ─────────────────────────────────────────
insert into task_executions (task_id, wallet_id, wallet_name, address, status, completed_at, tx_hash, actual_gas_fee) values
('task-1','sub-1a','zkSync Farmer','0x8Ba1...BA72','completed','2024-01-15','0xabc123...001','0.0048'),
('task-1','sub-1b','Base Interactor','0x1234...7890','completed','2024-01-16','0xabc123...002','0.0051'),
('task-2','sub-1a','zkSync Farmer','0x8Ba1...BA72','completed','2024-01-20','0xdef456...003','0.0029'),
('task-2','sub-1b','Base Interactor','0x1234...7890','not-started',null,null,null),
('task-2','sub-1c','Arb DeFi Bot','0x0987...4321','in-progress',null,null,null),
('task-3','sub-1a','zkSync Farmer','0x8Ba1...BA72','not-started',null,null,null),
('task-3','sub-1b','Base Interactor','0x1234...7890','failed',null,null,null),
('task-4','sub-1a','zkSync Farmer','0x8Ba1...BA72','completed','2024-01-20','0xghi789...004','0.011'),
('task-4','sub-2a','BSC Runner','0xAbCd...7890','completed','2024-01-22','0xghi789...005','0.013'),
('task-5','sub-1a','zkSync Farmer','0x8Ba1...BA72','completed','2024-01-28',null,null),
('task-5','sub-2a','BSC Runner','0xAbCd...7890','in-progress',null,null,null),
('task-6','sub-1a','zkSync Farmer','0x8Ba1...BA72','completed','2024-01-18',null,null),
('task-6','sub-1b','Base Interactor','0x1234...7890','completed','2024-01-18',null,null),
('task-7','sub-1a','zkSync Farmer','0x8Ba1...BA72','completed','2024-01-18',null,null),
('task-8','sub-1a','zkSync Farmer','0x8Ba1...BA72','not-started',null,null,null),
('task-8','sub-1b','Base Interactor','0x1234...7890','not-started',null,null,null),
('task-8','sub-2a','BSC Runner','0xAbCd...7890','in-progress',null,null,null),
('task-9','sub-1a','zkSync Farmer','0x8Ba1...BA72','completed','2024-03-12',null,null),
('task-9','sub-1b','Base Interactor','0x1234...7890','not-started',null,null,null),
('task-9','sub-3a','Solana Airdrop Hunter','GKot5...Xkq','not-started',null,null,null),
('task-10','sub-1a','zkSync Farmer','0x8Ba1...BA72','not-started',null,null,null),
('task-10','sub-2a','BSC Runner','0xAbCd...7890','not-started',null,null,null),
('task-11','sub-1b','Base Interactor','0x1234...7890','completed','2024-01-19','0xjkl012...010','0.0019'),
('task-12','sub-3a','Solana Airdrop Hunter','GKot5...Xkq','not-started',null,null,null)
on conflict do nothing;

-- ─────────────────────────────────────────
-- TASK SUBTASKS
-- ─────────────────────────────────────────
insert into task_subtasks (id, task_id, title, completed, completed_at, sort_order) values
('st-1-1','task-1','Approve ETH transfer on Ethereum',true,'2024-01-15',0),
('st-1-2','task-1','Initiate bridge transaction',true,'2024-01-15',1),
('st-1-3','task-1','Wait for confirmation (~15 min)',true,'2024-01-15',2),
('st-1-4','task-1','Verify ETH received on zkSync',true,'2024-01-15',3),
('st-2-1','task-2','Connect wallet to SyncSwap',true,'2024-01-20',0),
('st-2-2','task-2','Swap ETH → USDC (3x)',true,'2024-01-20',1),
('st-2-3','task-2','Swap USDC → DAI (2x)',false,null,2),
('st-2-4','task-2','Record txHashes',false,null,3),
('st-3-1','task-3','Approve USDC spending',false,null,0),
('st-3-2','task-3','Add ETH/USDC liquidity',false,null,1),
('st-3-3','task-3','Confirm LP tokens received',false,null,2),
('st-4-1','task-4','Bridge USDC to Arbitrum',true,'2024-01-20',0),
('st-4-2','task-4','Bridge USDC to Optimism',true,'2024-01-20',1),
('st-4-3','task-4','Bridge USDC to Polygon',true,'2024-01-20',2),
('st-5-1','task-5','Bridge to Avalanche',true,'2024-01-28',0),
('st-5-2','task-5','Bridge to BSC',true,'2024-01-28',1),
('st-5-3','task-5','Bridge to Fantom',true,'2024-01-28',2),
('st-5-4','task-5','Bridge to Metis',true,'2024-01-28',3),
('st-5-5','task-5','Bridge to Celo',true,'2024-01-28',4),
('st-6-1','task-6','Follow @arbitrum',true,'2024-01-18',0),
('st-6-2','task-6','Retweet latest announcement',true,'2024-01-18',1),
('st-6-3','task-6','Like & reply to 3 posts',true,'2024-01-18',2),
('st-7-1','task-7','Join Discord server',true,'2024-01-18',0),
('st-7-2','task-7','Complete CAPTCHA/verification',true,'2024-01-18',1),
('st-7-3','task-7','Introduce in #gm channel',true,'2024-01-18',2),
('st-8-1','task-8','Connect wallet on Galxe',true,'2024-01-20',0),
('st-8-2','task-8','Complete quiz (5 questions)',false,null,1),
('st-8-3','task-8','Claim OAT NFT',false,null,2),
('st-9-1','task-9','Login to zkSync portal',false,null,0),
('st-9-2','task-9','Perform 1 small swap',false,null,1),
('st-10-1','task-10','Check today''s daily quest',false,null,0),
('st-10-2','task-10','Complete quest interaction',false,null,1),
('st-10-3','task-10','Claim XP reward',false,null,2),
('st-11-1','task-11','Connect to Base network',true,'2024-01-19',0),
('st-11-2','task-11','Swap ETH → USDC on Uniswap',true,'2024-01-19',1),
('st-11-3','task-11','Verify transaction on BaseScan',true,'2024-01-19',2),
('st-12-1','task-12','Swap on Cetus DEX',false,null,0),
('st-12-2','task-12','Deposit on Navi lending',false,null,1),
('st-12-3','task-12','Provide liquidity on Turbos',false,null,2)
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- TASK NOTES
-- ─────────────────────────────────────────
insert into task_notes (id, task_id, content, created_at) values
('n-1-1','task-1','Used official bridge. Gas was around 0.005 ETH. Transaction confirmed in ~12 minutes.','2024-01-15'),
('n-4-1','task-4','All 3 bridges confirmed. Stargate V2 had slightly lower fees. Total actual gas: 0.011 ETH.','2024-01-20'),
('n-8-1','task-8','Answers: Q1=B, Q2=A, Q3=C, Q4=B, Q5=D — need to verify if still correct.','2024-01-20')
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- TASK ACTIVITY LOG
-- ─────────────────────────────────────────
insert into task_activity_log (id, task_id, type, message, timestamp) values
('al-1-1','task-1','status-change','Status changed from Backlog → In Progress','2024-01-14'),
('al-1-2','task-1','wallet-update','zkSync Farmer marked as Completed (tx: 0xabc...001)','2024-01-15'),
('al-1-3','task-1','wallet-update','Base Interactor marked as Completed (tx: 0xabc...002)','2024-01-16'),
('al-1-4','task-1','status-change','Status changed from In Progress → Completed','2024-01-16'),
('al-2-1','task-2','status-change','Status changed from Backlog → In Progress','2024-01-20'),
('al-2-2','task-2','wallet-update','zkSync Farmer marked as Completed (tx: 0xdef...003)','2024-01-20'),
('al-4-1','task-4','status-change','Status changed from Backlog → Completed','2024-01-20'),
('al-5-1','task-5','status-change','Status changed to Review — pending verification','2024-01-28'),
('al-6-1','task-6','status-change','Status changed from Backlog → Completed','2024-01-18'),
('al-8-1','task-8','project-update','Project updated quiz questions — reverify answers','2024-02-15'),
('al-9-1','task-9','subtask-completed','Daily reset at 00:00 UTC — all wallets reset to not-started','2024-03-12'),
('al-11-1','task-11','status-change','Status changed from Backlog → Completed','2024-01-19')
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- IDENTITIES
-- ─────────────────────────────────────────
insert into identities (id, alias, status, email_data, twitter_data, discord_data, telegram_data, tiktok_data, others, linked_wallets, notes, created_at, updated_at) values
('id1','Alpha Farmer','active',
  '{"address":"alpha.farmer.main@gmail.com","password":"Sup3rS3cr3t!","backupEmail":"alpha.backup@proton.me"}',
  '{"username":"@alpha_farmer_eth","password":"Tw1tt3rPass!","twoFaSecret":"JBSWY3DPEHPK3PXP"}',
  '{"username":"AlphaFarmer#4521","token":"MTA2NjY2NjY2NjY2NjY2Ng.XXXXXX.YYYYYY","twoFaSecret":"JBSWY3DPEHPK3PXP"}',
  '{"phone":"+84901234567","username":"@alpha_farmer","twoFaPassword":"Telegram2FA!"}',
  '{}',
  '[{"platform":"GitHub","username":"alpha-farmer-eth","url":"https://github.com/alpha-farmer-eth"},{"platform":"Medium","username":"@alpha.farmer","url":"https://medium.com/@alpha.farmer"}]',
  '{w1,w2}','Main identity for tier-1 protocols. Keep activity organic.','2024-01-01','2024-03-10'),
('id2','Sybil Runner 1','active',
  '{"address":"sybil.r1@outlook.com","password":"R1Pass123!","backupEmail":"sybil.r1.backup@gmail.com"}',
  '{"username":"@sybil_r1_eth","password":"R1Tw1tt3r!","twoFaSecret":"KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD"}',
  '{"username":"SybilRunner1#7788","twoFaSecret":"KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD"}',
  '{"phone":"+84912345678","username":"@sybil_r1"}',
  '{}','[]','{w3}','Secondary identity for testnet farming.','2024-01-15','2024-03-08'),
('id3','Sybil Runner 2','paused',
  '{"address":"sybil.r2@yahoo.com","password":"R2Pass456!"}',
  '{"username":"@sybil_r2_crypto","password":"R2Tw1tt3r!"}',
  '{"username":"SybilRunner2#3344"}',
  '{}','{}',
  '[{"platform":"Reddit","username":"u/sybil_r2_crypto","url":"https://reddit.com/u/sybil_r2_crypto"}]',
  '{w4}','On hold - waiting for new campaign batch.','2024-02-01','2024-02-28'),
('id4','NFT Hunter','active',
  '{"address":"nft.hunter.pro@gmail.com","password":"NFTHunt3r!","backupEmail":"nft.hunter.backup@proton.me"}',
  '{"username":"@nft_hunter_pro","password":"NFTTw1tt3r!","twoFaSecret":"MFRGGZDFMZTWQ2LK"}',
  '{"username":"NFTHunter#9900","token":"MTIzNDU2Nzg5MDEyMzQ1Ng.AAAAAA.BBBBBB","twoFaSecret":"MFRGGZDFMZTWQ2LK"}',
  '{"phone":"+84923456789","username":"@nft_hunter_pro","twoFaPassword":"NFTTelegram2FA!"}',
  '{"username":"@nft_hunter_pro","password":"TikTok123!"}',
  '[{"platform":"YouTube","username":"NFT Hunter Pro","url":"https://youtube.com/@nfthunterpro"},{"platform":"Facebook","username":"NFT Hunter","url":"https://facebook.com/nfthunter"}]',
  '{w1,w5}','NFT-focused identity. Active on OpenSea, Blur.','2024-01-20','2024-03-11'),
('id5','Shadowbanned Acc','shadowbanned',
  '{"address":"shadow.acc@gmail.com","password":"Sh4d0wPass!"}',
  '{"username":"@shadow_acc_eth","password":"Sh4d0wTw1tt3r!"}',
  '{}','{}','{}','[]','{}','Twitter shadowbanned - investigate & rotate.','2024-02-10','2024-03-01')
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- INBOX ITEMS
-- ─────────────────────────────────────────
insert into inbox_items (id, raw_content, source_type, source_url, item_type, status, extracted_data, created_at, processed_at) values
('i1','🚨 FLASH MINT ALERT 🚨\nScroll Genesis NFT — FREE mint, only 500 spots left! FCFS. Must bridge ETH to Scroll first. Mint ends in 2 hours!\nhttps://scroll.io/genesis-nft','telegram',null,'flash-task','review','{"projectName":"Scroll","taskTitle":"Mint Scroll Genesis NFT (FCFS)","taskType":"onchain","taskClassification":"instant","taskPriority":"high","isFlash":true,"flashExpiresAt":"2024-03-13T08:00:00Z","guideUrl":"https://scroll.io/genesis-nft","chain":["scroll","ethereum"],"steps":["Bridge ETH to Scroll","Go to genesis-nft page","Connect wallet","Click Mint"],"gasFee":"~$5","newsTags":["Airdrop"]}','2024-03-12T06:00:00Z','2024-03-12T06:01:00Z'),
('i2','Check out Scroll - zkEVM L2 on Ethereum! Backed by Polychain ($50M Series A). Steps: 1) Bridge ETH 2) Swap on Ambient 3) Provide liquidity 4) Use Scroll Name Service. Snapshot expected Q1 2024.','telegram',null,'task','review','{"projectName":"Scroll","category":"mainnet","chain":["ethereum","scroll"],"fundingAmount":"$50M","investors":["Polychain Capital"],"taskTitle":"Complete Scroll Ecosystem Tasks","taskType":"onchain","taskClassification":"one-time","taskPriority":"high"}','2024-01-26T10:30:00Z','2024-01-26T10:31:00Z'),
('i3','⚡ Linea Daily Voyage Quest is LIVE!\nComplete a swap on Lynex every day this week to earn Linea XP.\nTask resets at 00:00 UTC daily.\nhttps://linea.build/voyage','telegram',null,'task','review','{"projectName":"Linea","taskTitle":"Linea Daily Voyage — Swap on Lynex","taskType":"daily-checkin","taskClassification":"recurring","taskPriority":"medium","chain":["linea"],"guideUrl":"https://linea.build/voyage"}','2024-01-26T14:15:00Z','2024-01-26T14:16:00Z'),
('i4','New Galxe campaign for Linea! Free NFT + potential airdrop. Follow @LineaBuild, join Discord, complete quiz, bridge $10 to Linea.','text',null,'task','processing','{}','2024-01-26T16:45:00Z',null),
('i5','📢 zkSync Era announces ZK Token Airdrop!\n💰 Total supply: 21B ZK\n🗓 Snapshot: Already taken\n📅 Claim date: June 17, 2024\n⚠️ Sybil filter applied — only genuine users qualify\nSource: @zksync on Twitter','telegram',null,'news','review','{"projectName":"zkSync Era","newsTitle":"ZK Token Airdrop Announced — Claim June 17","newsType":"announcement","newsTags":["TGE","Airdrop","Snapshot"],"newsSource":"Twitter @zksync","chain":["zksync"]}','2024-03-10T09:00:00Z','2024-03-10T09:01:00Z'),
('i6','🚨 SCAM ALERT: Fake LayerZero airdrop site circulating. Do NOT connect your wallet to layerzero-claim.io — it is a drainer. Official claim will be at layerzero.network only.','telegram',null,'news','review','{"projectName":"LayerZero","newsTitle":"Scam Alert: Fake LayerZero Claim Site","newsType":"announcement","newsTags":["Scam Alert"],"newsSource":"Telegram"}','2024-03-11T15:30:00Z','2024-03-11T15:31:00Z'),
('i7','Berachain testnet is live! Artio testnet - get faucet tokens, swap on BEX, provide liquidity, mint Bera NFTs. Huge VC backing: Polychain, Framework, Hack VC.','telegram',null,'task','review','{"projectName":"Berachain","category":"testnet","chain":["berachain"],"investors":["Polychain Capital","Framework Ventures","Hack VC"],"taskTitle":"Berachain Artio Testnet Tasks","taskType":"onchain","taskClassification":"one-time","taskPriority":"high"}','2024-01-26T09:20:00Z','2024-01-26T09:21:00Z')
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- SETTINGS: PROVIDERS
-- ─────────────────────────────────────────
insert into settings_providers (id, name, provider, category, description, icon_color, docs_url) values
('prov-openai','OpenAI','OpenAI','ai','GPT-4o, GPT-4 Turbo, GPT-3.5 — inbox analysis, guide writing, summarization.','#10a37f','https://platform.openai.com/docs'),
('prov-grok','Grok','xAI','ai','Grok-2 for risk forecasting and real-time crypto data interpretation.','#1a1a1a','https://docs.x.ai'),
('prov-anthropic','Anthropic','Anthropic','ai','Claude 3.5 Sonnet & Haiku — nuanced summaries and long-form guide generation.','#cc785c','https://docs.anthropic.com'),
('prov-cometapi','CometAPI','CometAPI','ai','Telegram & social channel monitoring — routes airdrop signals to Inbox.','#7c3aed','https://cometapi.com/docs'),
('prov-firecrawl','Firecrawl','Mendable','scraper','Web scraping & deep crawling — extracts airdrop details from project docs and announcements.','#e05d3c','https://docs.firecrawl.dev')
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- SETTINGS: API KEYS
-- ─────────────────────────────────────────
insert into settings_api_keys (id, provider_id, label, value_masked, status, usage_percent, usage_label, quota_limit, last_checked, is_primary) values
('oai-k1','prov-openai','Primary','sk-proj-••••••••••••••••••••••••TzAB','active',68,'136,000 / 200,000 tokens','200,000 tokens/day','2026-03-12T06:00:00Z',true),
('oai-k2','prov-openai','Backup #1','sk-proj-••••••••••••••••••••••••Hm7K','active',12,'24,000 / 200,000 tokens','200,000 tokens/day','2026-03-12T05:00:00Z',false),
('oai-k3','prov-openai','Backup #2','sk-proj-••••••••••••••••••••••••Xp9Q','exhausted',100,'200,000 / 200,000 tokens','200,000 tokens/day','2026-03-12T04:00:00Z',false),
('grok-k1','prov-grok','Primary','xai-••••••••••••••••••••••••••KmR1','error',0,'Key expired',null,'2026-03-11T22:00:00Z',true),
('grok-k2','prov-grok','Backup #1',null,'untested',null,null,null,null,false),
('anth-k1','prov-anthropic','Primary',null,'untested',null,null,null,null,true),
('comet-k1','prov-cometapi','Primary','comet-••••••••••••••••••••••wL5M','active',88,'880 / 1,000 credits','1,000 credits/month','2026-03-12T04:30:00Z',true),
('comet-k2','prov-cometapi','Backup #1','comet-••••••••••••••••••••••Jd3N','active',14,'140 / 1,000 credits','1,000 credits/month','2026-03-12T04:30:00Z',false),
('fc-k1','prov-firecrawl','Primary','fc-••••••••••••••••••••••••9xY2','active',45,'450 / 1,000 pages','1,000 pages/month','2026-03-12T05:45:00Z',true),
('fc-k2','prov-firecrawl','Backup #1','fc-••••••••••••••••••••••••Rk8T','active',8,'80 / 1,000 pages','1,000 pages/month','2026-03-12T05:00:00Z',false),
('fc-k3','prov-firecrawl','Backup #2',null,'untested',null,null,null,null,false)
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- SETTINGS: AI CONFIG
-- ─────────────────────────────────────────
insert into settings_ai_config (feature, feature_label, feature_description, primary_model, fallback_model, temperature, max_tokens) values
('inbox-analysis','Inbox Analysis','Classify and extract actionable data from Telegram/Twitter messages.','grok-2','gpt-3.5-turbo',0.3,2048),
('guide-writer','Guide Writer','Generate step-by-step task guides from raw airdrop instructions.','gpt-4o','claude-3-5-sonnet',0.7,4096),
('risk-forecast','Risk Forecast','Assess airdrop legitimacy and estimate Sybil-detection risk.','grok-2','gpt-4-turbo',0.4,1024),
('tag-extractor','Tag Extractor','Auto-tag projects and tasks with relevant ecosystem labels.','gpt-3.5-turbo','claude-3-haiku',0.2,512),
('task-summarizer','Task Summarizer','Generate concise task descriptions from long-form project docs.','claude-3-haiku','gpt-3.5-turbo',0.5,1024),
('wallet-optimizer','Wallet Optimizer','Suggest optimal wallet rotation and task scheduling strategies.','gpt-4o','claude-3-5-sonnet',0.6,2048)
on conflict (feature) do nothing;

-- ─────────────────────────────────────────
-- SETTINGS: TAXONOMY
-- ─────────────────────────────────────────
insert into settings_taxonomy (id, type, label, color, built_in, usage_count) values
('tax-1','project-category','Layer 1','#3e63dd',true,3),
('tax-2','project-category','Layer 2','#8e4ec6',true,5),
('tax-3','project-category','DeFi','#12a594',true,8),
('tax-4','project-category','GameFi','#f76b15',true,2),
('tax-5','project-category','DePIN','#e5484d',true,1),
('tax-6','project-category','AI Agents','#46a758',false,0),
('tax-7','project-category','SocialFi','#d6409f',false,1),
('tax-8','task-tag','On-chain','#3e63dd',true,24),
('tax-9','task-tag','Social','#d6409f',true,12),
('tax-10','task-tag','KYC','#e5484d',true,3),
('tax-11','task-tag','Faucet','#46a758',true,5),
('tax-12','task-tag','Bridge','#f76b15',false,8),
('tax-13','task-tag','Daily','#00a2c7',false,6),
('tax-14','project-status','Active','#46a758',true,4),
('tax-15','project-status','Snapshot','#f76b15',true,1),
('tax-16','project-status','Completed','#8e8c99',true,1),
('tax-17','project-status','Paused','#e54d2e',false,0)
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- SETTINGS: INGESTION
-- ─────────────────────────────────────────
insert into settings_ingestion (id, crawl_depth, skip_images, text_only, auto_scrape_enabled, scrape_interval_hours, priority_domains, max_items_per_run, deduplication) values
('singleton',3,true,false,true,6,'{"mirror.xyz","medium.com","docs.layerzero.network","l2beat.com"}',50,true)
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- API LOGS
-- ─────────────────────────────────────────
insert into api_logs (id, timestamp, service, endpoint, status_code, latency_ms, tokens_used, cost_usd, success, error_message) values
('log-1','2026-03-12T07:10:00Z','OpenAI','/v1/chat/completions',200,1240,1820,0.018,true,null),
('log-2','2026-03-12T07:08:30Z','Firecrawl','/v1/scrape',200,3400,null,null,true,null),
('log-3','2026-03-12T07:05:00Z','Grok','/v1/chat',200,880,950,0.004,true,null),
('log-4','2026-03-12T06:58:12Z','CometAPI','/channels/fetch',200,2100,null,null,true,null),
('log-5','2026-03-12T06:45:00Z','Grok','/v1/chat',401,340,null,null,false,'Invalid API key. Token has expired.'),
('log-6','2026-03-12T06:30:00Z','OpenAI','/v1/chat/completions',200,1560,2240,0.022,true,null),
('log-7','2026-03-12T06:15:00Z','Firecrawl','/v1/crawl',429,120,null,null,false,'Rate limit exceeded. Retry after 60s.'),
('log-8','2026-03-12T06:00:00Z','Anthropic','/v1/messages',200,720,600,0.003,true,null),
('log-9','2026-03-12T05:45:00Z','CometAPI','/channels/fetch',200,1800,null,null,true,null),
('log-10','2026-03-12T05:30:00Z','OpenAI','/v1/chat/completions',200,980,1100,0.011,true,null)
on conflict (id) do nothing;
