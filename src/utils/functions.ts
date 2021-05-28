export function GetTodayDateString() {
  let today = new Date();
  return `${today.getMonth()}/${today.getDate()}/${today.getFullYear()}`;
}
export function ParseDateToUS(date: string) {
  if (!date) return null;
  let arr = date.split("/");
  return `${arr[1]}/${arr[0]}/${arr[2]}`;
}
