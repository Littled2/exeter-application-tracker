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
    currentDate.setHours(0, 0, 0, 0); // Normalize to midnight
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0); // Normalize to midnight
    
    // Calculate the difference in milliseconds
    const diffInMilliseconds = target - currentDate;
    
    // Convert milliseconds to days
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    if (diffInDays === 0) {
        return 'Today';
    } else if (diffInDays > 0) {
        return `in ${Math.ceil(diffInDays)} day${Math.ceil(diffInDays) > 1 ? 's' : ''}`;
    } else {
        return `${Math.abs(Math.floor(diffInDays))} day${Math.abs(Math.floor(diffInDays)) > 1 ? 's' : ''} ago`;
    }
}

