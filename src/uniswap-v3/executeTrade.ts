//https://docs.uniswap.org/sdk/v3/guides/swaps/routing

import {
    AlphaRouter,
    SwapOptionsSwapRouter02,
    SwapRoute,
    SwapType,
  } from '@uniswap/smart-order-router'
  import { TradeType, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
  import { CurrentConfig } from './config'
  import {
    getMainnetProvider,
    getWalletAddress,
    sendTransaction,
    TransactionState,
    getProvider,
  } from './providers'
  import {
    MAX_FEE_PER_GAS,
    MAX_PRIORITY_FEE_PER_GAS,
    ERC20_ABI,
    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
    V3_SWAP_ROUTER_ADDRESS,
  } from './constants'
  import { fromReadableAmount } from './conversion'
  import { ethers, providers, Signer } from 'ethers'

  interface TokenMetadata{
    address: string,
    decimals: number;
  }
  
  export async function generateRoute({address, chainId, provider, tokenIn, tokenOut, amountIn }: {address: string, chainId: number, provider: providers.JsonRpcProvider, tokenIn: TokenMetadata, tokenOut: TokenMetadata, amountIn: number }): Promise<SwapRoute | null> {
    const router = new AlphaRouter({
      chainId: chainId,
      // @ts-ignore
      provider: provider,
    })
  
    const options: SwapOptionsSwapRouter02 = {
      recipient: address,
      slippageTolerance: new Percent(50, 10_000),
      deadline: Math.floor(Date.now() / 1000 + 1800),
      type: SwapType.SWAP_ROUTER_02,
    }

      const TOKEN_IN = new Token(
        chainId,
      tokenIn.address,
      tokenIn.decimals,
      '',
      ''
    )
    const TOKEN_OUT = new Token(
      chainId,
    tokenOut.address,
    tokenOut.decimals,
    '',
    ''
  )
  
    const route = await router.route(
      CurrencyAmount.fromRawAmount(
        TOKEN_IN,
        fromReadableAmount(
          amountIn,
          TOKEN_IN.decimals
        ).toString()
      ),
      TOKEN_OUT,
      TradeType.EXACT_INPUT,
      options
    )
  
    return route
  }
  
  export async function executeRoute({ route,
    signer

  }: {
    signer: Signer
    route: SwapRoute
  }
    
  ): Promise<TransactionState> {
    const walletAddress = getWalletAddress()
    const provider = getProvider()
  
    if (!walletAddress || !provider) {
      throw new Error('Cannot execute a trade without a connected wallet')
    }
  
    const tokenApproval = await getTokenTransferApproval(CurrentConfig.tokens.in)
  
    // Fail if transfer approvals do not go through
    if (tokenApproval !== TransactionState.Sent) {
      return TransactionState.Failed
    }

    
  
    const res = await sendTransaction({
      data: route.methodParameters?.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: route?.methodParameters?.value,
      from: walletAddress,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    })
  
    return res
  }
  
  export async function getTokenTransferApproval(
    token: Token
  ): Promise<TransactionState> {
    const provider = getProvider()
    const address = getWalletAddress()
    if (!provider || !address) {
      console.log('No Provider Found')
      return TransactionState.Failed
    }
  
    try {
      const tokenContract = new ethers.Contract(
        token.address,
        ERC20_ABI,
        provider
      )
  
      const transaction = await tokenContract.populateTransaction.approve(
        V3_SWAP_ROUTER_ADDRESS,
        fromReadableAmount(
          TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
          token.decimals
        ).toString()
      )
  
      return sendTransaction({
        ...transaction,
        from: address,
      })
    } catch (e) {
      console.error(e)
      return TransactionState.Failed
    }
  }