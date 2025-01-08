export function getDate(dateString) {
    return (new Date(dateString)).toLocaleString().slice(0, 10).replace(/\//g, "-")
}

export function areSameDate(date1, date2) {
    // Reset both dates to midnight
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    return d1.getTime() === d2.getTime(); // Compare the timestamps
};
