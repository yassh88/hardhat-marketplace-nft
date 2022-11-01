require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */

const RCP_PRIVATE_KEY = `0x${process.env.RCP_PRIVATE_KEY}`
const RCP_GOERLI_URL = process.env.RCP_GOERLI_URL
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    goerli: {
      chainId: 5,
      blockConfirmations: 1,
      url: RCP_GOERLI_URL,
      accounts: [RCP_PRIVATE_KEY],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
      {
        version: "0.4.24",
      },
    ],
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  mocha: {
    timeout: 100000,
  },
}
