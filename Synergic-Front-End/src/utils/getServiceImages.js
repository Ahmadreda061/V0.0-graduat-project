import axios from "axios";

export default function getServiceImages(serviceID) {
    return new Promise((resolved, rejected) => {
        axios.get(`https://localhost:7200/api/Services/GetServiceImages?ServiceID=${serviceID}`)
            .then(res => {
                // console.log(res.data.images)
                resolved(res.data.images)
            })

    })
}