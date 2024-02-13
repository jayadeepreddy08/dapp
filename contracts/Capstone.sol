pragma solidity ^0.5.0;

contract Capstone{
    uint public userCount = 0;

    struct Join {
        uint id;
        string name;
        bool joined;
    }
    mapping(uint => Join)public user;


    event UserCreated(
        uint id,
        string name,
        bool joined


    );
    

    constructor() public{
        createUser("defaultCID");
    }

    function createUser(string memory _name) public{
        userCount ++;
        user[userCount] = Join(userCount, _name, false);
        emit UserCreated(userCount, _name,  false);
    }

}

