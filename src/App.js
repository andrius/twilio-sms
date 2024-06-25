// src/App.js
import React from "react";
import PhoneNumberCard from "./PhoneNumberCard";
import LoginForm from "./LoginForm";
import { useAuth } from "./hooks/useAuth";
import { useConversations } from "./hooks/useConversations";

const App = () => {
  const {
    accountSid,
    authToken,
    isAuthenticated,
    phoneNumbers,
    setAccountSid,
    setAuthToken,
    handleLogin,
    handleLogout,
  } = useAuth();

  const allConversations = useConversations(
    isAuthenticated,
    phoneNumbers,
    accountSid,
    authToken,
  );

  const handleRefreshAll = () => {
    // This will trigger a re-fetch in the useConversations hook
    // You might want to add a force refresh parameter to the hook if needed
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
