import React, { useState, useEffect } from "react";
import { fetchConversations, sendMessage } from "./api";
import ConversationList from "./ConversationList";
import NewMessageForm from "./NewMessageForm";

const PhoneNumberCard = ({ phoneNumber, accountSid, authToken }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConversations();
  }, [phoneNumber]);

  const loadConversations = async () => {
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
  };

  const handleSendMessage = async (to, body) => {
    try {
      await sendMessage(accountSid, authToken, phoneNumber, to, body);
      loadConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>{phoneNumber}</h3>
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
