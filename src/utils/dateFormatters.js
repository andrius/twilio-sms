// src/utils/dateFormatters.js
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// src/utils/phoneNumberFormatter.js
export const formatPhoneNumber = (phoneNumber) => {
  const digits = phoneNumber.replace(/\D/g, "");
  return digits.startsWith("+") ? digits : `+${digits}`;
};
