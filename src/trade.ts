import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { IS_SIMULATION } from "./constants";
import { getSigner } from "./provider";
import { MarketData } from "./types";
import { getSwapQuote } from "./zerox_service";




export const executeTrade = async (market: MarketData) => {
    const signer = getSigner(market.chainId);
    const quoteTokenBalanceUnits = formatUnits(market.quoteTokenBalance.balance, market.quoteTokenBalance.token.decimals);
    const isBuy = Math.round(Math.random()) === 0;
    const takerAddress = await signer.getAddress();
    if (isBuy) {
        try {


            const sellToken = market.quoteTokenBalance.token.address;
            const buyToken = market.baseTokenBalance.token.address;
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
                const quote = await getSwapQuote({ sellAmount, sellToken, buyToken, takerAddress, intentOnFill: true, slippagePercentage }, market.chainId);

                if (market.maxGasValueInGwei && quote.data.gasPrice) {
                    const wei = ethers.utils.parseUnits(String(market.maxGasValueInGwei), 'gwei');
                    if (BigNumber.from(quote.data.gasPrice).gte(wei)) {
                        console.log(`gas higher than threshold: current gas: ${ethers.utils.formatUnits(quote.data.gasPrice, "gwei")} gwei`)
                    }
                }


                if (!IS_SIMULATION) {
                    const { data, to, value, gas, gasPrice } = quote.data;
                    const tx = await signer.sendTransaction({ data, to, value: BigNumber.from(value).toHexString(), gasLimit: BigNumber.from(gas).toHexString(), gasPrice: BigNumber.from(gasPrice).toHexString() });
                    await tx.wait();
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
            const slippagePercentage = market.slippagePercentage;
            let randomSellAmount = market.minSellUnit + market.maxSellUnit * Math.random();
            if (randomSellAmount > market.maxSellUnit) {
                randomSellAmount = market.maxSellUnit;
            }
            const buyAmount = parseUnits(randomSellAmount.toFixed(6), market.quoteTokenBalance.token.decimals).toString();
            const quote = await getSwapQuote({ buyAmount, sellToken, buyToken, takerAddress, intentOnFill: false, slippagePercentage }, market.chainId);

            console.log(quote.data.gasPrice);

            if (BigNumber.from(quote.data.sellAmount).lt(market.baseTokenBalance.balance)) {
                //const sellAmount = market.baseTokenBalance.balance.toString();

                console.log(`bot doing a sell worth ${randomSellAmount}`);
                const quote = await getSwapQuote({ buyAmount, sellToken, buyToken, takerAddress, intentOnFill: true, slippagePercentage }, market.chainId);
                if (market.maxGasValueInGwei && quote.data.gasPrice) {
                    const wei = ethers.utils.parseUnits(String(market.maxGasValueInGwei), 'gwei');
                    if (BigNumber.from(quote.data.gasPrice).gte(wei)) {
                        console.log(`gas higher than threshold: current gas: ${ethers.utils.formatUnits(quote.data.gasPrice, "gwei")} gwei`)
                    }
                }


                if (!IS_SIMULATION) {
                    const { data, to, value, gas, gasPrice } = quote.data;
                    const tx = await signer.sendTransaction({ data, to, value: BigNumber.from(value).toHexString(), gasLimit: BigNumber.from(gas).toHexString(), gasPrice: BigNumber.from(gasPrice).toHexString() });
                    await tx.wait();
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