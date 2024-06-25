// src/components/App.js

import React from "react";
import PhoneNumberCard from "./PhoneNumberCard";
import LoginForm from "./LoginForm";
import { useAuthContext } from "../contexts/AuthContext";
import { useConversations } from "../hooks/useConversations";

const App = () => {
  const { isAuthenticated, phoneNumbers, handleLogout } = useAuthContext();
  const allConversations = useConversations();

  console.log("All conversations:", allConversations); // Debugging line

  const handleRefreshAll = () => {
    // Implement refresh logic if needed
  };

  return (
    <div className="container-fluid mt-3">
      {!isAuthenticated ? (
        <LoginForm />
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
              conversations={allConversations[phoneNumber] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
