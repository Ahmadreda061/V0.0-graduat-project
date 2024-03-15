export default function handlePassRepat(password, passwordR) {
    if (!passwordR) return "Reqierd"
    else if (password !== passwordR) return "Not the same password"
    
}