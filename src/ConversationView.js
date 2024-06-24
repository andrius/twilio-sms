import React, { useState } from "react";

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

  // Sort messages in ascending order
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.date_sent) - new Date(b.date_sent),
  );

  return (
    <div className="conversation-container">
      <div className="conversation-messages mb-3">
        {sortedMessages.map((message, index) => {
          const isOutgoing = message.from === phoneNumber;
          const formattedDate = new Date(message.date_sent).toLocaleString(
            "en-US",
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            },
          );

          return (
            <div
              key={message.sid}
              className={`message-bubble ${isOutgoing ? "outgoing" : "incoming"}`}
            >
              <div className="message-content">{message.body}</div>
              <div className="message-timestamp">{formattedDate}</div>
            </div>
          );
        })}
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
