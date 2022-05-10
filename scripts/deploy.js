const hre = require("hardhat");

async function main() {

  await hre.run('compile');
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarket = await NFTMarketplace.deploy();

  await nftMarket.deployed();

  console.log("Marketplace Deployed to:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);

  await nft.deployed();

  console.log("NFT Deployed to:", nft.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


