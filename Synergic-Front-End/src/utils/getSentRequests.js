import axios from "axios";

export default function getSentRequests(userToken) {
    return new Promise((resolved, rejected) => {
        axios.get(`https://localhost:7200/api/Services/SentRequests?UserToken=${userToken}`)
            .then(res => {
                resolved(res.data.elements)
            })    
         

    })
}