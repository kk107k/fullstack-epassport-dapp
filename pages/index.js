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
        <div className={styles.body}>
           <button onClick={() => handleNavigate("/PassportFormPage")}>Passport Form</button>
          <button onClick={() => handleNavigate("/PassportTablePage")}>Passport Table</button>
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