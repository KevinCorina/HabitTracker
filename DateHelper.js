let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function toIsoDate(date) {
    //https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    return `${date.getFullYear()}-${zeroPad(date.getMonth()+1,2)}-${zeroPad(date.getDate(),2)}`;
}

function fromIsoDate(iso) {
  let date = new Date();
  let isoSplit = iso.split('-');
  date.setFullYear(parseInt(isoSplit[0]));
  date.setMonth(parseInt(isoSplit[1]-1));
  date.setDate(parseInt(isoSplit[2]));  
  return date;
}
function firstDayOfWeek(startDate) {
  let first = new Date(startDate);
  while(first.getDay()!=1) {
    first.setDate(first.getDate() - 1);
  }
  return first;
}
  
function firstDayOfMonth(startDate) {
  let first = new Date(startDate)
  while(first.getDate()!=1) {
    first.setDate(first.getDate() - 1);
  }
  return first;
}

function lastWeek(date) {
  let weekBack = new Date(date);
  weekBack = weekBack.setDate(weekBack.getDate() - 7);
  return weekBack;
}

function lastMonth(date) {
  let monthBack = new Date(date)
  monthBack = new Date(monthBack.getFullYear(), monthBack.getMonth()-1, 1);
  return monthBack;
}
  
function nextWeek(date) {
  let weekForward = new Date(date);
  weekForward = weekForward.setDate(weekForward.getDate() + 7);
  return weekForward;
}
  
function nextMonth(date) {
  let monthForward = new Date(date);
  monthForward = new Date(monthForward.getFullYear(), monthForward.getMonth()+1, 1);
  return monthForward;
}

function isToday(date) {
  let today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}
export {days, toIsoDate, fromIsoDate, firstDayOfWeek, firstDayOfMonth, lastWeek, lastMonth, nextWeek, nextMonth, isToday};
