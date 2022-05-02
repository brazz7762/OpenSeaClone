//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"

contract NFTMarketplace is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemsIds;
  Counters.Counter private _itemsSold; //total number of NFT's sold

  address payable owner; //owner of the contract

  uint256 listingPrice = 0.01 ether; //cost to list on the exchange

  constructor(){
      owner = payable(msg.sender);

  }

  struct MarketItem {
      uint itemId;
      address nftContract;
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;

  }
  //way to access valuesof MarketItem Struct by passing ID
  mapping(uint256 => MarketItem) private idMarketItem;


  //log message when Item is sold
  event MarketItemCreated (
      uint indexed itemId,
      address indexed nftContract,
      uint256 indexed tokenId,
      address payable seller,
      address payable owner,
      uint256 price,
      bool sold
  )
  //@notice function to get listing price
  function getListingPrice() public view return(uint256){
      return listingPrice;
  }
  //@notice function to create a marketplace item
 function createMarketItem(
   address nftContract,
   uint256 tokenId,
   uint256 price) public payable nonReentrant{
      require(price > 0, "Price must be nonzero");
      require(msg.value == listingPrice, "Price must equal listing price");

      _itemIds.increment();
      uint256 itemId = _itemId.current();

      idMarketItem[itemId] = MarketItem(itemId,
          nftContract,
          tokenId,
          payable(msg.sender), //seller listing NFT
          payable(address(0)), //No owner yet(setting owner as empty address)
          price,
          false
      );


      //transfer NFT ownership to Marketplace
      IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
      //log this transaction
      emit createMarketItem(
        itemId,
        nftContract,
        tokenId,
        msg.sender,
        address(0),
        price,
        false);

   }

    //@notice function to create a sale
    function createMarketSale(
      address nftContract,
      uint256 itemId) public payable nonReentrant{
        uint price = idMarketItem[itemId].price
        uint tokenId = idMarketItem[itemId].tokenId;
        require(msg.value == price, "Please submit a valid bid");
        idMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idMarketItem[itemId].owner = payable(msg.sender); //setting buyer as new owner
        idMarketItem[itemId].sold = true;
        _itemSold.increment();//incrementing total sold
        payable(owner).transfer(listingPrice);
    }

    //@notice total number of items unsold on Marketplace
    function getUnsoldItems() public view return(MarketItem[] memory){
        uint itemCount = _itemIds.current(); //total number of items created on marketplace
        uint unsoldItemCount = _itemIds.current() - _itemSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for(uint i = 0; i < itemCount; i++){
          if(idMarketItem[i + 1].owner == address(0)) {
            uint currentId = idMarketItem[i + 1].itemId;
            MarketItem storage currentItem = idMarketItem[currentId];
            items[currentIndex] = currentItem;
          }
        }

        return items; //returns array of unsold items
    }

    //returns list of NFTs owned by the user
    function fetchMyNFTS() public view returns (MarketItem[] memory){
      uint totalItemCount = _itemIds.Current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for(uint i = 0; i < totalItemCount; i ++){
        //getting items user owns
        if(idMarketItem[i + 1].owner == msg.sender){
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for(uint i = 0; i < totalItemCount; i++){
        if(idMarketItem[i +1].owner == msg.sender){
          uint currentId = idMarketItem[i+1].itemId;
          MarketItem storage currentItem = idMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
}


