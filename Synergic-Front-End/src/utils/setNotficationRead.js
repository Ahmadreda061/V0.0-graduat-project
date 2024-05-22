import axios from "axios";

export default function setNotficationRead(userToken, notificationId) {
        axios
            .get(
                `https://localhost:7200/api/Notifications/MarkNotificationAsRead?userToken=${userToken}&notificationID=${notificationId}`
            )}  


