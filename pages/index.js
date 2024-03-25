import { useEffect, useState } from "react";
import styles from '../styles/Home.module.css';
import { ethers } from 'ethers';
import * as Constants from "../Utils/config"

function App() {

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
  const [passports, setPassports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newIssueDate, setNewIssueDate] = useState("");
  const [newExpiryDate, setNewExpiryDate] = useState("");

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
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
        // Move reload inside the else block
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePassport = async (index) => {
    setLoading(true);
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
    setLoading(false);
  };

  const handleUpdatePassportDates = async (index) => {
    setLoading(true);
    try {
      const response = await fetch("/api/updatePassportDate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ index, issueDate: newIssueDate, expiryDate: newExpiryDate })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(error);
      } else {
        // Update the issue date and expiry date of the passport
        const updatedPassports = [...passports];
        updatedPassports[index].issueDate = newIssueDate;
        updatedPassports[index].expiryDate = newExpiryDate;
        setPassports(updatedPassports);
        // Reset editIndex after updating
        setEditIndex(null);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      )}
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
            {passports.map((passport, index) => (
              <tr key={index}>
                <td>{index ? <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /> : passport.name}</td>
                <td>{index ? <input type="text" value={formData.passportNumber} onChange={e => setFormData({ ...formData, passportNumber: e.target.value })} /> : passport.passportNumber}</td>
                <td>{index ? <input type="text" value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })} /> : passport.nationality}</td>
                <td>{index ? <input type="text" value={formData.birthDate} onChange={e => setFormData({ ...formData, birthDate: e.target.value })} /> : passport.birthDate}</td>
                <td>{index ? <input type="text" value={formData.placeOfBirth} onChange={e => setFormData({ ...formData, placeOfBirth: e.target.value })} /> : passport.placeOfBirth}</td>
                <td>{index ? <input type="text" value={formData.sex} onChange={e => setFormData({ ...formData, sex: e.target.value })} /> : passport.sex}</td>
                <td>{editIndex === index ? <input type="text" value={newIssueDate} onChange={e => setNewIssueDate(e.target.value)} /> : passport.issueDate}</td>
                <td>{editIndex === index ? <input type="text" value={newExpiryDate} onChange={e => setNewExpiryDate(e.target.value)} /> : passport.expiryDate}</td>
                <td>
                  {editIndex === index ? (
                    <>
                      <button className={styles.button} onClick={() => handleUpdatePassportDates(index)}>Update</button>
                      <button className={styles.button} onClick={() => setEditIndex(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className={styles.button} onClick={() => setEditIndex(index)}>Edit</button>
                      <button className={styles.button} onClick={() => handleDeletePassport(index)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
