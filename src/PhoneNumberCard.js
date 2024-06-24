import React, { useState } from "react";
import { sendMessage } from "./api";
import ConversationList from "./ConversationList";
import NewMessageForm from "./NewMessageForm";

const PhoneNumberCard = ({
  phoneNumber,
  accountSid,
  authToken,
  conversations,
}) => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSendMessage = async (to, body) => {
    try {
      await sendMessage(accountSid, authToken, phoneNumber, to, body);
      // The new message will be fetched in the next polling interval
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
        {conversations.length > 0 ? (
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
