const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function (){
  it("Should create and execute market sales", async function(){
    const Market = await ethers.getContractFactory("NFTMarketplace");
    const market = await Market.deploy();
    await market.deployed(); // deploy Marketplace
    const marketAddress = market.address;


    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
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