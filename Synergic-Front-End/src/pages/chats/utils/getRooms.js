import axios from "axios";

export default function getRooms(userToken) {
    return new Promise((resolved, rejected) => {
        axios.get(`https://localhost:7200/api/Chat/GetRoomsAsync?userToken=${userToken}`)
            .then(res => res.data)
            .then(data => { 
                if (data.rooms) {
                    resolved(data.rooms.reverse())
                }
            })

    })
}