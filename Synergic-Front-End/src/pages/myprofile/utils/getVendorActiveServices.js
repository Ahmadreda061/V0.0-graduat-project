import axios from "axios";

export default function getVendorActiveServices(userToken) {
    return new Promise((resolved, rejected) => {
        axios.get(`https://localhost:7200/api/Services/VendorActiveServices?UserToken=${userToken}`)
            .then(res => resolved(res.data.elements))    
         

    })
}