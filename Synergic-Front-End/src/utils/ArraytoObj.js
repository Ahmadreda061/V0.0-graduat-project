export default function arrayToObj(arr, key, value="") {
    /*the array of objects  each obj have keys so
     the function take key that must be in the objects and value to put it in the key
      arr =  [
    { name: "email", type: "text", label: "Email" },{name: "id", type: "text", label: "id" }
     ]
     arrayToObj(arr, name, "")
    
     return {email:"", id:"" }
     */
    return arr.reduce((acc, field) => {
        acc[field[key]] = value;
        return acc;
      }, {});
    
}