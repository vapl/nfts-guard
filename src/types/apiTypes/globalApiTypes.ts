// Description: This file contains the global types for the API.
// It is used to define the types of the data returned by the API.

// NFT transaction properties
export interface NFTTransactionProps {
  tx_hash: string;
  contract_address: string;
  token_id: string;
  from_wallet: string;
  to_wallet: string;
  price: number;
  usd_price: number;
  block_num: number;
  timestamp: string;
}

// Sales data
export interface SaleAPIResponse {
  txHash: string;
  token: { tokenId: string };
  from: string;
  to: string;
  price: { amount: { native: number; usd?: number } };
  block: number;
  timestamp: number;
  orderSource?: string;
  washTradingScore?: number;
  orderKind?: string;
}

// Collection data properties
export interface CollectionDataProps {
  contract_address?: string;
  name?: string;
  image_url?: string;
  owner_count?: number;
  total_supply?: number;
  on_sale_count?: number;
  minted_timestamp?: string;
  floor_price: number;
  floor_price_change_24h?: number;
  floor_price_change_7d?: number;
  floor_price_change_30d?: number;
  volume_1day?: number;
  volume_7day?: number;
  volume_30day?: number;
  volume_all?: number;
  volume_change_24h?: number;
  volume_change_7d?: number;
  volume_change_30d?: number;
  sales_count?: number;
  top_bid?: number;
  floor_sale_1d?: number;
  floor_sale_7d?: number;
  floor_sale_30d?: number;
  last_updated?: string;
  volatility_index: number;
  volatility_risk_level: "Low" | "Medium" | "High";
}

// NFT transfer properties
export interface NFTTransferProps {
  tx_hash: string;
  contract_address: string;
  token_id: string;
  from_wallet: string;
  to_wallet: string;
  amount: number;
  block_num: number;
  log_index: number;
  timestamp: string;
}

// NFT collection owner properties
export interface NFTCollectionOwnerProps {
  contract_address?: string;
  is_whale?: boolean;
  wallet: string;
  token_count: number;
  ownership_percentage: number;
  on_sale_count: number;
}

// NFT whale activity properties
export interface NFTWhaleActivityProps {
  contract_address: string;
  wallet: string;
  whale_buys: number;
  whale_sells: number;
  whale_transfers: number;
  total_activity?: number; // Kopējā aktivitāte (pirkumi + pārdošanas + pārskaitījumi)
  frequent_recipients: string[];
  whale_network: string[];
  total_eth_spent: number; // ETH summa, ko vaļi iztērējuši NFT darījumos
  total_usd_spent: number; // USD summa, ko vaļi iztērējuši NFT darījumos
  avg_hold_time: number; // Vidējais NFT turēšanas ilgums (dienās)
  price_volatility: number;
  wash_trade_count?: number; // Wash trading darījumu skaits
  rug_pull_sell?: boolean; // Vai valis pārdeva NFT pēc floor price krituma
  whale_type: string;
  last_updated: string; // Pēdējais datu atjaunināšanas laiks
}

export interface WhaleStatsTopWhale {
  wallet: string;
  whale_type: string;
  total_eth_spent: number;
  total_activity: number;
}

export interface WhaleStats {
  totalWhales: number;
  totalBuys: number;
  totalSells: number;
  totalTransfers: number;
  totalEthSpent: number;
  avgHoldTime: number;
  avgVolatility: number;
  typeCounts: Record<string, number>;
  topWhale?: WhaleStatsTopWhale;
  activityLog: { date: string; eth: number }[];
}

export interface GetNFTWhaleActivityResult {
  whaleStats: WhaleStats;
}

// export interface CollectionDataProps {
//   name: string;
//   image_url?: string;
//   owner_count: number;
//   floor_price: number;
//   volume_7day: number;
//   total_supply: number;
//   on_sale_count: number;
//   top_bid: number;
//   volume_all: number;
//   sales_count: number;
//   floor_price_change_24h: number;
//   floor_price_change_7d: number;
//   floor_price_change_30d: number;
// }

export interface WashTradingResult {
  washTradingIndex: number;
  suspiciousSalesCount: number;
  topWallets: { wallet: string; count: number }[];
  details: {
    frequentSales: number;
    frequentSalesPercent: string;
    quickSwapTrades: number;
    quickSwapTradesPercent: string;
    sameWalletTrades: number;
    sameWalletTradesPercent: string;
    totalSales: number;
  };
  analysis: string;
}

export interface RugPullResult {
  risk_level: "Low" | "Medium" | "High";
  whale_drop_percent: number;
  large_transfers: number;
  floor_price_24h: number;
  floor_price_7d: number;
  floor_price_30d: number;
  unique_sellers: number;
  unique_buyers: number;
  seller_to_buyer_ratio: string;
}

export interface ScannerResultsProps {
  contractAddress: string;
  collectionData: CollectionDataProps;
  washTradingAnalysis: WashTradingResult;
  rugPullAnalysis: RugPullResult;
  safetyScore: number;
  riskLevel: "Low" | "Medium" | "High" | "N/A";
  whaleActivityAnalysis: {
    whaleStats: WhaleStats;
    whaleActivity: NFTWhaleActivityProps;
  };
}

export interface searchSuggestionProps {
  id: string;
  name?: string;
  image?: string;
  symbol?: string;
  collectionId: string;
}

export interface ScanResultCardProps {
  title: string;
  value: string;
  highlight?: string;
  details?: {
    label: string;
    value: number | string;
  }[];
  image?: string;
  icon?: React.ReactNode;
  variant?: string;
  chart?: React.ReactNode;
  tooltipInfo?: string;
}
