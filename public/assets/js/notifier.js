function displayNotification(message){
    
    if (!(self.Notification)) {
        console.log("Notificaion is not supported in bowser");
        return;
    }
    else{
      let permission = Notification.permission;
      if (Notification.permission !== "granted") {
          permission = await self.Notification.requestPermission();
      }
      if(permission === "granted"){
          new Notification(`${message}`);
      }
      else{
          console.log("notification permission denied");
      } 
    }
}
