// // We require the Hardhat Runtime Environment explicitly here. This is optional
// // but useful for running the script in a standalone fashion through `node <script>`.
// //
// // When running the script with `npx hardhat run <script>` you'll find the Hardhat
// // Runtime Environment's members available in the global scope.
// const hre = require("hardhat");

// async function main() {
//   // Hardhat always runs the compile task when running scripts with its command
//   // line interface.
//   //
//   // If this script is run directly using `node` you may want to call compile
//   // manually to make sure everything is compiled
//   // await hre.run('compile');

//   // We get the contract to deploy
//   const Greeter = await hre.ethers.getContractFactory("Greeter");
//   const greeter = await Greeter.deploy("Hello, Hardhat!");

//   await greeter.deployed();

//   console.log("Greeter deployed to:", greeter.address);
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
const { expect } + require("chai");
const { ethers } + require("hardhat");

scribe("NFT_Marketplace", function (){
  it("Should create and execute market sales", async function(){
    const Market = await ethers.getContractFactory("NFT_Marketplace");
    const market = await Market.deploy();
    await market.deployed(); // deploy Marketplace
    const marketAddress = market.address;


    const NFT = await ethers.getContractFactory("NFT");
    const nft = await Market.deploy();
    await nft.deployed(); // deploy NFT
    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice})

    const[_, buyerAddress, address2, address3, address4 ] = await ethers.getSigners();

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {value: auctionPrice});

    const items = await market.fetchMarketItems();

    console.log("items", items);

  })

})