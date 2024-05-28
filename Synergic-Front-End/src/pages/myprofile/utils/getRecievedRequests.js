import axios from "axios";

export default function getRecievedRequests(userToken) {
    return new Promise((resolved, rejected) => {
        axios.get(`https://localhost:7200/api/Services/RecievedRequests?UserToken=${userToken}`)
            .then(res => resolved(res.data.elements))    
        // .then(res => resolved(res.data.users))
         

    })
}