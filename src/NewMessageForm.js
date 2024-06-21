import React, { useState } from "react";

const NewMessageForm = ({ onSendMessage }) => {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (to && message) {
      onSendMessage(to, message);
      setTo("");
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4>New SMS</h4>
      <div className="mb-3">
        <label htmlFor="to" className="form-label">
          To:
        </label>
        <input
          type="text"
          className="form-control"
          id="to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="message" className="form-label">
          Message:
        </label>
        <textarea
          className="form-control"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Send
      </button>
    </form>
  );
};

export default NewMessageForm;
