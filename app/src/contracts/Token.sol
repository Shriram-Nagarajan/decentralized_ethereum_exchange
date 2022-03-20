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
    mapping(address => mapping(address => uint)) public allowance;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() public {
        // 10 lakh units of QAlpha = 10 lakh x (10 ^ 18)
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        _transfer(msg.sender, _to, _value);
        success = true;
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        require(balanceOf[_from] >= _value);
        require(_to != address(0));
        balanceOf[_from] = balanceOf[_from]- (_value);
        balanceOf[_to] = balanceOf[_to] + (_value);
        emit Transfer(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        _transfer(_from, _to, _value);
        return true;
    }

}