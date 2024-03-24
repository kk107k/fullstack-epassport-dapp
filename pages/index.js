import { useEffect, useState } from "react";
import styles from '../styles/Home.module.css';
import { ethers } from 'ethers';
import * as Constants from "../Utils/config"

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

  const [formData, setFormData] = useState({
    name: "",
    passportNumber: "",
    nationality: "",
    birthDate: "",
    placeOfBirth: "",
    sex: "",
    issueDate: "",
    expiryDate: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/addPassport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(error);
      } else {
        const newPassport = await response.json();
        setPassports(prevPassports => [...prevPassports, newPassport]);
        setFormData({
          name: "",
          passportNumber: "",
          nationality: "",
          birthDate: "",
          placeOfBirth: "",
          sex: "",
          issueDate: "",
          expiryDate: ""
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePassport = async (index) => {
    try {
      const response = await fetch("/api/deletePassport", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ index })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(error);
      } else {
        // Update passports state after deletion
        const updatedPassports = passports.filter((passport, i) => i !== index);
        setPassports(updatedPassports);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input type="text" name="passportNumber" placeholder="Passport Number" value={formData.passportNumber} onChange={handleChange} />
        <input type="text" name="nationality" placeholder="Nationality" value={formData.nationality} onChange={handleChange} />
        <input type="text" name="birthDate" placeholder="Birth Date" value={formData.birthDate} onChange={handleChange} />
        <input type="text" name="placeOfBirth" placeholder="Place of Birth" value={formData.placeOfBirth} onChange={handleChange} />
        <input type="text" name="sex" placeholder="Sex" value={formData.sex} onChange={handleChange} />
        <input type="text" name="issueDate" placeholder="Issue Date" value={formData.issueDate} onChange={handleChange} />
        <input type="text" name="expiryDate" placeholder="Expiry Date" value={formData.expiryDate} onChange={handleChange} />
        <input type="submit" value="Add Passport" />
      </form>
      </div>
      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Passport Number</th>
              <th>Nationality</th>
              <th>Birth Date</th>
              <th>Place of Birth</th>
              <th>Sex</th>
              <th>Issue Date</th>
              <th>Expiry Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              passports.map((passport, index) => (
                <tr key={index}>
                  <td>{passport.name}</td>
                  <td>{passport.passportNumber}</td>
                  <td>{passport.nationality}</td>
                  <td>{passport.birthDate}</td>
                  <td>{passport.placeOfBirth}</td>
                  <td>{passport.sex}</td>
                  <td>{passport.issueDate}</td>
                  <td>{passport.expiryDate}</td>
                  <td>
                    <button className={styles.button} onClick={() => handleDeletePassport(index)}>Delete</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
