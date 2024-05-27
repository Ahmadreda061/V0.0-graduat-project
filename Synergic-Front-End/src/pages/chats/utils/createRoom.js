import axios from "axios"

export default function createRoom(userToken, otherUsername, roomName, location="/chats") {
    return new Promise((resolve, reject) => {
        axios.post(`https://localhost:7200/api/Chat/CreateRoom?userToken=${userToken}&otherUsername=${otherUsername}&roomName=${roomName}`)
            .then(res => resolve(location))

    })
        
}