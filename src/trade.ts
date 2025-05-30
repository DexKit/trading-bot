import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { IS_SIMULATION } from "./constants";
import { getSigner } from "./provider";
import { MarketData } from "./types";
import { getSwapPrice, getSwapQuote } from "./zerox_service";
import { getGasEstimation } from "./gasEstimator";
import { setAllowanceToAllowanceHolder } from "./erc20";




export const executeTrade = async (market: MarketData) => {
    const signer = getSigner(market.chainId);
    const quoteTokenBalanceUnits = formatUnits(market.quoteTokenBalance.balance, market.quoteTokenBalance.token.decimals);
    const isBuy = Math.round(Math.random()) === 0;
    const taker = await signer.getAddress();
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
                const quote = await getSwapQuote({ sellAmount, sellToken, buyToken, taker, slippagePercentage }, market.chainId);

                if (market.maxGasValueInGwei && quote.data.gasPrice) {
                    const wei = ethers.utils.parseUnits(String(market.maxGasValueInGwei), 'gwei');
                    if (BigNumber.from(quote.data.gasPrice).gte(wei)) {
                        console.log(`gas higher than threshold: current gas: ${ethers.utils.formatUnits(quote.data.gasPrice, "gwei")} gwei`)
                        return;
                    }
                }
                
                if(quote.data?.issues?.allowance){
                    console.log('setting allowance on sell token');
                   const {actual, spender} = quote.data.issues?.allowance;
                   await setAllowanceToAllowanceHolder({actual, spender, chainId: market.chainId, baseToken: sellToken})
                }


                console.log(`doing a buy a amount of ${randomBuyAmount} quote token`)


                if (!IS_SIMULATION) {
                    const gasEstimator = await getGasEstimation(market.chainId);
                    const { data, to, value} = quote.data.transaction;
                    const tx = await signer.sendTransaction({ data, to, value, ...gasEstimator });
                    console.log(`waiting buy trade to be validated onchain: `, tx)
                    await tx.wait();
                    console.log('buy trade validated onchain')
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
            const buyToken = market.quoteTokenBalance.token.address;
            const sellToken = market.baseTokenBalance.token.address;
            const slippagePercentage = market.slippagePercentage;
            let randomSellAmount = market.minSellUnit + market.maxSellUnit * Math.random();
            if (randomSellAmount > market.maxSellUnit) {
                randomSellAmount = market.maxSellUnit;
            }
            const unitSellAmount = parseUnits('1', market.baseTokenBalance.token.decimals).toString();
            console.log(unitSellAmount)
            

            // get price 
            const price = (await getSwapPrice({sellAmount: unitSellAmount, sellToken, buyToken, taker,  slippagePercentage}, market.chainId)).data
        
            const buyAmountPriceUnits = formatUnits(price.buyAmount, market.quoteTokenBalance.token.decimals);
            const sellAmountPriceUnits = formatUnits(price.sellAmount, market.baseTokenBalance.token.decimals);


            const basePrice = Number(sellAmountPriceUnits)/Number(buyAmountPriceUnits);

            const sellAmount = parseUnits((randomSellAmount*basePrice).toFixed(6), market.baseTokenBalance.token.decimals).toString();
    
            const quote = await getSwapQuote({ sellAmount, sellToken, buyToken, taker,  slippagePercentage }, market.chainId);

    

            if (BigNumber.from(quote.data.sellAmount).lt(market.baseTokenBalance.balance)) {
                //const sellAmount = market.baseTokenBalance.balance.toString();

               
               // const quote = await getSwapQuote({ sellAmount, sellToken, buyToken, taker, slippagePercentage }, market.chainId);
                if (market.maxGasValueInGwei && quote.data.gasPrice) {
                    const wei = ethers.utils.parseUnits(String(market.maxGasValueInGwei), 'gwei');
                    if (BigNumber.from(quote.data.gasPrice).gte(wei)) {
                        console.log(`gas higher than threshold: current gas: ${ethers.utils.formatUnits(quote.data.gasPrice, "gwei")} gwei`);
                        return;
                    }
                }
               
                console.log(`doing a sell a amount of ${randomSellAmount} quote token`)
                console.log(quote.data?.issues?.allowance)
                if(quote.data?.issues?.allowance){
                  console.log('setting allowance on sell token');
                   const {actual, spender} = quote.data.issues?.allowance;
                   await setAllowanceToAllowanceHolder({actual, spender, chainId: market.chainId, baseToken: sellToken})
                }

                if (!IS_SIMULATION) {
                    const gasEstimator = await getGasEstimation(market.chainId);
                    const { data, to, value  } = quote.data.transaction;
                    const tx = await signer.sendTransaction({ data, to, value, ...gasEstimator });
                    console.log(`waiting sell trade to be validated onchain:`, tx)
                    await tx.wait();
                    console.log('sell trade validated onchain')
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