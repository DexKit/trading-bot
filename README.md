# DexKit Trading Bot (Work in Progress)

This bot generates volume in decentralized exchanges using ZRX API or could be used by users to accumulate one side or sell one side during a defined time similar to a DCA strategy.

Also is a showcase how to do swaps programmatically.

# How to start

clone this repo and then:

`yarn install`

generate a menmonic using ethers js script

`yarn generate-menmonic`

and add it on the .env file as follows:

`MENMONIC= add_here_generated_menmonic`

With a menmonic you can generate multiple accounts, please store it in a safe place before transfer any funds to it

Now you can start configure the Bot to do random trades and generate volume to feed trackers continuosly. You need to configure the follow Market config:

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

```

where baseTokenAddress is your base token address, for instance KIT, and quoteTokenAddress is your quote token address as for instance USDC. maxSellUnit is the max amount in quote units that you want your bot to sell and being the minSellUnit, the minimum amount, please note sell amount generated it will be between max and min sell amounts. maxBuyUnit is the max amount in quote units that you want your bot to buy and being the minBuyUnit, the minimum amount, please note buy amount generated it will be between max and min sell amounts. Finally, you can also configure the trading frequency using minIntervalSeconds and maxIntervalSeconds.

For Bot works well the token needs to have available liquidity on decentralized exchanges as for instance Uniswap.

We recommend add a USDC market to make it easy to configure the bot. An example that could generate around 1000 USDC volume daily is shown as follows:

```
    maxSellUnit: 10
    minSellUnit:3
    maxBuyUnit: 10
    minBuyUnit: 3
    minIntervalSeconds: 300
    maxIntervalSeconds: 600
```

Bot will perform a trade between 5 to 10 minutes worth at medium 7 usd dollares, with this amount it can generate, medium 5 to 10 trades per hour which gives us around 50 dollares per hour, in a day it will be around 1000 usd. This is just an example, bot could be tunned to give more volume, but is recommended not add much volume than necessary, 1000 USD is already enough to be listed on most trackers and keep always your token up to date in terms of pricing.

Now before run the bot you need to send native coin to pay gas, and base and quote tokens to the bot. We recommend around 3 to 5 times the maxAmounts defined in each side.

After configure the bot you can just run:

`yarn start`

and bot will run till be out of gas.
