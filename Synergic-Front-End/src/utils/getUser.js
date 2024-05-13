import axios from "axios";
export default function getUser(userToken) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                `https://localhost:7200/api/Accounts/GetProfile?UserToken=${userToken}`
            )
            .then((res) => res.data)
            .then((data) => {

                const { statusCode, statusMessage, ...savedData } = data;
                resolve( savedData)
            });
    })
}

