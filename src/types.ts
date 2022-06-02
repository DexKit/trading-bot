import { ChainId } from "@0x/contract-addresses";
import { BigNumber } from "ethers";

export interface QuoteParams {
    buyToken: string,
    sellToken: string;
    sellAmount?: string;
    buyAmount?: string;
    takerAddress: string;
    intentOnFill: boolean;
}

export interface Token {
    address: string;
    decimals: number;
    chainId: ChainId;
}
export interface TokenBalance {
    token: Token;
    balance: BigNumber;
}


export interface MarketConfig {
    baseTokenAddress: string;
    quoteTokenAddress: string;
    chainId: ChainId;
    maxSellUnit: number;
    minSellUnit: number;
    maxBuyUnit: number;
    minBuyUnit: number;
    minIntervalSeconds: number;
    maxIntervalSeconds: number;
    accountIndex?: number;
}

export interface MarketData {
    baseTokenBalance: TokenBalance;
    quoteTokenBalance: TokenBalance;
    chainId: ChainId;
    maxSellUnit: number;
    minSellUnit: number;
    maxBuyUnit: number;
    minBuyUnit: number;
    minIntervalSeconds: number;
    maxIntervalSeconds: number;
    accountIndex?: number;
}