import React from "react";
import ConversationView from "./ConversationView";

const ConversationList = ({
  conversations,
  selectedConversation,
  setSelectedConversation,
  phoneNumber,
  onSendMessage,
}) => {
  return (
    <div className="accordion" id="conversationAccordion">
      {conversations.map(([otherNumber, messages], index) => {
        // Sort messages in descending order (latest first)
        const sortedMessages = [...messages].sort(
          (a, b) => new Date(b.date_sent) - new Date(a.date_sent),
        );
        const latestMessage = sortedMessages[0];
        const formattedDate = new Date(latestMessage.date_sent).toLocaleString(
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
          <div key={otherNumber} className="card">
            <div className="card-header" id={`heading${index}`}>
              <h2 className="mb-0">
                <button
                  className="btn btn-link btn-block text-left"
                  type="button"
                  data-toggle="collapse"
                  data-target={`#collapse${index}`}
                  aria-expanded={selectedConversation === otherNumber}
                  aria-controls={`collapse${index}`}
                  onClick={() =>
                    setSelectedConversation(
                      selectedConversation === otherNumber ? null : otherNumber,
                    )
                  }
                >
                  <div className="conversation-summary">
                    <strong>{otherNumber}</strong>
                    <small className="text-muted">{formattedDate}</small>
                  </div>
                  <div className="conversation-preview">
                    {latestMessage.body.substring(0, 50)}
                    {latestMessage.body.length > 50 ? "..." : ""}
                  </div>
                </button>
              </h2>
            </div>

            <div
              id={`collapse${index}`}
              className={`collapse ${
                selectedConversation === otherNumber ? "show" : ""
              }`}
              aria-labelledby={`heading${index}`}
              data-parent="#conversationAccordion"
            >
              <div className="card-body">
                <ConversationView
                  messages={messages}
                  phoneNumber={phoneNumber}
                  otherNumber={otherNumber}
                  onSendMessage={onSendMessage}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
