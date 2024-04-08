export default function baseToHex(base64String)  {
    const binaryString = window.atob(base64String);
    let hexResult = '';
    for (let i = 0; i < binaryString.length; i++) {
      const hex = binaryString.charCodeAt(i).toString(16);
      hexResult += (hex.length === 1 ? '0' : '') + hex;
    }
    return hexResult.toUpperCase();
  };