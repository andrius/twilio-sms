// NewMessageForm.js

import React, { useState } from "react";
import { sendMessage } from "./api";

const NewMessageForm = ({
  phoneNumber,
  accountSid,
  authToken,
  refreshConversations,
}) => {
  const [newMessageTo, setNewMessageTo] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sendStatus, setSendStatus] = useState("");

  const handleSendMessage = async () => {
    if (!newMessageTo.trim()) {
      setSendStatus("Error: To phone number is required.");
      return;
    }

    try {
      setSendStatus("Sending...");
      console.log("Sending message:", {
        from: phoneNumber,
        to: newMessageTo,
        body: newMessage,
      });
      await sendMessage(
        accountSid,
        authToken,
        phoneNumber,
        newMessageTo,
        newMessage
      );
      setSendStatus("Message sent successfully.");
      setNewMessage("");
      setNewMessageTo("");
      refreshConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      setSendStatus(`Error sending message: ${error.message}`);
    }
  };

  return (
    <div className="mt-4">
      <h4>Send New Message</h4>
      <input
        type="text"
        className="form-control mb-2"
        value={newMessageTo}
        onChange={(e) => setNewMessageTo(e.target.value)}
        placeholder="To phone number"
      />
      <textarea
        className="form-control mb-2"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="btn btn-primary" onClick={handleSendMessage}>
        Send
      </button>
      {sendStatus && <p className="mt-2">{sendStatus}</p>}
    </div>
  );
};

export default NewMessageForm;
