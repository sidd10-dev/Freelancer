require("@nomiclabs/hardhat-waffle");
const fs = require('fs')
const privateKey = fs.readFileSync(".account").toString()


module.exports = {
  networks:{
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/6a06b007102c4a509882140d76bf254f",
      accounts: [privateKey]
    },
    mainnet: {
      url: "https://polygon-mainnet.infura.io/v3/6a06b007102c4a509882140d76bf254f",
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};
