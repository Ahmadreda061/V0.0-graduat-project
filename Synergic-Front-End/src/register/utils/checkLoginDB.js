import axios from "axios";
export default function checkLoginDB(postData, setErrors) {
    return new Promise((resolve, reject) => {
        axios
        .post("https://localhost:7200/api/UserAuthentication/Login", postData)
        .then((res) => {
            const data = res.data;
            if (data.statusCode === 0) {
                // succussfuly Log in
                localStorage.setItem("Key", data.username);
                resolve(true)
                // setTimeout(() => handleRegisterOverlay(), 300);
                // window.location.reload();
            }
            else if (data.statusCode === 6) {
                // The account not found for login
                setErrors((prevErrors) => ({
                ...prevErrors,
                email_or_Username: data.statusMessage,
                }));
                reject(data.statusMessage)
            }
            else if (data.statusCode === 5) {
                // Password_Incorrect
                setErrors((prevErrors) => ({
                ...prevErrors,
                password: data.statusMessage,
                }));
                reject(data.statusMessage)

        }
        });
    })
}