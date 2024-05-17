import axios from "axios";
export default function sendServiceReq(UT, ServiceID, comment) {
    return new Promise((resolve, reject) => {
        axios
        .get(`https://localhost:7200/api/Services/RequestService?userToken=${UT}&ServiceID=${ServiceID}&AdditionalComment=${comment}`)
        .then((res) => {
            if (res.data.statusCode === 0) {
                resolve(true)
            }
        });
    })
}