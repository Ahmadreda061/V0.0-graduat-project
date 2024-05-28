import axios from "axios";

export default function deleteServiceReq(userToken, serviceID) {
    return new Promise((resolved, rejected) => {
        console.log(`https://localhost:7200/api/Services/DeleteServiceRequest?userToken=${userToken}&ServiceID=${serviceID}`)
    axios.delete(`https://localhost:7200/api/Services/DeleteServiceRequest?userToken=${userToken}&ServiceID=${serviceID}`)
    .then(() => resolved(true)) // it's not requsted any more
    }       
)   
}