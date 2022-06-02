import { ChainId } from "@0x/contract-addresses";
import { BigNumber } from "ethers";


export const ZERO_EX_CHAIN_PREFIX = (chainId?: number) => {
    switch (chainId) {
        case ChainId.Mainnet:
            return '';
        case ChainId.Polygon:
            return 'polygon.';
        case ChainId.Celo:
            return 'celo.';
        case ChainId.Ropsten:
            return 'ropsten.';
        case ChainId.BSC:
            return 'bsc.';
        case ChainId.Avalanche:
            return 'avalanche.';
        case ChainId.Fantom:
            return 'fantom.';
        case ChainId.Optimism:
            return 'optimism.';
        default:
            throw new Error('Chain not supported')
    }
};


export const ZERO_EX_QUOTE_ENDPOINT = (chainId?: number) =>
    `https://${ZERO_EX_CHAIN_PREFIX(chainId)}api.0x.org/swap/v1/quote`;


export const ERC20Abi = [
    'function name() public view returns (string)',
    'function symbol() public view returns (string)',
    'function decimals() public view returns (uint8)',
    'function totalSupply() public view returns (uint256)',
    'function balanceOf(address _owner) public view returns (uint256 balance)',
    'function transfer(address _to, uint256 _value) public returns (bool success)',
    'function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)',
    'function approve(address _spender, uint256 _value) public returns (bool success)',
    'function allowance(address _owner, address _spender) public view returns (uint256 remaining)',
    'event Transfer(address indexed _from, address indexed _to, uint256 _value)',
    'event Approval(address indexed _owner, address indexed _spender, uint256 _value)',
];


export const MINIMUM_ALLOWANCE_THRESHOLD = BigNumber.from(1000).mul(10).pow(18);


export const MAX_ALLOWANCE = BigNumber.from(2).pow(256).sub(1);

export const IS_SIMULATION = process.env.IS_SIMULATION === 'false' ? false : true;