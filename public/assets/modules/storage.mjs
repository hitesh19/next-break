import { User } from "./models/user.mjs";

const DBNAME = "nbDB";
const DBVERSION = 1;

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
        console.error();
        return false;
    } else {
        return true;
    }
}

/**
 * @Returns {Promise} Returns an instance of Dexie.js database
 */
async function getDB() {

    return new Promise((resolve, reject) => {
        if (!checkDB()) {
            return reject(ERRORS.NODB);
        }

        //Check if already initialized
        if (!db) {
            db = new Dexie(DBNAME);
            // Declare tables, IDs and indexes
            db.version(DBVERSION).stores({
                users: 'id, nickname, logoid, createdOn, updatedOn, version'
            });
        }

        //Try to open the database, if not yet open
        if (db.isOpen() !== true) {
            db.open().catch(function (err) {
                return reject(OPENERROR)
            });
        }

        return resolve(db);

    })
}

/**
 * Creates and stores a User object
 * 
 * @param {User} user A User object to be stored
 * 
 * @returns {Promise} Returns id of the user added on success
 */
export async function createUser(user) {
    let db = await getDB();
    let now = new Date();
    let addResult = await db.users.add({
        id: user.id,
        nickname: user.nickname,
        logoid: user.logoid,
        createdOn: now,
        updatedOn: now,
        version: DBVERSION
    });
    return addResult;
}

/**
 * get list of stored User objects
 * 
 * @returns {[User]} An array of User objects
 */
export async function getUsers() {
    let db = await getDB();
    const users = await db.users.toArray();
    let result = [];
    for (const u of users) {
        let uOb = new User(u.id, u.nickname, u.logoid, u.createdOn, u.updatedOn, u.version);
        result.push(uOb);
    }
    return result
} 
