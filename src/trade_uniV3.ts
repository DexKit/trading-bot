import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { IS_SIMULATION } from "./constants";
import { getProvider, getSigner } from "./provider";
import { MarketData } from "./types";
import { getSwapQuote } from "./zerox_service";
import { generateRoute } from "./uniswap-v3/executeTrade";
import { V3_SWAP_ROUTER_ADDRESS } from "./uniswap-v3/constants";




export const executeTrade = async (market: MarketData) => {
    const signer = getSigner(market.chainId);
    const quoteTokenBalanceUnits = formatUnits(market.quoteTokenBalance.balance, market.quoteTokenBalance.token.decimals);
    const isBuy = Math.round(Math.random()) === 0;
    const takerAddress = await signer.getAddress();
    if (isBuy) {
        try {
            const sellToken = market.quoteTokenBalance.token.address;
            const buyToken = market.baseTokenBalance.token.address;
            const sellTokenDecimals = market.quoteTokenBalance.token.decimals;
            const buyTokenDecimals = market.baseTokenBalance.token.decimals;
            const slippagePercentage = market.slippagePercentage;

            let randomBuyAmount = market.minBuyUnit + market.maxBuyUnit * Math.random();
            if (randomBuyAmount > market.maxBuyUnit) {
                randomBuyAmount = market.maxBuyUnit;
            }
            if (randomBuyAmount > Number(quoteTokenBalanceUnits)) {
                randomBuyAmount = Number(quoteTokenBalanceUnits);
            }
            const sellAmount = parseUnits(randomBuyAmount.toFixed(6), market.quoteTokenBalance.token.decimals).toString();
            if (Number(randomBuyAmount) > market.minBuyUnit) {
                const route = await generateRoute({address: takerAddress, chainId: market.chainId, provider: getProvider(market.chainId), tokenIn: {address: sellToken, decimals: sellTokenDecimals }, tokenOut: {address: buyToken, decimals: buyTokenDecimals }, amountIn: Number(sellAmount)}
    
                )

              /*  if (market.maxGasValueInGwei && quote.data.gasPrice) {
                    const wei = ethers.utils.parseUnits(String(market.maxGasValueInGwei), 'gwei');
                    if (BigNumber.from(quote.data.gasPrice).gte(wei)) {
                        console.log(`gas higher than threshold: current gas: ${ethers.utils.formatUnits(quote.data.gasPrice, "gwei")} gwei`)
                        return;
                    }
                }*/


                if (!IS_SIMULATION) {
                    if(route){
                        const tx = await signer.sendTransaction({ data: route.methodParameters?.calldata, to: V3_SWAP_ROUTER_ADDRESS, value: route?.methodParameters?.value  });
                        await tx.wait();

                    }

                 
                }

            } else {
                console.log('minimum amount to buy not reached, please add more quote Tokens to Bot')
            }
        } catch (e) {
            console.log(e);
            console.log('error processing a buy');
        }



    } else {
        try {
            const sellToken = market.baseTokenBalance.token.address;
            const buyToken = market.quoteTokenBalance.token.address;
            const sellTokenDecimals = market.baseTokenBalance.token.decimals;
            const buyTokenDecimals = market.quoteTokenBalance.token.decimals;
            const slippagePercentage = market.slippagePercentage;
            let randomSellAmount = market.minSellUnit + market.maxSellUnit * Math.random();
            if (randomSellAmount > market.maxSellUnit) {
                randomSellAmount = market.maxSellUnit;
            }
            const buyAmount = parseUnits(randomSellAmount.toFixed(6), market.quoteTokenBalance.token.decimals).toString();
            const route = await generateRoute({address: takerAddress, chainId: market.chainId, provider: getProvider(market.chainId), tokenIn: {address: sellToken, decimals: sellTokenDecimals }, tokenOut: {address: buyToken, decimals: buyTokenDecimals }, amountIn: Number(buyAmount)});

            if(!route){
                return;
            }

            console.log();

            if (BigNumber.from(route.quote.toExact()).lt(market.baseTokenBalance.balance)) {
                //const sellAmount = market.baseTokenBalance.balance.toString();

                console.log(`bot doing a sell worth ${randomSellAmount}`);
                const route = await generateRoute({address: takerAddress, chainId: market.chainId, provider: getProvider(market.chainId), tokenIn: {address: sellToken, decimals: sellTokenDecimals }, tokenOut: {address: buyToken, decimals: buyTokenDecimals }, amountIn: Number(buyAmount)});
             /*   if (market.maxGasValueInGwei && quote.data.gasPrice) {
                    const wei = ethers.utils.parseUnits(String(market.maxGasValueInGwei), 'gwei');
                    if (BigNumber.from(quote.data.gasPrice).gte(wei)) {
                        console.log(`gas higher than threshold: current gas: ${ethers.utils.formatUnits(quote.data.gasPrice, "gwei")} gwei`);
                        return;
                    }
                }*/


                if (!IS_SIMULATION) {
                    if(route){
                        const tx = await signer.sendTransaction({ data: route.methodParameters?.calldata, to: V3_SWAP_ROUTER_ADDRESS, value: route?.methodParameters?.value  });
                        await tx.wait();

                    }
                }


            } else {
                console.log('minimum amount to sell not reached, please add more base Tokens to Bot')
            }
        } catch (e) {
            console.log(e);
            console.log('error processing a sell');
        }
    }
}