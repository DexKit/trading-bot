
import 'dotenv/config'

import { Markets } from "./config";
import { prepare, refetchBalances } from "./erc20";
import { executeTrade } from "./trade";
import { MarketConfig, MarketData } from "./types";




const run = async (market: MarketConfig) => {
    let marketData: MarketData;

    // check allowances and submit allowances if necessary
    marketData = await prepare(market);


    const executeCallback = async () => {
        await executeTrade(marketData);
        marketData = await refetchBalances(marketData);
        let timeout = market.minIntervalSeconds + Math.random() * market.maxIntervalSeconds;
        if (timeout > market.maxIntervalSeconds) {
            timeout = market.maxIntervalSeconds
        }
        console.log(`next trade will be in ${timeout} s`);


        setTimeout(executeCallback, timeout * 1000);
    }


    setTimeout(executeCallback, 0)
}

Markets.forEach((market, index) => {
    console.log(`Starting bot for market: ${index}`)
    // Run bot
    run(market)

});
