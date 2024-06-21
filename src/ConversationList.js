import React from "react";
import ConversationView from "./ConversationView";

const ConversationList = ({
  conversations,
  selectedConversation,
  setSelectedConversation,
  phoneNumber,
  onSendMessage,
}) => (
  <div className="accordion" id="conversationAccordion">
    {conversations.map(([otherNumber, messages], index) => {
      const latestMessage = messages[0];
      const isIncoming = latestMessage.from !== phoneNumber;
      const formattedDate = new Date(latestMessage.date_sent).toLocaleString(
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
                {formattedDate} - {isIncoming ? "IN" : "OUT"} - {otherNumber} -{" "}
                {latestMessage.body.substring(0, 50)}...
              </button>
            </h2>
          </div>

          <div
            id={`collapse${index}`}
            className={`collapse ${selectedConversation === otherNumber ? "show" : ""}`}
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

export default ConversationList;
