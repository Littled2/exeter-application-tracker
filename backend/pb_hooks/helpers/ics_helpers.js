/// <reference path="../../pb_data/types.d.ts" />


/**
 * Format a Date (or date string/number) into 'YYYYMMDD'
 * @param {Date|string|number} dateInput – date-string
 * @returns {string} – formatted as e.g. '20250614'
 */
function formatYYYYMMDD(dateInput) {
    const d = new Date(dateInput)
    const year = d.getFullYear().toString()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    return year + month + day
}

function formatDateForICal(dateInput) {
    const date = new Date(dateInput)
    const year = date.getUTCFullYear().toString().padStart(4, '0')
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    const day = date.getUTCDate().toString().padStart(2, '0')
    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minutes = date.getUTCMinutes().toString().padStart(2, '0')
    const seconds = date.getUTCSeconds().toString().padStart(2, '0')

    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}


/**
 * Escape and fold a TEXT property (e.g. SUMMARY/DESCRIPTION)
 * according to RFC 5545—escape \ ; , newline, then fold at ≤75 UTF-8 bytes.
 *
 * @param {string} raw – raw text
 * @param {number} [maxBytes=75]
 * @param {string} propName – e.g. "SUMMARY", "DESCRIPTION"
 * @returns {string} – ready for insertion into ICS
 */
function icsEscapeAndFold(raw, maxBytes = 75, propName = 'SUMMARY') {
    // 1️⃣ Escape special characters
    const s = raw
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\r\n|\r|\n/g, '\\n')

    // 2️⃣ Function to count UTF-8 bytes using legacy method
    function utf8ByteLength(str) {
        // Convert to percent-encoded UTF-8, then convert each %xx into one byte
        return unescape(encodeURIComponent(str)).length
    }

    const prefix = propName + ':'
    const lines = []
    let current = prefix

    // 3️⃣ Append characters one by one, folding if exceeds byte limit
    for (const char of s) {
        const next = current + char
        if (utf8ByteLength(next) > maxBytes) {
        lines.push(current)
            current = ' ' + char // continuation line must start with space
        } else {
            current = next
        }
    }
    lines.push(current)
    return lines.join('\r\n')
}



function generateICSForApplications(apps) {

    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Exeter Application Tracker//Application Deadlines//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nREFRESH-INTERVAL;VALUE=DURATION:PT1H\n`

    apps.forEach(app => {

        const deadline = formatDateForICal(app.deadline)

        icsContent += "\nBEGIN:VEVENT"
        icsContent += `\n${icsEscapeAndFold(app.id, 75, "UID")}`
        icsContent += `\n${icsEscapeAndFold(app.organisation + " deadline for " + app.role, 75, "SUMMARY")}`
        // icsContent += `\n${icsEscapeAndFold("Event from Exeter Application Tracker \n\n" + app.info, 75, "DESCRIPTION")}`
        icsContent += `\nDTSTAMP:${deadline}`
        icsContent += `\nDTSTART;VALUE=DATE:${formatYYYYMMDD(app.deadline)}`
        icsContent += `\nDTEND;VALUE=DATE:${formatYYYYMMDD(app.deadline)}`
        icsContent += `\nCOLOR:orange`

        icsContent += `\n\nBEGIN:VALARM`
        icsContent += `\nTRIGGER:-P1D`
        icsContent += `\nACTION:DISPLAY`
        icsContent += `\n${icsEscapeAndFold(`Application to ${app?.organisation} due tomorrow!`, 75,  "DESCRIPTION")}`
        icsContent += `\nEND:VALARM`

        icsContent += `\n\nEND:VEVENT\n`
    })

    icsContent += '\nEND:VCALENDAR';

    return icsContent;
}


module.exports = { formatYYYYMMDD, formatDateForICal, icsEscapeAndFold, generateICSForApplications }