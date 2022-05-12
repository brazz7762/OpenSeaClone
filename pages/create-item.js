import  { useState } from 'react'
import  { ethers } from 'ethers'
import  { create as ipfsHttpClient } from 'react'
import  { useRouter } from 'react/router'
import  Web3Modal from 'web3modal'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

import {
  nftAddress, nftMarketAddress
} from '../config';


export default function CreateItem(){
  const [fileURL, setFileURL] = useState(null);
  const [formInput, updateFormInput] = useState({price: '', name: '', description: ''});
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.file[0]
    try{
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `http://ipfs.infura.io/ipfs/${added.path}`
      setFileURL(url);
    } catch(e) {
      console.log(e)
    }
  }
  //create item
  aysnc function createItem(){
    const {name, description, price} = formInput;

    //form validation
    if(!name || !description || !price || !fileURL) return
    {
      const data = JSON.stringify({
        name, description, image: fileURL;
      });
    }

    try{
      const added = await client.add(data);
      const url = `http://ipfs.infura.io/ipfs/${added.path}`;
      //pass the url to save it on polygon after it has been uploaded on IPFS
      createSale(url);
    } catch(error) {
      console.log('Error uploading file:', error);
    }
  }
  //List item for sale
  async function createSale(){
      const web3Modal = new Web3Modal()
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      //sign transaction
      const signer = provider.getSigner();
      let contract = ethers.Contract(nftMarketAddress, NFTMarketplace.abi, signer);
      let transaction = await contract.createToken(url);
      let tx = await transaction.wait();

      //getting tokenId from the transaction that we just did
      //the event has an array that is returned, first item is the event, third is the token id
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();

      const price = ethers.utils.parseUnits(formInput.price, 'ether');

      contract = new ethers.Contract(nftMarketAddress, NFTMarketplace.abi, signer);

      //get listing price
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      transaction = await contract.createMarketItem(
        nftAddress,
        tokenId,
        price,
        {value: listingPrice
      );

      await transaction.wait();

      router.push('/');

  }
    return(
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <input
            placeHolder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={e => updateFormInput({...formInput, name: e.target.value})}
          />
        </div>
      </div>
    )
}

