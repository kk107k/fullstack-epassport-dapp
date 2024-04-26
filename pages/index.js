import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css';

function App() {

  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/authenticationData')
    fetch('http://127.0.0.1:5000/authenticationAdmin')
      .then(response => response.json())
      .then(data => {
        setAuthenticated(data.success);
        setUserName(data.name);
        if (!data.success) {
          router.push("http://127.0.0.1:5000/adminRegister");
        }
      })
      .catch(error => {
        console.error('Error fetching authentication data:', error);
      });
  }, []);

  const renderContent = () => {
    if (authenticated) {
      return (
        <div className={styles.container}>
          <video id={styles.videoBackground} autoPlay muted loop>
            <source src="/assets/ePassportTemplate.mp4" type="video/mp4" />
          </video>
          <div className={styles.mainContainer}>
            <h2>Welcome {userName}</h2>
            <div id={styles.containerButtons}>
              <button><a href="/PassportFormPage">Passport Form</a></button>
              <button><a href="/PassportTablePage">Passport Database</a></button>
            </div>
          </div>
        </div>
      );
    } else {
      return null; // or any loading indicator you want to show while authentication is in progress
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}

export default App;
