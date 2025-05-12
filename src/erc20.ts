import MultiCall, { CallInput } from "@indexed-finance/multicall";

import { getProvider, getSigner } from "./provider";
import { ChainId, getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { MarketConfig, MarketData, Token } from "./types";
import { ethers } from "ethers";
import { ERC20Abi, IS_SIMULATION, MAX_ALLOWANCE, MINIMUM_ALLOWANCE_THRESHOLD, V3_SWAP_ROUTER_ADDRESS } from "./constants";
import { Interface } from "ethers/lib/utils";
import { getGasEstimation } from "./gasEstimator";

/**
 * Prepares tokens to be traded 
 * @param baseToken 
 * @param quoteToken 
 * @param chainId 
 */
export const prepare = async (marketConfig: MarketConfig): Promise<MarketData> => {
    const chainId = marketConfig.chainId;
    const baseToken = marketConfig.baseTokenAddress;
    const quoteToken = marketConfig.quoteTokenAddress;

    const signer = getSigner(chainId);
    const owner = await signer.getAddress();
    console.log(`bot address is ${owner}`);

    let spender
    if(marketConfig.tradeSource === 'UNIV3'){
        spender = V3_SWAP_ROUTER_ADDRESS;
    }else{
        spender = getContractAddressesForChainOrThrow(chainId).exchangeProxy;
    }
    

    const tokens = [baseToken, quoteToken];
    console.log('fetching metadata');
    const tokenMetadata = await getTokenMetadata(tokens, chainId, signer.provider)

    const multi = new MultiCall(signer.provider);

    const [blockNumber, balancesAndAllowances] = await multi.getBalancesAndAllowances(tokens, owner, spender)

    const {
        balance: quoteBalance,
        allowance: quoteAllowance
    } = balancesAndAllowances[quoteToken];




    if (quoteAllowance.lt(MINIMUM_ALLOWANCE_THRESHOLD)) {
        const tokenContract = new ethers.Contract(quoteToken, ERC20Abi, signer);
        console.log('Preparing allowance for quote token')
        if (!IS_SIMULATION) {
            const gasEstimation = await getGasEstimation(chainId)
            console.log(gasEstimation);
            const tx = await tokenContract.approve(spender, MAX_ALLOWANCE, gasEstimation);
            await tx.wait();
        }
    }

    const {
        balance: baseBalance,
        allowance: baseAllowance
    } = balancesAndAllowances[baseToken];

    if (baseAllowance.lt(MINIMUM_ALLOWANCE_THRESHOLD)) {
        const tokenContract = new ethers.Contract(baseToken, ERC20Abi, signer);
        console.log('Preparing allowance for base token')
        if (!IS_SIMULATION) {
            const gasEstimation = await getGasEstimation(chainId)
            const tx = await tokenContract.approve(spender, MAX_ALLOWANCE, gasEstimation);

            await tx.wait();
        }

    }

    console.log('All allowances ok we are ready for trade');

    return {
        ...marketConfig,
        baseTokenBalance: {
            token: tokenMetadata[0],
            balance: baseBalance
        },
        quoteTokenBalance: {
            token: tokenMetadata[1],
            balance: quoteBalance
        },
    }
}

export const refetchBalances = async (marketData: MarketData): Promise<MarketData> => {
    const chainId = marketData.chainId;
    const baseToken = marketData.baseTokenBalance.token;
    const quoteToken = marketData.quoteTokenBalance.token;
    const signer = getSigner(chainId);
    const multi = new MultiCall(signer);
    const owner = await signer.getAddress();
    const tokens = [baseToken.address, quoteToken.address];

    const [blockNumber, balances] = await multi.getBalances(tokens, owner)
    const baseTokenBalance = balances[baseToken.address];
    const quoteTokenBalance = balances[quoteToken.address];
    return {
        ...marketData,
        baseTokenBalance: {
            ...marketData.baseTokenBalance,
            balance: baseTokenBalance
        },
        quoteTokenBalance: {
            ...marketData.quoteTokenBalance,
            balance: quoteTokenBalance
        }

    }


}


export const getTokenMetadata = async (addresses: string[], chainId: ChainId, provider: ethers.providers.Provider): Promise<Token[]> => {
    const multi = new MultiCall(provider);
    const iface = new Interface(ERC20Abi);
    let calls: CallInput[] = [];

    calls.push({
        interface: iface,
        target: addresses[0],
        function: 'decimals',
    });

    calls.push({
        interface: iface,
        target: addresses[1],
        function: 'decimals',
    });

    const response = await multi.multiCall(calls);
    const [, results] = response;

    const decimals_0 = results[0] as number;
    const decimals_1 = results[1] as number;

    return [{
        address: addresses[0],
        decimals: decimals_0,
        chainId,
    },
    {
        address: addresses[1],
        decimals: decimals_1,
        chainId,
    }]



}