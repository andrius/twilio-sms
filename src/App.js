import React, { useState, useEffect } from "react";
import { loginToTwilio, fetchPhoneNumbers } from "./api";
import LoginForm from "./LoginForm";
import PhoneNumberCard from "./PhoneNumberCard";

const App = () => {
  const [accountSid, setAccountSid] = useState(
    localStorage.getItem("accountSid") || ""
  );
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || ""
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);

  useEffect(() => {
    if (accountSid && authToken) {
      handleLogin();
    }
  }, []);

  const handleLogin = async () => {
    try {
      await loginToTwilio(accountSid, authToken);
      setIsAuthenticated(true);
      localStorage.setItem("accountSid", accountSid);
      localStorage.setItem("authToken", authToken);
      const numbers = await fetchPhoneNumbers(accountSid, authToken);
      setPhoneNumbers(numbers);
    } catch (error) {
      console.error("Authentication failed:", error);
      alert("Authentication failed. Please check your credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccountSid("");
    setAuthToken("");
    setPhoneNumbers([]);
    localStorage.removeItem("accountSid");
    localStorage.removeItem("authToken");
  };

  return (
    <div className="container mt-5">
      {!isAuthenticated ? (
        <LoginForm
          accountSid={accountSid}
          authToken={authToken}
          setAccountSid={setAccountSid}
          setAuthToken={setAuthToken}
          handleLogin={handleLogin}
        />
      ) : (
        <div>
          <h2 className="mb-4">SMS Conversations</h2>
          <button className="btn btn-danger mb-4" onClick={handleLogout}>
            Logout
          </button>
          {phoneNumbers.map((phoneNumber) => (
            <PhoneNumberCard
              key={phoneNumber}
              phoneNumber={phoneNumber}
              accountSid={accountSid}
              authToken={authToken}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
