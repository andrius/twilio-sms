// src/notifications.js

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return false;
  }

  let permission = Notification.permission;

  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  return permission === "granted";
};

export const sendNotification = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
};
