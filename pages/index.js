import React, {useState, useEffect} from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css';

function App() {

  const router = useRouter();

  const handleNavigate = (route) => {
    router.push(route);
  };

  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

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


  const renderContent = () => {
    if (authenticated) {
      return (
        <div className={styles.container}>
            <video id={styles.videoBackground} autoPlay muted loop>
            <source src="/assets/ePassportTemplate.mp4" type="video/mp4" />
            </video>
          <div>
            <h1>Welcome {userName}</h1>
              <div id={styles.containerButtons}>
                <button><a href="/PassportFormPage">Passport Form</a></button>
                <button><a href="/PassportTablePage">Passport Table</a></button>
              </div>
          </div>
        </div>
      );
    } else {
      return <h1>AUTHENTICATED USERS ONLY</h1>;
    }
  };
  return (
    <div>
      {renderContent()}
    </div>
  );
}

export default App;