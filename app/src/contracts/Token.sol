// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Token {
    string public name = "Alpha Coin";
    string public symbol = "ALPHA";
    // Just like Wei for Ether, we allow 18 decimal places
    // to the smallest division of an alpha coin
    uint256 public decimals = 18; 

    uint256 public totalSupply;

    constructor() public {
        // 10 lakh units of QAlpha = 10 lakh x (10 ^ 18)
        totalSupply = 1000000 * (10 ** decimals);
    }
}