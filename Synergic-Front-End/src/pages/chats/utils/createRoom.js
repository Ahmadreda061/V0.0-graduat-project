import axios from "axios"

export default function createRoom(userToken, otherUsername, roomName) {
    axios.post("https://localhost:7200/api/Chat/CreateRoom", { userToken, otherUsername, roomName })
        .then(res => console.log(res))
}