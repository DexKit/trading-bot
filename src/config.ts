import { ChainId } from "@0x/contract-addresses";
import { MarketConfig } from "./types";

export const Markets: MarketConfig[] = [
    {
        baseTokenAddress: '0x4D0Def42Cf57D6f27CD4983042a55dce1C9F853c',
        quoteTokenAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        chainId: ChainId.Polygon,
        maxBuyUnit: 5,
        minBuyUnit: 1,
        minSellUnit: 1,
        maxSellUnit: 5,
        minIntervalSeconds: 60 * 1,
        maxIntervalSeconds: 60 * 2,
        maxGasValueInGwei: 100
    }
]