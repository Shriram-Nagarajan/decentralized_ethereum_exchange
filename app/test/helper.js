export const tokens = (n) => {
    return new web3.utils.BN( // handle big numbers
        web3.utils.toWei(n.toString(), 'ether') // Convert Units of Ether to Wei (here, we assume the smallest unit of alpha coin to be 10^-18 alphacoins) - similar to Ether to wei conversion
    )
}