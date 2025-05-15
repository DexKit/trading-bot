import { ChainId } from "@0x/contract-addresses";
import axios from "axios";
import { ethers } from "ethers";






export const getGasEstimation = async (chainId: ChainId) => {
    // Commented this due to problems with gas station
   if (chainId === ChainId.Polygon) {
        const gasEstimation = await (await axios.get('https://gasstation.polygon.technology/v2')).data['fast'];
        // solution presented at https://github.com/ethers-io/ethers.js/issues/2828
        const maxFeePerGas = ethers.utils.parseUnits(
            Math.ceil(gasEstimation.maxFee) + '',
            'gwei'
        )
        const maxPriorityFeePerGas = ethers.utils.parseUnits(
            Math.ceil(gasEstimation.maxPriorityFee) + '',
            'gwei'
        )
        return { maxFeePerGas, maxPriorityFeePerGas }
    }

    return {}

}
