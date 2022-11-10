const { expect, assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { describe } = require("node:test")
const { developmentChains } = require("../../helper-hardhat.config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Nft market place", () => {
      let nftMarketPlace, basicNft, deployer, player
      const PRICE = ethers.utils.parseEther("0.1")
      const TOKEN_ID = 0
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        player = (await getNamedAccounts()).player
        await deployments.fixture(["all"])
        nftMarketPlace = ethers.getContract("NftMarketPlace")
        basicNft = ethers.getContract("BasicNft")
        await basicNft.mintNFT()
        await basicNft.approve(await nftMarketPlace.address, TOKEN_ID)
      })
    })
