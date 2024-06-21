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

  return (
    <div>
      <div className="conversation-messages mb-3">
        {messages
          .slice()
          .reverse()
          .map((message, index) => {
            const isOutgoing = message.from === phoneNumber;
            const formattedDate = new Date(message.date_sent).toLocaleString(
              "en-US",
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              },
            );

            return (
              <div
                key={message.sid}
                className={`mb-2 ${isOutgoing ? "text-right" : "text-left"}`}
              >
                <small>
                  {formattedDate} [{isOutgoing ? "OUT" : "IN"}]
                </small>
                <br />
                <strong>{isOutgoing ? "You" : otherNumber}:</strong>{" "}
                {message.body}
              </div>
            );
          })}
      </div>
      <div className="reply-form">
        <textarea
          className="form-control mb-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a reply..."
        />
        <button className="btn btn-primary" onClick={handleSendReply}>
          Reply
        </button>
      </div>
    </div>
  );
};

export default ConversationView;
