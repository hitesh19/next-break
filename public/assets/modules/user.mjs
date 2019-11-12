import { getDB, DBVERSION } from "./storage.mjs";

export class User {
    constructor(id, nickname, logoid, createdOn, updatedOn, version) {
        this.id = id;
        this.nickname = nickname;
        this.logoid = logoid;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        this.version = version;
    }
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
