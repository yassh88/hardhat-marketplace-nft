const networkConfig = {
  5: {
    name: "goerli",
    vrfCoordinatorV2: "0x2ca8e0c643bde4c2e08ab1fa0da3401adad7734d",

    subscriptionId: "3643",
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei
    keepersUpdateInterval: "30",
    raffleEntranceFee: ethers.utils.parseEther("0.01"), // 0.1 ETH
    callbackGasLimit: "500000", // 500,000 gas
  },

  31337: {
    name: "localhost",
    subscriptionId: "588",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
    keepersUpdateInterval: "30",
    raffleEntranceFee: ethers.utils.parseEther("0.01"), // 0.1 ETH
    callbackGasLimit: "500000", // 500,000 gas
  },
  // 5: {
  //     name: "goerli",
  //     subscriptionId: "6926",
  //     gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei
  //     keepersUpdateInterval: "30",
  //     raffleEntranceFee: ethers.utils.parseEther("0.01"), // 0.1 ETH
  //     callbackGasLimit: "500000", // 500,000 gas
  //     vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
  // },
}

const developmentChains = ["localhost", "hardhat"]

const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const frontEndContractsFile =
  "../nextjs-smartcontract-lottery-fcc/constants/contractAddresses.json"
const frontEndAbiFile = "../nextjs-smartcontract-lottery-fcc/constants/abi.json"
module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  frontEndContractsFile,
  frontEndAbiFile,
}
