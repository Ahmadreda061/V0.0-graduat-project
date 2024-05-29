import axios from "axios"

export default function getRecommendation(userToken, count) {
    return new Promise((reslove, reject) => {
        axios.get(`https://localhost:7200/GetRecommendation?userToken=${userToken}&recommendationCount=${count}`)
        .then(res => reslove(res.data.elements))
    })
}