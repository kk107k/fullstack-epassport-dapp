import { useState } from "react";
import styles from '../../styles/Home.module.css';

function PassportForm({ setPassports }) {
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
  const [loading, setLoading] = useState(false);

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
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}

export default PassportForm;
