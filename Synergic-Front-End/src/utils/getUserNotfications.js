import axios from "axios";

export default function getUserNotfications(userToken) {
    return new Promise((resolve, reject) => {
        axios
        .get(
          `https://localhost:7200/api/Notifications/GetNotifications?userToken=${userToken}`
        )
        .then((res) => res.data)
        .then((data) => {
            resolve(data.notifications)
        }); })
       
      
}

