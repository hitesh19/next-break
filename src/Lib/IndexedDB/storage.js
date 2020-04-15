import Dexie from "dexie";

const DBNAME = "nbDB";
export const DBVERSION = 1;

const ERRORS = {
    NODB: "Indexed DB not available",
    OPENERROR: "Unable to open Indexed DB",
    UNKNOWN: "Unknown error"
}

let db = undefined;

/**
 * Returns true if IndexedDB feature  is implemented in the browser
 */
function checkDB() {
    if (!window.indexedDB) {
        console.error("IndexedDB not available");
        return false;
    } else {
        return true;
    }
}

/**
 * @Returns {Promise} Returns an instance of Dexie.js database
 */
export async function getDB() {

    return new Promise((resolve, reject) => {
        if (!checkDB()) {
            return reject(ERRORS.NODB);
        }

        //Check if already initialized
        if (!db) {
            db = new Dexie(DBNAME);
            // Declare tables, IDs and indexes
            db.version(DBVERSION).stores({
                users: 'id, nickname, logoid, createdOn, updatedOn, version',
                settings: 'id, name, value, createdOn, updatedOn, version',
                plans: 'id, name, startTime, constants, variables, createdOn, updatedOn, version',
                exercises: 'id, name, startTime, endTime, tags, currentState, constants, variables, progress, createdOn, updatedOn, version'
            });
        }

        //Try to open the database, if not yet open
        if (db.isOpen() !== true) {
            db.open().catch(function (err) {
                return reject(ERRORS.OPENERROR)
            });
        }

        return resolve(db);

    })
}
