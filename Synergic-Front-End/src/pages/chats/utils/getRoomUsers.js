import axios from "axios";

export default function getRoomUsers(roomID) {
    return new Promise((resolved, rejected) => {
        axios.post(`https://localhost:7200/api/Chat/GetRoomUsersAsync?roomID=${roomID}`)
            .then(res => resolved(res.data.users))
         

    })
}