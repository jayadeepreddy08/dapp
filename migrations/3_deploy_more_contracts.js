var SimpleWallet = artifacts.require("SimpleWallet.sol")
var UserAuth = artifacts.require("UserAuth.sol")
module.exports = function(deployer) {
  deployer.deploy(SimpleWallet);
  deployer.deploy(UserAuth);
};