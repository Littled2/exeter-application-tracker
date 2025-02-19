import Dexie from 'dexie';

export const indexDB = new Dexie('myDatabase');

indexDB.version(1).stores({
    applications: '++id, role, stage, deadline, info, locations, expand, organisation, deadlineType'
});