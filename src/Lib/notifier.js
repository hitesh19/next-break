export async function displayNotification(message) {
  if (!window.Notification) {
    console.error("Notificaion is not supported in bowser");
    return;
  } else {
    let permission = Notification.permission;
    let notification;
    if (Notification.permission !== "granted") {
      permission = await window.Notification.requestPermission();
    }
    if (permission === "granted") {
      notification = new Notification(`${message}`);
      notification.onclick = handleNotificationOnClick;
    } else {
      console.error("Notification permission denied");
    }
  }
}

export async function requestNotificationPermission() {
  if (window.Notification) {
    let permission = Notification.permission;
    if (Notification.permission !== "granted") {
      permission = await window.Notification.requestPermission();
    }
    if (permission === "granted") {
      new Notification("Notification permission granted");
    } else {
      alert(
        "Notification permission denied, you will not receive notifications"
      );
    }
  } else {
    alert("Error: Notifications not supported");
  }
}

function handleNotificationOnClick() {
  window.focus();
}
