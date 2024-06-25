// src/components/PhoneNumberCard.js

import React, { useState } from "react";
import ConversationList from "./ConversationList";
import NewMessageForm from "./NewMessageForm";
import { useAuthContext } from "../contexts/AuthContext";
import { sendMessage } from "../services/api";

const PhoneNumberCard = ({ phoneNumber, conversations }) => {
  const { accountSid, authToken } = useAuthContext();
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSendMessage = async (to, body) => {
    try {
      await sendMessage(accountSid, authToken, phoneNumber, to, body);
      // You might want to refresh conversations here or handle the UI update
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  console.log(`Conversations for ${phoneNumber}:`, conversations); // Debugging line

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>{phoneNumber}</h3>
      </div>
      <div className="card-body">
        <NewMessageForm onSendMessage={handleSendMessage} />
        {conversations && conversations.length > 0 ? (
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
            phoneNumber={phoneNumber}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <p>No conversations found.</p>
        )}
      </div>
    </div>
  );
};

export default PhoneNumberCard;
