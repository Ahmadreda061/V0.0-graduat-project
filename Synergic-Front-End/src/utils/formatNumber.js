export default function formatNumber(inputValue)  {
    // Remove all non-numeric characters from the input value
    const numericValue = inputValue.replace(/\D/g, "");
    // Add spaces after every 4 characters
    const formattedNumber = numericValue.replace(/\d{4}(?=.)/g, "$& ");
    return formattedNumber;
  };