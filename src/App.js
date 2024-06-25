// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import { loginToTwilio, fetchPhoneNumbers, fetchConversations } from "./api";
import PhoneNumberCard from "./PhoneNumberCard";
import LoginForm from "./LoginForm";
import {
  requestNotificationPermission,
  sendNotification,
} from "./notifications";

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
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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

        // Check for new messages
        if (allConversations[phoneNumber]) {
          const existingConversations = allConversations[phoneNumber];
          conversations.forEach(([otherNumber, messages]) => {
            const existingMessages =
              existingConversations.find(([num]) => num === otherNumber)?.[1] ||
              [];
            const newMessages = messages.filter(
              (msg) =>
                !existingMessages.some((existing) => existing.sid === msg.sid),
            );

            if (newMessages.length > 0 && notificationsEnabled) {
              sendNotification(
                `New message from ${otherNumber}`,
                newMessages[0].body.substring(0, 50) +
                  (newMessages[0].body.length > 50 ? "..." : ""),
              );
            }
          });
        }

        newConversations[phoneNumber] = conversations;
      } catch (error) {
        console.error(
          `Error fetching conversations for ${phoneNumber}:`,
          error,
        );
      }
    }

    setAllConversations(newConversations);
  }, [
    isAuthenticated,
    phoneNumbers,
    accountSid,
    authToken,
    allConversations,
    notificationsEnabled,
  ]);

  useEffect(() => {
    if (accountSid && authToken) {
      handleLogin();
    }
    requestNotificationPermission().then(setNotificationsEnabled);
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
                Refresh All
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
