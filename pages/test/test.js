import React, { useState, useEffect } from "react";
import styles from "../../styles/Home.module.css";
import * as Constants from "../../Utils/config";
import { ethers } from 'ethers'; // Import ethers.js

function Test() {

  const [testData, setTestData] = useState({
    name: "John Doe",
    passportNumber: "AB123456",
    nationality: "Testland",
    birthDate: "1990-01-01",
    placeOfBirth: "Testville",
    sex: "male",
    issueDate: "2022-01-01",
    expiryDate: "2032-01-01"
  });
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState([]);
  const [lastPassport, setLastPassport] = useState(null);

  useEffect(() => {
    const fetchPassports = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
        const passports = await contractInstance.getAllPassports();
        const formattedPassports = passports.map(passport => ({
          ...passport,
          birthDate: passport.birthDate.toString(),
          issueDate: passport.issueDate.toString(),
          expiryDate: passport.expiryDate.toString()
        }));
        // Set the last passport
        setLastPassport(formattedPassports[formattedPassports.length - 1]);
      } catch (error) {
        console.error("Error fetching passports:", error);
      }
    };

    // Poll for updates every 5 seconds
    const intervalId = setInterval(fetchPassports, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const logTestMessage = (message, timeTaken = null, isSuccess = false) => {
    if (isSuccess) {
      const timeString = timeTaken ? <span style={{ color: '#D75844' }}> ({timeTaken}ms)</span> : '';
      const messageWithIcon = (
        <span>
          <span style={{ color: '#0DBC73' }}>✔</span> {message}{timeString}
        </span>
      );
      setTestResult(prevResult => [...prevResult, messageWithIcon]);
    } else {
      const formattedMessage = timeTaken ? `${message} (${timeTaken}ms)` : message;
      setTestResult(prevResult => [...prevResult, formattedMessage]);
    }
  };
  
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const startTime = Date.now();
    try {
      logTestMessage("Test 1: Running addPassport API by adding test Passport...");
      const response = await fetch("/api/addPassport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(testData)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(error);
        logTestMessage("Add passport test failed. Please try again.");
      } else {
        const newPassport = await response.json();
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        logTestMessage("addPassport API ran successfully, Test Passport Added", timeTaken, true);
        console.log("New passport:", newPassport);

        // Delay execution of handleUpdatePassportDates by 10 seconds
        setTimeout(handleUpdatePassportDates, 10000);
      }
    } catch (error) {
      console.error(error);
      logTestMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassportDates = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      logTestMessage("Test 2: Running updatePassportDate API...");
      // Fetch the last passport from the database
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
      const passports = await contractInstance.getAllPassports();
      const lastPassportFromDB = passports[passports.length - 1];

      // Update the dates to "2025-02-02" for issue date and "2035-02-02" for expiry date
      const issueDateTimestamp = new Date("2025-02-02").getTime();
      const expiryDateTimestamp = new Date("2035-02-02").getTime();

      // Update the last passport's dates in the database
      const response = await fetch("/api/updatePassportDate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          index: passports.length - 1, 
          issueDate: issueDateTimestamp, 
          expiryDate: expiryDateTimestamp 
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(error);
        logTestMessage("Update passport dates failed.");
      } else {
        // Update the issue date and expiry date of the last passport locally
        setLastPassport({
          ...lastPassportFromDB,
          issueDate: issueDateTimestamp,
          expiryDate: expiryDateTimestamp
        });
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        logTestMessage("updatePassportDate API ran successfully, Test passport dates changed", timeTaken, true);

        setTimeout(handleDeletePassport, 10000);
      }
    } catch (error) {
      console.error(error);
      logTestMessage("An error occurred while updating passport dates.");
    } finally {
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      setLoading(false);
    }
  };

  const handleDeletePassport = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      logTestMessage("Test 3: Running deletePassport API...");
      // Fetch the last passport from the database
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
      const passports = await contractInstance.getAllPassports();

      // Delete the last passport from the database
      const response = await fetch("/api/deletePassport", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ index: passports.length - 1 })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(error);
        logTestMessage("Delete passport failed.");
      } else {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        setLastPassport(null);
        logTestMessage("deletePassport API ran successfully, test passport deleted", timeTaken, true);
      }
    } catch (error) {
      console.error(error);
      logTestMessage("An error occurred while deleting passport.");
    } finally {
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      setLoading(false);
    }
  };

  return (
    <div className={styles.test}>    
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Running test..." : "Run test"}
      </button>
      {testResult.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
}

export default Test;
