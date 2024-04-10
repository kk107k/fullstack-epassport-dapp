import React, { useState } from "react";
import styles from '../../styles/Home.module.css';

function PassportTable({ passports, setPassports }) {
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newIssueDate, setNewIssueDate] = useState("");
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [searchValue, setSearchValue] = useState("");

  // Function to format timestamp to mm-dd-yyyy
  const formatDate = (timestamp) => {
    console.log(timestamp);
    const date = new Date(timestamp * 1);
    console.log(date);
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const yyyy = date.getFullYear();
    return `${mm < 10 ? '0' + mm : mm}-${dd < 10 ? '0' + dd : dd}-${yyyy}`;
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

  const handleDeleteAllPassports = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/deleteAllPassports", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(error);
      } else {
        // Update passports state after deletion
        setPassports([]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleUpdatePassportDates = async (index) => {
    setLoading(true);
    try {
      const passportToUpdate = passports[index];
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
        // Update the issue date and expiry date of the passport locally
        const updatedPassports = [...passports];
        updatedPassports[index] = {
          ...passportToUpdate,
          issueDate: newIssueDate,
          expiryDate: newExpiryDate
        };
        setPassports(updatedPassports);
        // Reset editIndex after updating
        setEditIndex(null);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  

  const filteredPassports = passports.filter(passport => {
    if (searchValue === "") return true;
    return passport[searchCriteria].toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <div className={styles.container}>
        {loading && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <div className={styles.search}>
        <select value={searchCriteria} onChange={e => setSearchCriteria(e.target.value)}>
          <option value="name">Name</option>
          <option value="passportNumber">Passport Number</option>
          <option value="nationality">Nationality</option>
            <option value="birthDate">Birth Date</option>
            <option value="placeOfBirth">Place of Birth</option>
            <option value="Sex">Sex</option>
            <option value="issueDate">Issue Date</option>
            <option value="expiryDate">Expiry Date</option>
            <option value="passportAddress">Passport Address</option>
        </select>
        <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder={`Search by ${searchCriteria}`} />
      </div>
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
            <th>Passport Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPassports.map((passport, index) => (
            <tr key={index}>
              <td>{passport.name}</td>
              <td>{passport.passportNumber}</td>
              <td>{passport.nationality}</td>
              <td>{formatDate(passport.birthDate)}</td> 
              <td>{passport.placeOfBirth}</td>
              <td>{passport.sex}</td>
              <td>{editIndex === index ? <input type="text" value={newIssueDate} onChange={e => setNewIssueDate(e.target.value)} /> : formatDate(passport.issueDate)}</td>
              <td>{editIndex === index ? <input type="text" value={newExpiryDate} onChange={e => setNewExpiryDate(e.target.value)} /> : formatDate(passport.expiryDate)}</td>
              <td>{passport.passportAddress}</td>
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
                    <button className={styles.button} onClick={handleDeleteAllPassports}>Delete All Passports</button>                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PassportTable;
