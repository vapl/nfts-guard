export interface NftData {
  name: string;
  description: string;
  owner: string;
  image?: string;
  rarityRank?: number;
  totalSupply?: number;
}

export interface Transaction {
  timestamp: string; // ISO Date
  priceETH: number;
  buyer: string;
  seller: string;
}

export interface Analytics {
  roi: number;
  whaleActivityDetected: boolean;
  washTradingRisk: boolean;
}

// General NFT collection information
export interface NFTCollection {
  name: string;
  address: string;
  description: string;
  erc1155: boolean;
  erc721: boolean;
  totalSupply: number;
  circulatingSupply: number;
  genesisBlock: number | null;
  genesisTransaction: string | null;
}

// Individual token overview
export interface NFTCollectionItem {
  tokenId: string;
  name: string;
  rarityRank?: number | null;
  image?: string | null;
}

// API response structure
export interface NFTDataResponse {
  collection: NFTCollection;
  tokens: NFTCollectionItem[];
}
