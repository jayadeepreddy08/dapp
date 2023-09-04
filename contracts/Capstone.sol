pragma solidity ^0.5.0;

contract Capstone{
    uint public userCount = 0;

    struct Join {
        uint id;
        string name;
        string content;
        bool joined;
    }
    mapping(uint => Join)public user;

    event UserCreated(
        uint id,
        string name,
        string content,
        bool joined

    );
    

    constructor() public{
        createUser("defaultUser", "Checking the project");
    }

    function createUser(string memory _name, string memory _content) public{
        userCount ++;
        user[userCount] = Join(userCount, _name, _content, false);
        emit UserCreated(userCount, _name, _content, false);
    }

}

