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

export async function currentNotificationPermission() {
  if (window.Notification) {
    let permission = Notification.permission;
    if (Notification.permission !== "granted") {
      return false;
    } else if (permission === "granted") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
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
        "Notification permission denied, please change your browser's Notification permission"
      );
    }
  } else {
    alert("Error: Notifications not supported");
  }
}

function handleNotificationOnClick() {
  window.focus();
}
