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

// Collection data properties
export interface CollectionDataProps {
  contract_address: string;
  name: string;
  image_url?: string;
  owner_count?: number;
  total_supply?: number;
  on_sale_count?: number;
  minted_timestamp?: string;
  floor_price: number;
  floor_price_change_24h?: number;
  floor_price_change_7d?: number;
  floor_price_change_30d?: number;
  volume_1day: number;
  volume_7day: number;
  volume_30day: number;
  volume_all: number;
  volume_change_24h?: number;
  volume_change_7d?: number;
  volume_change_30d?: number;
  sales_count?: number;
  top_bid?: number;
  floor_sale_1d?: number;
  floor_sale_7d?: number;
  floor_sale_30d?: number;
  last_updated?: string;
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
