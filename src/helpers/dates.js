export function getDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '')
    // return (new Date(dateString)).toLocaleString().slice(0, 10).replace(/\//g, "-")
}

export function areSameDate(date1, date2) {
    // Reset both dates to midnight
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    return d1.getTime() === d2.getTime(); // Compare the timestamps
};

export function daysToDate(targetDate) {
    const currentDate = new Date();
    const target = new Date(targetDate);
    
    // Calculate the difference in milliseconds
    const diffInMilliseconds = target - currentDate;
    
    // Convert milliseconds to days
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    
    return diffInDays === 1 ? 'Today' : `${diffInDays} day${diffInDays > 1 ? 's' : '' }`;
}