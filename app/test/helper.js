export const tokens = (n) => {
    return new web3.utils.BN( // handle big numbers
        web3.utils.toWei(n.toString(), 'ether') // Convert Units of Ether to Wei (here, we assume the smallest unit of alpha coin to be 10^-18 alphacoins) - similar to Ether to wei conversion
    )
}

export const ether = (n) => {
    return new web3.utils.BN( // handle big numbers
        web3.utils.toWei(n.toString(), 'ether') // Convert Units of Ether to Wei (here, we assume the smallest unit of alpha coin to be 10^-18 alphacoins) - similar to Ether to wei conversion
    )
}

export const EVM_REVERT = 'VM Exception while processing transaction: revert'

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'