import React from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import styles from '../../styles/Home.module.css'; // Import CSS module

const Navbar = () => {
  const router = useRouter(); // Get the router object

  return (
    <nav className={styles.Navbar}>
      <ul>
        <li>
          <a href="http://127.0.0.1:5000/logout" className={styles.logoutButton}><p>Log out</p></a>
        </li>
        <li>
          <a href="/" className={router.pathname === '/' ? styles.active : ''}>Home</a>
        </li>
        <li>
          <a href="/PassportTablePage" className={router.pathname === '/PassportTablePage' ? styles.active : ''}>Database</a>
        </li>
        <li>
          <a href="/PassportFormPage" className={router.pathname === '/PassportFormPage' ? styles.active : ''}>Form</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
