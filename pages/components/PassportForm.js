import { useState, useEffect } from "react";
import styles from '../../styles/Home.module.css';
import CountrySelect from '../../Utils/CountrySelector';

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

  useEffect(() => {
    const countrySelect = new CountrySelect('nationality');
    countrySelect.generateOptions();
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
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
        {loading && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label for="name">Full name</label>
          <input type="text" id="name" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
          <label for="passportNumber">Passport Number</label>
          <input type="text" id="passportNumber" name="passportNumber" placeholder="Passport Number" value={formData.passportNumber} onChange={handleChange} />
        </div> 
        <div className={styles.formbody}>
          <label for="nationality">Nationality</label>
          <select id="nationality" name="nationality" value={formData.nationality} onChange={handleChange}></select>
          <div class={styles.wrapper}>
            <div class={styles.custominput}>
              <input type="radio" id="female" name="sex"  value="female" checked={formData.sex === "female"} onChange={handleChange}/>
              <label for="female">Female</label>
            </div>
            <div class={styles.custominput}>
              <input type="radio" id="male" name="sex"  value="male" checked={formData.sex === "male"} onChange={handleChange}/>
              <label for="male">Male</label>
            </div>
          </div>
        </div>
        <div className={styles.formbody}>
          <input type="text" name="birthDate" placeholder="Birth Date" value={formData.birthDate} onChange={handleChange} />
          <input type="text" name="placeOfBirth" placeholder="Place of Birth" value={formData.placeOfBirth} onChange={handleChange} />
        </div>
        <div className={styles.formbody}>
          <input type="text" name="issueDate" placeholder="Issue Date" value={formData.issueDate} onChange={handleChange} />
          <input type="text" name="expiryDate" placeholder="Expiry Date" value={formData.expiryDate} onChange={handleChange} />
        </div>
        <input type="submit" value="Add Passport" />
      </form>
    </div>
  );
}

export default PassportForm;