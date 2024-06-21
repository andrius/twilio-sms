import React, { useState } from "react";
import { sendMessage } from "./api";

const ConversationView = ({
  conversation,
  phoneNumber,
  accountSid,
  authToken,
  refreshConversations,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [sendStatus, setSendStatus] = useState("");

  const handleSendReply = async () => {
    try {
      setSendStatus("Sending...");
      await sendMessage(
        accountSid,
        authToken,
        phoneNumber,
        conversation.otherNumber,
        newMessage
      );
      setSendStatus("Message sent successfully.");
      setNewMessage("");
      refreshConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      setSendStatus("Error sending message. Please try again.");
    }
  };

  return (
    <div>
      <h4>Conversation with {conversation.otherNumber}</h4>
      {conversation.messages.map((message) => (
        <div
          key={message.sid}
          className={`mb-2 ${
            message.from === phoneNumber ? "text-right" : "text-left"
          }`}
        >
          <strong>{message.from === phoneNumber ? "You" : "Them"}:</strong>{" "}
          {message.body}
        </div>
      ))}
      <div className="mt-3">
        <textarea
          className="form-control mb-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a reply..."
        />
        <button className="btn btn-primary" onClick={handleSendReply}>
          Reply
        </button>
        {sendStatus && <p className="mt-2">{sendStatus}</p>}
      </div>
    </div>
  );
};

export default ConversationView;
