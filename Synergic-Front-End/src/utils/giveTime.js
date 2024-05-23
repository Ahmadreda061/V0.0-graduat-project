export default function giveTime(time) {
    if (time) {
        const index = time.indexOf("T");
        const editTime = time.substring(index + 1, index + 6);
        return editTime
    }
    
}