import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import * as Constants from "../Utils/config";
import PassportForm from "./components/PassportForm";
import PassportTable from "./components/PassportTable";

function App() {

  const [passports, setPassports] = useState([]);

  useEffect(() => {
    const connectToMetamask = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
          const passports = await contractInstance.getAllPassports();
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

  return (
    <div>
      <PassportForm setPassports={setPassports} />
      <PassportTable passports={passports} setPassports={setPassports} />
    </div>
  );
}

export default App;