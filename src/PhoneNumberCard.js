import React, { useState, useEffect } from "react";
import { fetchConversations } from "./api";
import ConversationList from "./ConversationList";
import ConversationView from "./ConversationView";
import NewMessageForm from "./NewMessageForm";

const PhoneNumberCard = ({ phoneNumber, accountSid, authToken }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const convos = await fetchConversations(accountSid, authToken, phoneNumber);
    setConversations(convos);
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>{phoneNumber}</h3>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <ConversationList
              conversations={conversations}
              setSelectedConversation={setSelectedConversation}
            />
          </div>
          <div className="col-md-8">
            {selectedConversation && (
              <ConversationView
                conversation={selectedConversation}
                phoneNumber={phoneNumber}
                accountSid={accountSid}
                authToken={authToken}
                refreshConversations={loadConversations}
              />
            )}
          </div>
        </div>
        <NewMessageForm
          phoneNumber={phoneNumber}
          accountSid={accountSid}
          authToken={authToken}
          refreshConversations={loadConversations}
        />
      </div>
    </div>
  );
};

export default PhoneNumberCard;
