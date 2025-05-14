# DexKit Trading Bot (Work in Progress)

This repository contains a bot that utilizes the ZRX API to generate volume on decentralized exchanges. It can also be used by users to accumulate or sell one side during a defined time period, similar to a Dollar Cost Averaging (DCA) strategy. Additionally, the repository serves as a showcase for programmatically executing swaps.

# Supported Chains

Polygon, BSC, Fantom, Avalanche, Arbitrum, Optimism and Base

# ZRX API KEY

You need to get an API KEY at [dashboard](https://dashboard.0x.org) before you start.

# How to start

clone this repo and then:

`yarn install`

generate a menmonic using ethers js script

`yarn generate-menmonic`

and add it on the .env file as follows:

`MENMONIC= add_here_generated_menmonic`

With a mnemonic, you can generate multiple accounts. Please store it in a safe place before transferring any funds to it.

Now, you can start configuring the bot to do random trades and generate volume to continuously feed trackers. You need to configure the following market settings:

```
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
    slippagePercentage?: number;
    maxGasValueInGwei?: number;

```

The baseTokenAddress field represents your base token address, such as KIT, while quoteTokenAddress represents your quote token address, such as USDC. The maxSellUnit and minSellUnit fields represent the maximum and minimum amounts in quote units that you want your bot to sell, respectively. Please note that the sell amount generated will be between the maximum and minimum sell amounts. Similarly, the maxBuyUnit and minBuyUnit fields represent the maximum and minimum amounts in quote units that you want your bot to buy, respectively. Please note that the buy amount generated will be between the maximum and minimum sell amounts.

You can configure the trading frequency using the minIntervalSeconds and maxIntervalSeconds fields. Additionally, you can add a slippagePercentage field, which the bot will use to determine slippage. This value can range between 0.005 (0.5%) and 0.2 (20%). The maxGasValueInGwei field represents the maximum amount you are willing to pay for gas to run the bot. This can be useful to avoid overtrading.

For the bot to work well, the token needs to have available liquidity on decentralized exchanges, such as Uniswap.

We recommend adding a USDC market to make it easy to configure the bot. An example that could generate around $1000 USD volume daily is shown as follows:

```
    maxSellUnit: 10
    minSellUnit:3
    maxBuyUnit: 10
    minBuyUnit: 3
    minIntervalSeconds: 300
    maxIntervalSeconds: 600
    slippagePercentage: 0.01
```

The bot will perform a trade between 5 to 10 minutes worth at around $7 USD. With this amount, it can generate around 5 to 10 trades per hour, which gives us around $50 USD per hour. In a day, it will be around $1000 USD. The bot will accept a maximum of 1% slippage on each trade. This is just an example, and the bot could be tuned to give more volume, but it's recommended not to add more volume than necessary. $1000 USD is already enough to be listed on most trackers and keep your token's pricing up to date.

Now, before running the bot, you need to send native coin to pay for gas, and base and quote tokens to the bot. We recommend sending around 3 to 5 times the maxAmounts defined on each side.

After configuring the bot, you can simply run:

`yarn start`

and the bot will run until it runs out of gas.
