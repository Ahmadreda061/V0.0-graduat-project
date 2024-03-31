import axios from "axios";
export default function postUserToDB(postData, setErrors) {
    return new Promise((resolve, reject) => {
        axios
        .post(
          "https://localhost:7200/api/UserAuthentication/Register",
          postData
        )
        .then((res) => {
          const data = res.data;
          if (data.statusCode === 0) {
              // succussfuly registered
            resolve(true)
            return true 
          } else if (data.statusCode === 2) {
            // userName or email is used
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: data.statusMessage,
              username: data.statusMessage,
            }));
            reject(data.statusMessage);

          } else if (data.statusCode === 3) {
            // Incorect email form
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: data.statusMessage,
            }));
            reject(data.statusMessage);

          }
        })
        .catch((err) => {
            console.error(err);
            reject(err.message || 'An error occurred while processing your request.');
        });
    })
}