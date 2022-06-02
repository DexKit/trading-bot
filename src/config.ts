import { ChainId } from "@0x/contract-addresses";
import { MarketConfig } from "./types";

export const Markets: MarketConfig[] = [
    {
        baseTokenAddress: '0x4D0Def42Cf57D6f27CD4983042a55dce1C9F853c',
        quoteTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        chainId: ChainId.Polygon,
        maxBuyUnit: 2,
        minBuyUnit: 0.1,
        minSellUnit: 0.1,
        maxSellUnit: 2,
        minIntervalSeconds: 60 * 2,
        maxIntervalSeconds: 60 * 5,
    }
]