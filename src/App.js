import React, { useState, useEffect, useCallback } from "react";
import { loginToTwilio, fetchPhoneNumbers, fetchConversations } from "./api";
import PhoneNumberCard from "./PhoneNumberCard";
import LoginForm from "./LoginForm";

const PULL_INTERVAL = process.env.REACT_APP_PULL_INTERVAL || 5000;

const App = () => {
  const [accountSid, setAccountSid] = useState(
    localStorage.getItem("accountSid") || "",
  );
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || "",
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [allConversations, setAllConversations] = useState({});

  const fetchAllConversations = useCallback(async () => {
    if (!isAuthenticated) return;

    const newConversations = {};
    for (const phoneNumber of phoneNumbers) {
      try {
        const conversations = await fetchConversations(
          accountSid,
          authToken,
          phoneNumber,
        );
        newConversations[phoneNumber] = conversations;
      } catch (error) {
        console.error(
          `Error fetching conversations for ${phoneNumber}:`,
          error,
        );
      }
    }

    setAllConversations(newConversations);
  }, [isAuthenticated, phoneNumbers, accountSid, authToken]);

  useEffect(() => {
    if (accountSid && authToken) {
      handleLogin();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllConversations();
      const intervalId = setInterval(fetchAllConversations, PULL_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, fetchAllConversations]);

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
    setAllConversations({});
    localStorage.removeItem("accountSid");
    localStorage.removeItem("authToken");
  };

  const handleRefreshAll = () => {
    fetchAllConversations();
  };

  return (
    <div className="container-fluid mt-3">
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>SMS Conversations</h2>
            <div>
              <button
                className="btn btn-primary me-2"
                onClick={handleRefreshAll}
              >
                <i className="fas fa-sync-alt"></i> Refresh All
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
          {phoneNumbers.map((phoneNumber) => (
            <PhoneNumberCard
              key={phoneNumber}
              phoneNumber={phoneNumber}
              accountSid={accountSid}
              authToken={authToken}
              conversations={allConversations[phoneNumber] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
