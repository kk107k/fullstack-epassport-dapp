import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import * as Constants from "../../Utils/config";
import { ethers } from 'ethers'; // Import ethers.js

function Test() {

  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState([]);
  const [lastPassport, setLastPassport] = useState(null);
  const [testingInProgress, setTestingInProgress] = useState(false);

  const [testsPassed, setTestsPassed] = useState(0); 
  const [totalTimeTaken, setTotalTimeTaken] = useState(0); 
  const [authenticated, setAuthenticated] = useState(false)

  const fetchAuthenticationData = async () => {
    try {
      const startTime = Date.now();
      logTestMessage("Test 1: Fetching authentication data...");
      const response1 = await fetch('http://127.0.0.1:5000/authenticationData');
      const response2 = await fetch('http://127.0.0.1:5000/authenticationAdmin');
      const data1 = await response1.json();
      const data2 = await response2.json();
      setAuthenticated(data1.success && data2.success);
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      logTestMessage("Authentication data fetched successfully", timeTaken, true);
      // Proceed with other tests after fetching authentication data
      fetchPassports();
    } catch (error) {
      console.error('Error fetching authentication data:', error);
      logTestMessage("Error fetching authentication data", null, false);
    }
  };
  

  const fetchPassports = async () => {
    try {
      const startTime = Date.now(); // Start time for the test
      logTestMessage("Test 2: Running getAllPassports API...");
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
      setLastPassport(formattedPassports[formattedPassports.length - 1]);
      const endTime = Date.now(); // End time for the test
      const timeTaken = endTime - startTime; // Calculate time taken
      logTestMessage("getAllPassports API ran successfully", timeTaken, true); // Log success message with time taken
      // Proceed with other tests after fetching passports
      handleAddPassport();
    } catch (error) {
      console.error("Error fetching passports:", error);
      logTestMessage("Error fetching passports", null, false); // Log error message
    }
  };

  const logTestMessage = (message, timeTaken = null, isSuccess = false) => {
    if (isSuccess) {
      const timeString = timeTaken ? <span style={{ color: '#D75844' }}> ({timeTaken}ms)</span> : '';
      const messageWithIcon = (
        <span>
          <span style={{ color: '#0DBC73' }}>✔</span> {message}{timeString}
        </span>
      );
      setTestResult(prevResult => [...prevResult, messageWithIcon]);
      setTestsPassed(prevPassed => prevPassed + 1); // Increment tests passed count
    } else {
      const formattedMessage = timeTaken ? `${message} (${timeTaken}ms)` : message;
      setTestResult(prevResult => [...prevResult, formattedMessage]);
    }
  };

  const handleAddPassport = async () => {
    setLoading(true);
    setTestingInProgress(true); // Set testing in progress
    const startTime = Date.now();
    try {
      logTestMessage("Test 3: Running addPassport API by adding test Passport...");
      const testData = {
        name: "John Doe",
        passportNumber: "AB123456",
        nationality: "Testland",
        birthDate: "1990-01-01",
        placeOfBirth: "Testville",
        sex: "male",
        issueDate: "2022-01-01",
        expiryDate: "2032-01-01"
      };
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
        setTotalTimeTaken(prevTime => prevTime + timeTaken); 
        logTestMessage("addPassport API ran successfully, Test Passport Added", timeTaken, true);
        console.log("New passport:", newPassport);

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
      logTestMessage("Test 4: Running updatePassportDate API...");
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
      setTotalTimeTaken(prevTime => prevTime + timeTaken); // Add time taken for this test to total time
      setLoading(false);
    }
  };

  const handleDeletePassport = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      logTestMessage("Test 5: Running deletePassport API...");
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
      setTestingInProgress(false); // Reset testing in progress
      setTotalTimeTaken(prevTime => prevTime + timeTaken); // Add time taken for this test to total time
    }
  };

  return (
    <div className={styles.test}>    
      <button onClick={fetchAuthenticationData} disabled={loading || testingInProgress}>
        {loading ? "Running test..." : "Run test"}
      </button>
      {testResult.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
      {testsPassed === 4 && (
        <p>{testsPassed} Tests Passed ({totalTimeTaken}ms)</p>
      )}
    </div>
  );
}

export default Test;
