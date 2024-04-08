export default function validateForm(formData, passCheck = true) {
    const requiredFields = Object.keys(formData) // convert the object to array of keys
    const optionalFields = ["insta", "facebook", "linkedIn"];
    const newErrors = {}
    // Validate required fields
    requiredFields.forEach((field) => {
        if (!formData[field] && !optionalFields.includes(field)) {
        newErrors[field] = "*Required";
    }
    });
    if (passCheck) {
        const passError =
        formData.password.length < 8 ? "Password must be more than 8 char's" : "";
        if (passError) newErrors.password = passError;
    }
    return newErrors
}