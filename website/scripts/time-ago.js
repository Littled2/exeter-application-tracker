function timeAgo(date) {
    const today = new Date();
    
    // Reset the time for today and the input date to compare just the date part
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);
    
    // Calculate the difference in time (in milliseconds)
    const difference = today - inputDate;
    
    // Convert the difference into days
    const daysAgo = Math.floor(difference / (1000 * 60 * 60 * 24));
    
    // Determine how long ago the date was
    if (daysAgo === 0) {
      return "Today";
    } else if (daysAgo === 1) {
      return "Yesterday";
    } else {
      return `${daysAgo} days ago`;
    }
}

function timeAgoLabel(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
  };

  for (const [key, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval >= 1) {
          return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
      }
  }
  return "just now";
}
