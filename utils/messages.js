// Get the time in hours and minutes displaying AM or PM
function getTime() {
  const today = new Date();
  let hour = today.getHours();
  let minute = today.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  } else if (hour < 10) {
    hour = `0${hour}`;
  }
  if (hour > 12) {
    return `${hour - 12}:${minute} PM`;
  }
  return `${hour}:${minute} AM`;
}

function formatMessage(username, text, file) {
  return {
    username,
    text,
    file,
    time: getTime(),
  };
}

module.exports = formatMessage;
