import { ChainId } from '@0x/contract-addresses';
import { ethers } from 'ethers';


export const ropstenProvider = new ethers.providers.JsonRpcProvider(
    `https://ropsten.infura.io/v3/${process.env.ROPSTEN_ALCHEMY_KEY}`
);

export const polygonProvider = new ethers.providers.JsonRpcProvider(
    'https://polygon-rpc.com/', ChainId.Polygon
)

export const bscProvider = new ethers.providers.JsonRpcProvider(
    'https://bsc-dataseed.binance.org/', ChainId.BSC
)

export const JSON_RPC_PROVIDERS: {
    [key: number]: ethers.providers.JsonRpcProvider;
} = {
    [ChainId.Ropsten]: ropstenProvider,
    [ChainId.Polygon]: polygonProvider,
    [ChainId.BSC]: bscProvider
};


export const getSigner = (chainId: ChainId) => {

    const provider = JSON_RPC_PROVIDERS[chainId];
    const menmonic = process.env.MENMONIC as string;

    const signer = ethers.Wallet.fromMnemonic(menmonic).connect(provider);
    return signer;
}

export const getProvider = (chainId: ChainId) => {
    return JSON_RPC_PROVIDERS[chainId];
}


