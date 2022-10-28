import { ChainId } from "@0x/contract-addresses";
import { MarketConfig } from "./types";

export const Markets: MarketConfig[] = [
    {
        baseTokenAddress: '0x4D0Def42Cf57D6f27CD4983042a55dce1C9F853c',
        quoteTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        chainId: ChainId.Polygon,
        maxBuyUnit: 25,
        minBuyUnit: 5,
        minSellUnit: 5,
        maxSellUnit: 25,
        minIntervalSeconds: 60 * 5,
        maxIntervalSeconds: 60 * 10,
        maxGasValueInGwei: 50
    }
]