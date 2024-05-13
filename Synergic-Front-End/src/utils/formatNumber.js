export default function formatNumber(inputValue)  {
    const numericValue = inputValue.replace(/\D/g, "");
    const formattedNumber = numericValue.replace(/\d{4}(?=.)/g, "$& ");
    return formattedNumber;
  };