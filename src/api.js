// api.js

import axios from "axios";

const createClient = (accountSid, authToken) => {
  return axios.create({
    baseURL: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}`,
    auth: {
      username: accountSid,
      password: authToken,
    },
  });
};

export const loginToTwilio = async (accountSid, authToken) => {
  const client = createClient(accountSid, authToken);
  await client.get("/");
};

export const fetchPhoneNumbers = async (accountSid, authToken) => {
  const client = createClient(accountSid, authToken);
  const response = await client.get("/IncomingPhoneNumbers.json");
  return response.data.incoming_phone_numbers
    .filter((number) => number.capabilities.sms)
    .map((number) => number.phone_number);
};

export const fetchConversations = async (
  accountSid,
  authToken,
  phoneNumber
) => {
  const client = createClient(accountSid, authToken);
  try {
    console.log(`Fetching conversations for ${phoneNumber}`);
    const response = await client.get("/Messages.json", {
      params: {
        PageSize: 1000,
      },
    });
    console.log(`Received ${response.data.messages.length} messages`);

    const messages = response.data.messages.filter(
      (message) => message.from === phoneNumber || message.to === phoneNumber
    );
    console.log(`Filtered to ${messages.length} messages for ${phoneNumber}`);

    const groupedConversations = messages.reduce((acc, message) => {
      const key = message.from === phoneNumber ? message.to : message.from;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(message);
      return acc;
    }, {});

    const sortedConversations = Object.entries(groupedConversations).sort(
      (a, b) => new Date(b[1][0].date_sent) - new Date(a[1][0].date_sent)
    );

    console.log(`Grouped into ${sortedConversations.length} conversations`);
    return sortedConversations;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

const formatPhoneNumber = (phoneNumber) => {
  // Remove any non-digit characters
  const digits = phoneNumber.replace(/\D/g, "");

  // Ensure the number starts with a '+'
  return digits.startsWith("+") ? digits : `+${digits}`;
};

export const sendMessage = async (accountSid, authToken, from, to, body) => {
  const formattedTo = formatPhoneNumber(to);
  const formattedFrom = formatPhoneNumber(from);

  if (!formattedTo) {
    throw new Error("'To' phone number is required.");
  }

  const client = createClient(accountSid, authToken);
  try {
    const data = new URLSearchParams();
    data.append("To", formattedTo);
    data.append("From", formattedFrom);
    data.append("Body", body);

    console.log("Sending data to Twilio:", Object.fromEntries(data));

    const response = await client.post("/Messages.json", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log("Message sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
