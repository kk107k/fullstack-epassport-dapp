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
    const placeOfBirthSelect = new CountrySelect('placeOfBirth');
    countrySelect.generateOptions();
    placeOfBirthSelect.generateOptions();
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
    <div>
        {loading && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Passport Form</h1>
        <div className={styles.formContainer}>
          <div className={styles.formTop}>
          <div className={styles.formInput}>
            <label for="name">Full name</label>
            <input type="text" id="name" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
          </div>
          <div className={styles.formInput}>
            <label for="passportNumber">Passport Number</label>
            <input type="text" id="passportNumber" name="passportNumber" placeholder="Passport Number" value={formData.passportNumber} onChange={handleChange} />
          </div>
        </div> 
        <div className={styles.formbody}>
          <div className={styles.formInput}>
            <label for="nationality">Nationality</label>
            <select id="nationality" name="nationality" value={formData.nationality} onChange={handleChange}></select>
          </div>
          <div className={styles.formInput}>
            <label for="placeOfBirth">Place Of Birth</label>
            <select id="placeOfBirth" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange}></select>
          </div>
        </div>
        <div className={styles.formbody}>
          <div className={styles.formInput}>
            <label for="birthDate">Birth Date</label>
            <input type="date" name="birthDate" placeholder="Birth Date" value={formData.birthDate} onChange={handleChange} />
          </div>
          <div  className={styles.formInput}>
          <label for="sex">Sex</label>
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
        </div>
        <div className={styles.formbody}>
          <div  className={styles.formInput}>
            <label for="issueDate">Issue Date</label>
            <input type="date" name="issueDate" placeholder="Issue Date" value={formData.issueDate} onChange={handleChange} />
          </div>
          <div  className={styles.formInput}>
            <label for="expiryDate">Expiry Date</label>
            <input type="date" name="expiryDate" placeholder="Expiry Date" value={formData.expiryDate} onChange={handleChange} />
          </div>
        </div>
        </div>
        <input type="submit" value="Add Passport" />
      </form>
    </div>
  );
}

export default PassportForm;