import axios from "axios";

export default function getUserNotfications() {
    return new Promise((resolve, reject) => {
        axios
        .get(
          `https://localhost:7200/api/Notifications/GetNotifications?userToken=1FF2158B94FF69F0C1EF23B886A3A07DB95D97AA6C57D6A1AB4B3EE5566ED578`
        )
        .then((res) => res.data)
        .then((data) => {
            console.log(data.notifications[0])
        }); })
       
      
}

