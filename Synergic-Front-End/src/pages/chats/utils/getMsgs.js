import axios from "axios";

export default function getMsgs(userToken, chatID) {
  return new Promise((resolve, reject) => {
    axios.post(
      `https://localhost:7200/api/Chat/GetMessagesAsync?userToken=${userToken}&roomID=${chatID}`, 
      [], // This is the request body
      {
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json'
        }
      }
    )
    .then(res => resolve(res.data.messages))
    .catch(err => reject(err));
  });
}
