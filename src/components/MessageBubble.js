// src/components/MessageBubble.js

import React from "react";
import { formatDate } from "../utils/dateFormatters";

const MessageBubble = ({ message, isOutgoing }) => (
  <div className={`message-bubble ${isOutgoing ? "outgoing" : "incoming"}`}>
    <div className="message-content">{message.body}</div>
    <div className="message-timestamp">{formatDate(message.date_sent)}</div>
  </div>
);

export default MessageBubble;
