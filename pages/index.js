import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { nftAddress, nftMarketAddress } from '../config.js';


import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';

export default function Home() {
  const [nfts, setNFTS] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();

  }, []);

  async function loadNFTs(){
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const mpContract = new ethers.Contract(nftMarketAddress, NFTMarketplace.abi, provider);
    //gets array of not sold market items
    const data = await mpContract.getUnsoldItems();
    console.log("data on 29: ", data);
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      console.log("tokenURI ", tokenUri)
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item;
    }));

      setNFTS(items);

      setLoadingState('loaded');

  }

  async function buyNFT(nft){
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign transaction
    const signer = provider.getSigner();
    const contract = ethers.Contract(nftMarketAddress, NFTMarketplace.abi, signer);
    //setting price
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    //making transaction happen
    const transaction = await contract.createMarketSale(nftAddress, nft, tokenId, {
      value: price
    });
    await transaction.wait();

    loadNFTs();
  }

  if(loadingState === 'loaded' && !nfts.length) return (
    <h1 className="px-20 py-10 text-3xl">No Items in marketplace</h1>
  )

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{maxWidth: '1600px'}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <Image src={nft.image} alt='NFT Image' width={225} height={200} />
                <div className="p-4">
                  <p style={{height: '64px'}} className='text-2xl font-semibold'>
                    {nft.name}
                  </p>
                  <div style={{height: '70px', overflow: 'hidden'}}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">
                    {nft.price} ETH
                  </p>
                  <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                    onClick={() => buyNFT(nft)}>Buy NFT</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
