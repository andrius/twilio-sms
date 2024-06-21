import React, { useState, useEffect, useCallback } from "react";
import { fetchConversations, sendMessage } from "./api";
import ConversationList from "./ConversationList";
import NewMessageForm from "./NewMessageForm";

const PhoneNumberCard = ({ phoneNumber, accountSid, authToken }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const convos = await fetchConversations(
        accountSid,
        authToken,
        phoneNumber,
      );
      setConversations(convos);
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError("Failed to load conversations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [accountSid, authToken, phoneNumber]);

  useEffect(() => {
    loadConversations();
    const intervalId = setInterval(loadConversations, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(intervalId);
  }, [loadConversations]);

  const handleSendMessage = async (to, body) => {
    try {
      await sendMessage(accountSid, authToken, phoneNumber, to, body);
      await loadConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3>{phoneNumber}</h3>
        <button className="btn btn-outline-primary" onClick={loadConversations}>
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>
      <div className="card-body">
        <NewMessageForm onSendMessage={handleSendMessage} />
        {loading ? (
          <p>Loading conversations...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
            phoneNumber={phoneNumber}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default PhoneNumberCard;
