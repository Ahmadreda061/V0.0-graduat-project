import axios from "axios";
export default function setProfile(postData, setErrors) {
    axios
        .post("https://localhost:7200/api/Accounts/SetProfile", postData)
        .then((res) => res.data)
        .then((data) => {
            console.log(data)
            if (data.statusCode === 0) {
                
                // Successfuly State 😍
                // if the userName edit i will set the local storge wating the Back End
                window.location.reload();

            }
            else if (data.statusCode === 2) {
                //  email is already used !!! Now state code 2 represent username and email and this will change😑
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: data.statusMessage,
                }));
            }
            else if (data.statusCode === 3) {
                //  email bad form😑
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: data.statusMessage,
                }));
            }

        });
}