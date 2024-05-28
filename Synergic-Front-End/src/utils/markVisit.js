import axios from "axios";

export default function markVisit(userToken, category) {
    return new Promise((resolved, rejected) => {
        axios.get(`https://localhost:7200/MarkVisit?userToken=${userToken}&categoryVisited=${category}`)
            .then(res => console.log(res))    
         

    })
}