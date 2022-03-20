// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Token {

    // State variables
    string public name = "Alpha Coin";
    string public symbol = "ALPHA";
    // Just like Wei for Ether, we allow 18 decimal places
    // to the smallest division of an alpha coin
    uint256 public decimals = 18; 
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() public {
        // 10 lakh units of QAlpha = 10 lakh x (10 ^ 18)
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        require(_to != address(0));
        balanceOf[msg.sender] = balanceOf[msg.sender]- (_value);
        balanceOf[_to] = balanceOf[_to] + (_value);
        emit Transfer(msg.sender, _to, _value);
        success = true;
    }

}