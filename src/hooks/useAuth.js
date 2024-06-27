// src/hooks/useAuth.js

import { useState, useEffect } from "react";
import { loginToTwilio, fetchPhoneNumbers } from "../services/api";

export const useAuth = () => {
  const [accountSid, setAccountSid] = useState(
    localStorage.getItem("accountSid") || "",
  );
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || "",
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

  return {
    accountSid,
    authToken,
    isAuthenticated,
    phoneNumbers,
    setAccountSid,
    setAuthToken,
    handleLogin,
    handleLogout,
  };
};
