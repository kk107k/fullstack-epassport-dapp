import React from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css';

function App() {

  const router = useRouter();

  const handleNavigate = (route) => {
    router.push(route);
  };


  return (
    <div className={styles.body}>
       <button onClick={() => handleNavigate("/PassportFormPage")}>Passport Form</button>
      <button onClick={() => handleNavigate("/PassportTablePage")}>Passport Table</button>
    </div>
  );
}

export default App;