module.exports = {
  networks: {
    development: {
      // `truffle dashboard` url
      url: "http://localhost:5000/rpc",
      network_id: "*"
    }
  },

  console: {
    // some handy utils because EIP-712 signatures are fiddly to get right
    require: "./guestbookUtils.js"
  },

  compilers: {
    solc: {
      // this just tells Truffle to use whatever `pragma solidity ...` says
      version: "pragma"
    }
  }
};
