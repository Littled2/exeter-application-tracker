import Dexie from 'dexie';

export const indexDB = new Dexie('myDatabase');

indexDB.version(1).stores({
    applications: '++id, role, info, stage, organisation, type, locations, deadline, deadlineType, user, year, cv, coverLetter, link, created, updated'
});