pragma solidity ^0.5.0;

contract SimpleWallet {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }


    event Transfer(address indexed from, address indexed to, uint256 value);

    
    function transfer(address payable _to) public payable onlyOwner {
        require(_to != address(0), "Invalid recipient address");
        require(msg.value > 0, "Value must be greater than 0");

        // Transfer funds
        _to.transfer(msg.value);

        // Emit event
        emit Transfer(msg.sender, _to, msg.value);
    }
}
