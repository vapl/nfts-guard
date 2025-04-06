import {
  CollectionDataProps,
  WashTradingResult,
  RugPullResult,
  WhaleStats,
} from "./globalApiTypes";

export type ScanSummaryInput = {
  collectionData: CollectionDataProps;
  washTradingAnalysis: WashTradingResult;
  rugPullAnalysis: RugPullResult;
  whaleActivityAnalysis: {
    whaleStats: WhaleStats;
  };
  safetyScore: number;
};
