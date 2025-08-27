export function convertToCurrency(number) {
  number = Math.abs(Math.round((number + Number.EPSILON) * 100) / 100);
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function currencyFind(currencyType) {
  switch (currencyType) {
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "BDT":
      return "৳";
    default:
      return "€";
  }
}

export function categoryIcon(groupCategory) {
  switch (groupCategory) {
    case "Home":
      return "ant-design:home-filled";
    case "Trip":
      return "ic:outline-flight";
    case "Office":
      return "mdi:office-building-marker";
    case "Sports":
      return "material-symbols:sports-cricket";
    case "Others":
      return "foundation:page-edit";
    default:
      return "ic:baseline-insert-page-break";
  }
}

export const monthNamesMMM = [
  "JAN",
  "FRB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
export function getMonthMMM(expDate) {
  const date = new Date(expDate);
  return monthNamesMMM[date.getMonth()];
}

export function formateDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
