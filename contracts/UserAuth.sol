pragma solidity ^0.5.0;

contract UserAuth {
    struct User {
        uint id;
        string username;
        string password;
        bool exists;
    }

    mapping(address => User) public users;
    uint public userCount;

    event UserRegistered(uint indexed userId, address indexed userAddress, string username);
    event UserLoggedIn(address indexed userAddress, string username);

    function register(string memory _username, string memory _password) public {
        require(!users[msg.sender].exists, "User already registered");

        userCount++;
        users[msg.sender] = User(userCount, _username, _password, true);
        emit UserRegistered(userCount, msg.sender, _username);
    }
     function login(string memory _username, string memory _password) public {
        require(users[msg.sender].exists, "User does not exist");
        require(keccak256(abi.encodePacked(users[msg.sender].username)) == keccak256(abi.encodePacked(_username)), "Incorrect username");
        require(keccak256(abi.encodePacked(users[msg.sender].password)) == keccak256(abi.encodePacked(_password)), "Incorrect password");

        emit UserLoggedIn(msg.sender, users[msg.sender].username);
    }

    function getUser() public view returns (uint, string memory, bool) {
        return (users[msg.sender].id, users[msg.sender].username, users[msg.sender].exists);
    }
}