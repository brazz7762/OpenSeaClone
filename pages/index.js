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
  const [nfts,setNFTS] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();

  }, []);

  async function loadNFTs(){
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const mpContract = new ethers.Contract(nftMarketAddress, NFTMarketplace.abi, provider);
    //gets array of not sold market items
    const data = await mpContract.fetchMarketItems();
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenUri(i.tokenId);
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

      setNFTs(items);

      setLoadingState('loaded');

  }

  return (
    <div className={styles.container}>
      <h1>HOM3 PAG3</h1>
    </div>
  )
}
