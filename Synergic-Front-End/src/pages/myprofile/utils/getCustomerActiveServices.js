import axios from "axios";

export default function getCustomerActiveServices(userToken) {
    return new Promise((resolved, rejected) => {
        axios.get(`https://localhost:7200/api/Services/CustomerActiveServices?UserToken=${userToken}`)
            .then(res => resolved(res.data.elements))    
         

    })
}
