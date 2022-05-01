//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/ERC721/ERC721.sol";
import "@openzeppelin/contracts/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
  //auto-incrementing field for each token
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  //address of the NFT marketplace
  address contractAddress;

  constructor(address marketplaceAddress) ERC721("Salutokens", "SALT"){
    contractAddress = marketplaceAddress;
  }

///@notice create a new token

///@param tokenURI : token URI


  function createToken(string memory tokenURI) public returns (uint){
    //set a new token id for the token to be minted
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();

    _mint(msg.sender, newItemId); //minting of token
    _setTokenURI(newItemId, tokenURI); //generate the URI
    setApprovalForAll(contractAddress, true); //allow for approvals to marketplace

    return newitemId;

  }
}