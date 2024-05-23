import axios from "axios";

export default function sendMsg(userToken, roomID, message) {
    return new Promise((resolved, rejected) => {
        axios.post(`https://localhost:7200/api/Chat/SendMessageAsync?userToken=${userToken}&roomID=${roomID}&message=${message}`)
        .then(res => res.data)
        .then(data => resolved(data.statusCode === 0) )

    })
}