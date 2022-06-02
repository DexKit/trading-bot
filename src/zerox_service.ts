import { QuoteParams } from "./types";
import qs from 'qs';
import axios from "axios";
import { ZERO_EX_QUOTE_ENDPOINT } from "./constants";
import { ChainId } from "@0x/contract-addresses";


export const getSwapQuote = (swapQuoteParams: QuoteParams, chainId: ChainId) => {

    const queryString = qs.stringify({ ...swapQuoteParams, feeRecipient: '0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d', affiliateAddress: '0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d' });

    return axios.get(`${ZERO_EX_QUOTE_ENDPOINT(chainId)}?${queryString}`);

}