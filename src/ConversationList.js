import React from "react";

const ConversationList = ({ conversations, setSelectedConversation }) => (
  <div>
    {conversations.map(([otherNumber, messages]) => (
      <div
        key={otherNumber}
        onClick={() => setSelectedConversation({ otherNumber, messages })}
        className="border p-2 mb-2 cursor-pointer"
      >
        <p>{otherNumber}</p>
        <p>{messages[0].body}</p>
      </div>
    ))}
  </div>
);

export default ConversationList;
