const hre = require("hardhat");

async function main() {

  await hre.run('compile');
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarket = await NFTMarketplace.deploy();

  await NFTMarketplace.deployed();

  console.log("Marketplace Deployed to:", NFTMarketplace.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);

  await NFT.deployed();

  console.log("NFT Deployed to:", NFT.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


