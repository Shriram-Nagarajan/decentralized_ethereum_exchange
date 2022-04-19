pragma solidity ^0.5.0;

import './Token.sol';

// Deposit & Withdraw Funds
// Manage Orders - Make or Cancel
// Handle Trades

// TODO
// [] Set the fee account
// [] Deposit Ether

contract Exchange {

    // State variables
    address public feeAccount; // the account that receives the exchange fees
    uint256 public feePercent; // the fee percentage
    address constant ETHER = address(0);
    mapping(address => mapping(address => uint256)) public tokens; // Token balance of users for each token type
    mapping(uint256 => _Order) public orders;
    mapping(uint256 => bool) public cancelledOrders;
    uint256 public orderCount;
    
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint256 amount, uint256 balance);
    event Order(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive,uint256 amountGive, uint256 timestamp);
    event Cancel(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive,uint256 amountGive, uint256 timestamp);

    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }


    constructor(address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // Revert if someone sends ether accidentally 
    function() external{
        revert();
    }


    function withdrawEther(uint256 _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender] - _amount;
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
   }

    function depositEther() payable public { // to read msg.value (ether value), the method should be payable
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender] + msg.value;
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function withdrawToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function depositToken(address _token, uint _amount) public {
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount)); // Must return a truth-y value
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(address _token, address _user) public view returns(uint256) {
        return tokens[_token][_user];
    }

    function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive,uint256 _amountGive) public {
        orderCount = orderCount+1;
        orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
        emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
    }

    function cancelOrder(uint256 _id) public {
        _Order storage _order = orders[_id];
        // Must be a valid order
        require(_order.id == _id); // _order.id will be empty if orders[_id] doesn't exist
        // Must be my order
        require(address(_order.user) == msg.sender);
        cancelledOrders[_id] = true;
        emit Cancel(_id, msg.sender, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, now);
    }

}

