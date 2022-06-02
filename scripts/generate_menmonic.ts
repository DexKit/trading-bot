import { ethers } from "ethers"



export const generateMenmonic = () => {

    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;

    console.log(mnemonic);


}


generateMenmonic();