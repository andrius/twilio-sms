// src/components/ConversationView.js

import React, { useState } from "react";
import MessageBubble from "./MessageBubble";

const ConversationView = ({
  messages,
  phoneNumber,
  otherNumber,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendReply = async () => {
    if (newMessage.trim()) {
      await onSendMessage(otherNumber, newMessage);
      setNewMessage("");
    }
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.date_sent) - new Date(b.date_sent),
  );

  return (
    <div className="conversation-container">
      <div className="conversation-messages mb-3">
        {sortedMessages.map((message) => (
          <MessageBubble
            key={message.sid}
            message={message}
            isOutgoing={message.from === phoneNumber}
          />
        ))}
      </div>
      <div className="reply-form">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a reply..."
          />
          <button className="btn btn-primary" onClick={handleSendReply}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
