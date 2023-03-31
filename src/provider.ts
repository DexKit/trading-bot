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

export const arbitrumProvider = new ethers.providers.JsonRpcProvider(
    'https://arbitrum-one.public.blastapi.io', ChainId.Arbitrum
)

export const optimismProvider = new ethers.providers.JsonRpcProvider(
    'https://mainnet.optimism.io', ChainId.Optimism
)
export const fantomProvider = new ethers.providers.JsonRpcProvider(
    'https://rpc.ftm.tools', ChainId.Fantom
)

export const avalancheProvider = new ethers.providers.JsonRpcProvider(
    'https://avalanche.public-rpc.com', ChainId.Avalanche
)

export const ethProvider = new ethers.providers.JsonRpcProvider(
    'https://eth.llamarpc.com', ChainId.Mainnet
)


export const JSON_RPC_PROVIDERS: {
    [key: number]: ethers.providers.JsonRpcProvider;
} = {
    [ChainId.Polygon]: polygonProvider,
    [ChainId.BSC]: bscProvider,
    [ChainId.Arbitrum]: arbitrumProvider,
    [ChainId.Optimism]: optimismProvider,
    [ChainId.Fantom]: fantomProvider,
    [ChainId.Avalanche]: avalancheProvider,
    [ChainId.Mainnet]: ethProvider,
};

const standardPath = "m/44'/60'/0'/0";

function generatePath(index: number = 0) {
    const path = `${standardPath}/${index}`;
    return path;
}


export const getSigner = (chainId: ChainId, index: number = 0) => {

    const provider = JSON_RPC_PROVIDERS[chainId];
    const menmonic = process.env.MENMONIC as string;
    const path = generatePath(index);
    const signer = ethers.Wallet.fromMnemonic(menmonic, path).connect(provider);
    return signer;
}

export const getProvider = (chainId: ChainId) => {
    return JSON_RPC_PROVIDERS[chainId];
}


