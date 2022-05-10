import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { nftAddress, nftMarketAddress } from '../config.js';



export default function Home() {
  return (
    <div className={styles.container}>
      <h1>HOM3 PAG3</h1>
    </div>
  )
}
