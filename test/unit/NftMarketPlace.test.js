const { expect, assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { describe } = require("node:test")
const { developmentChains } = require("../../helper-hardhat.config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Nft market place", () => {
      let nftMarketPlace,
        basicNft,
        deployer,
        player,
        user,
        nftMarketplaceContract
      const PRICE = ethers.utils.parseEther("0.1")
      const PRICE_2 = ethers.utils.parseEther("0.2")
      const TOKEN_ID = 0
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        //player = (await getNamedAccounts()).player
        const accounts = await ethers.getSigners()
        player = accounts[1]
        user = accounts[1]
        await deployments.fixture(["all"])
        nftMarketplaceContract = await ethers.getContract("NftMarketPlace")
        nftMarketPlace = await ethers.getContract("NftMarketPlace")
        basicNft = await ethers.getContract("BasicNft")
        await basicNft.mintNft()
        await basicNft.approve(await nftMarketPlace.address, TOKEN_ID)
      })
      it("lists and can we brught", async () => {
        await nftMarketPlace.listItem(basicNft.address, TOKEN_ID, PRICE)
        const playerConnectedToNftMarket = nftMarketPlace.connect(player)
        await playerConnectedToNftMarket.buyItem(basicNft.address, TOKEN_ID, {
          value: PRICE,
        })
        const newOwner = await basicNft.ownerOf(TOKEN_ID)
        const deployerProceeds = await nftMarketPlace.getProceeds(deployer)
        assert(newOwner.toString() === player.address)
        assert(deployerProceeds.toString() === PRICE.toString())
      })
      it("udpate price", async () => {
        await nftMarketPlace.listItem(basicNft.address, TOKEN_ID, PRICE)
        await nftMarketPlace.updateListing(basicNft.address, TOKEN_ID, PRICE_2)
        const listItem = await nftMarketPlace.getListing(
          basicNft.address,
          TOKEN_ID
        )
        console.log("price", listItem)
        assert(listItem.price.toString() === PRICE_2.toString())
      })
      it("cancel listing", async () => {
        await nftMarketPlace.listItem(basicNft.address, TOKEN_ID, PRICE)
        await nftMarketPlace.cancelListing(basicNft.address, TOKEN_ID)
        const listItem = await nftMarketPlace.getListing(
          basicNft.address,
          TOKEN_ID
        )
        console.log("price", listItem)
        assert(listItem.price.toString() === "0")
      })
      it.only("withdraws proceeds", async function () {
        await nftMarketPlace.listItem(basicNft.address, TOKEN_ID, PRICE)
        nftMarketPlace = nftMarketplaceContract.connect(user)
        await nftMarketPlace.buyItem(basicNft.address, TOKEN_ID, {
          value: PRICE,
        })
        nftMarketPlace = nftMarketplaceContract.connect(deployer)

        const deployerProceedsBefore = await nftMarketPlace.getProceeds(
          deployer.address
        )
        const deployerBalanceBefore = await deployer.getBalance()
        const txResponse = await nftMarketPlace.withdrawProceed()
        const transactionReceipt = await txResponse.wait(1)
        const { gasUsed, effectiveGasPrice } = transactionReceipt
        const gasCost = gasUsed.mul(effectiveGasPrice)
        const deployerBalanceAfter = await deployer.getBalance()

        assert(
          deployerBalanceAfter.add(gasCost).toString() ==
            deployerProceedsBefore.add(deployerBalanceBefore).toString()
        )
      })
    })
