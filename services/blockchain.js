const { ethers } = require("ethers");
const config = require("../config");

function createWeb3Instance(chain) {
    return new ethers.JsonRpcProvider(config.rpcUrls[chain]);
}

module.exports = {
    createWeb3Instance
};
