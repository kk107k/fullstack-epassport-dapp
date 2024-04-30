import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import * as Constants from "../../Utils/config";
import { ethers } from 'ethers'; // Import ethers.js

function Test() {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState([]);
  const [testsPassed, setTestsPassed] = useState(0);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [authenticated, setAuthenticated] = useState(false);

  const runTests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:5000/runTests');
      const data = await response.json();
      setTestResult(data.results);
      setTestsPassed(data.testsPassed);
      setTotalTimeTaken(data.totalTimeTaken);
      setLoading(false);
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setLoading(false);
      setTestingInProgress(false); // Reset testing in progress

    }
  };

  return (
    <div className={styles.test}>    
      <button onClick={runTests} disabled={loading}>
        {loading ? "Running tests..." : "Run tests"}
      </button>
      {testResult.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
      {testsPassed > 0 && (
        <p>{testsPassed} Tests Passed ({totalTimeTaken}ms)</p>
      )}
    </div>
  );
}

export default Test;
