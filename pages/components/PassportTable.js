import React, { useState } from "react";
import styles from '../../styles/Home.module.css';

function PassportTable({ passports, setPassports, showAddress, showActions, showElse }) {
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newIssueDate, setNewIssueDate] = useState("");
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [searchValue, setSearchValue] = useState("");

  // Function to format timestamp to mm-dd-yyyy
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1);
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
      // Convert newIssueDate and newExpiryDate to timestamps
      const issueDateTimestamp = new Date(newIssueDate).getTime();
      const expiryDateTimestamp = new Date(newExpiryDate).getTime();
      
      const response = await fetch("/api/updatePassportDate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ index, issueDate: issueDateTimestamp, expiryDate: expiryDateTimestamp })
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error(error);
      } else {
        // Update the issue date and expiry date of the passport locally
        const updatedPassports = [...passports];
        updatedPassports[index] = {
          ...passportToUpdate,
          issueDate: issueDateTimestamp,
          expiryDate: expiryDateTimestamp
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
    if (passport.name.trim() === "") return false;
    return passport[searchCriteria].toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <div>
        <div className={styles.search}>
          <h1>Database</h1>
          <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder={`Search by ${searchCriteria}`} />
          <select value={searchCriteria} onChange={e => setSearchCriteria(e.target.value)}>
            <option value="name">Name</option>
            <option value="passportNumber">Passport Number</option>
            {showElse && <option value="nationality">Nationality</option>}
            {showElse && <option value="birthDate">Birth Date</option>}
            {showElse && <option value="placeOfBirth">Place of Birth</option>}
            {showElse && <option value="Sex">Sex</option>}
            {showElse && <option value="issueDate">Issue Date</option>}
            {showElse && <option value="expiryDate">Expiry Date</option>}
            {showAddress && <option value="passportAddress">Passport Address</option>}
          </select>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Passport Number</th>
              {showElse && <th>Nationality</th>}
              {showElse && <th>Birth Date</th>}
              {showElse && <th>Place of Birth</th>}
              {showElse && <th>Sex</th>}
              {showElse && <th>Issue Date</th>}
              {showElse && <th>Expiry Date</th>}
              {showAddress && <th>Passport Address</th>}
              {showActions && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPassports.map((passport, index) => (
              passport.name && passport.name.trim() !== "" && (
                <tr key={index}>
                  <td>{passport.name}</td>
                  <td>{passport.passportNumber}</td>
                  {showElse && <td>{passport.nationality}</td>}
                  {showElse && <td>{formatDate(passport.birthDate)}</td>}
                  {showElse && <td>{passport.placeOfBirth}</td>}
                  {showElse && <td>{passport.sex}</td>}
                  {showElse && <td>{editIndex === index ? <input type="date" value={newIssueDate} onChange={e => setNewIssueDate(e.target.value)} /> : formatDate(passport.issueDate)}</td>}
                  {showElse && <td>{editIndex === index ? <input type="date" value={newExpiryDate} onChange={e => setNewExpiryDate(e.target.value)} /> : formatDate(passport.expiryDate)}</td>}
                  {showAddress && <td>{passport.passportAddress}</td>}
                  <td className={styles.tableButtons}>
                    {showActions && (
                      <>
                        {editIndex === index ? (
                          <>
                            <button className={styles.button} onClick={() => handleUpdatePassportDates(index)}>Update</button>
                            <button className={styles.button} onClick={() => setEditIndex(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className={styles.button} onClick={() => setEditIndex(index)}>⚙️</button>
                            <button className={styles.button} onClick={() => handleDeletePassport(index)}>❌</button>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              )
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PassportTable;
