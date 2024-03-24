import { useEffect, useState } from "react";
import styles from '../styles/Home.module.css';
import {ethers} from 'ethers';
import * as Constants from "../Utils/config"

function App () {

  useEffect(() => {
    const connectToMetamask = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          console.log(await signer.getAddress());
          const contractInstance = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);        }
      
        else {
          console.log("Metamask not found");
        }

      }
      catch (err) {
        console.error(err)
      }
    };

    connectToMetamask();
  }, []);

}

export default App;