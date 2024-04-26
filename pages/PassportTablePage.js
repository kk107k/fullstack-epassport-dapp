import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import * as Constants from "../Utils/config";
import PassportTable from "./components/PassportTable";
import Navbar from "./components/Navbar";
import styles from '../styles/Home.module.css';


const PassportTablePage = () => {


    const [passports, setPassports] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      fetch('http://127.0.0.1:5000/authenticationData')
      fetch('http://127.0.0.1:5000/authenticationAdmin')
        .then(response => response.json())
        .then(data => {
          setAuthenticated(data.success);
          setUserName(data.name);
        })
        .catch(error => {
          console.error('Error fetching authentication data:', error);
        });
    }, []);

    useEffect(() => {
      const connectToMetamask = async () => {
        try {
          if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
  
            const gasLimit = ethers.utils.hexlify(80000000);
  
            const passports = await contractInstance.getAllPassports({ gasLimit });
            console.log("Passports:", passports);
            console.log("Connected");
            const formattedPassports = passports.map(passport => ({
              ...passport,
              birthDate: passport.birthDate.toString(),
              issueDate: passport.issueDate.toString(),
              expiryDate: passport.expiryDate.toString()
            }));
            setPassports(formattedPassports);
          } else {
            console.log("Metamask not found");
          }
        } catch (err) {
          console.error(err);
        }
      };
  
      connectToMetamask();
    }, []);
  
      const renderContent = () => {
        if (authenticated) {
          return (
            <div>
              <Navbar />
            <div class={styles.containerTable}>
              <PassportTable passports={passports} showActions={false} showAddress={false} showElse={true} setPassports={setPassports} />
          </div>

            </div>
          );
        } else {
          return <h1>AUTHENTICATED USERS ONLY</h1>;
        }
      };

  return (
  
    <div class={styles.body}>
      {renderContent()}
    </div>
  )
};

export default PassportTablePage;
