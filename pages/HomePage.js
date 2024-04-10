import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetch('http://127.0.0.1:5000/authenticationData')
      .then(response => response.json())
      .then(data => {
        setAuthenticated(data.success);
        setUserName(data.name);
        console.log(data);
        console.log(data.success);
        console.log(data.name);
        console.log("hello")
      })
      .catch(error => {
        console.error('Error fetching authentication data:', error);
      });
  }, []);


  const renderContent = () => {
    if (authenticated) {
      return <h1>Welcome, {userName}!</h1>;
    } else {
      return <h1>AUTHENTICATED USERS ONLY</h1>;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default HomePage;
