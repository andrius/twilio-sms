// src/hooks/useConversations.js

import { useState, useEffect, useCallback } from "react";
import { fetchConversations } from "../services/api";
import { showNotification } from "../services/notifications";
import { useAuthContext } from "../contexts/AuthContext";

const PULL_INTERVAL = process.env.REACT_APP_PULL_INTERVAL || 5000;

export const useConversations = () => {
  const { isAuthenticated, phoneNumbers, accountSid, authToken } =
    useAuthContext();
  const [allConversations, setAllConversations] = useState({});
  const [lastNotificationTimes, setLastNotificationTimes] = useState({});

  const fetchAllConversations = useCallback(async () => {
    if (!isAuthenticated) return;

    const newConversations = {};
    const newLastNotificationTimes = { ...lastNotificationTimes };

    for (const phoneNumber of phoneNumbers) {
      try {
        const conversations = await fetchConversations(
          accountSid,
          authToken,
          phoneNumber,
        );
        console.log(`Fetched conversations for ${phoneNumber}:`, conversations); // Debugging line
        newConversations[phoneNumber] = conversations;

        if (conversations.length > 0 && conversations[0][1].length > 0) {
          const latestMessage = conversations[0][1][0];
          const messageTime = new Date(latestMessage.date_sent).getTime();
          const lastNotificationTime =
            newLastNotificationTimes[phoneNumber] || 0;

          if (
            messageTime > lastNotificationTime &&
            latestMessage.from !== phoneNumber
          ) {
            showNotification(
              "New Message",
              `From: ${latestMessage.from}\n${latestMessage.body.substring(0, 50)}...`,
            );
            newLastNotificationTimes[phoneNumber] = messageTime;
          }
        }
      } catch (error) {
        console.error(
          `Error fetching conversations for ${phoneNumber}:`,
          error,
        );
      }
    }

    setAllConversations(newConversations);
    setLastNotificationTimes(newLastNotificationTimes);
  }, [
    isAuthenticated,
    phoneNumbers,
    accountSid,
    authToken,
    lastNotificationTimes,
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllConversations();
      const intervalId = setInterval(fetchAllConversations, PULL_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, fetchAllConversations]);

  return allConversations;
};
