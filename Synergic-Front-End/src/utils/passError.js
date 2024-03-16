export default function handlePassword(password) {
    if (!password) return "Reqierd"
    else if (password.length < 8) return "Password must be more than 8 char's"
    
}