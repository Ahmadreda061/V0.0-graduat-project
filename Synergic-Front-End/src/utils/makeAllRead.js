import setNotficationRead from "./setNotficationRead";

export default  function makeAllRead(userToken, notfications) {
    notfications.forEach((notfication) => {
      if (!notfications.isRead)
        setNotficationRead(userToken, notfication.notificationID);
    });
  }