import { getDB, DBVERSION } from "./storage.mjs";

export class Setting {
    constructor(id, name, value, createdOn, updatedOn, version) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        this.version = version;
    }
}

/**
 * Creates and stores a Setting object
 * 
 * @param {Setting} setting A Setting object to be stored
 * 
 * @returns {Promise} Returns id of the setting added on success
 */
export async function createSetting(setting) {
    let db = await getDB();
    let now = new Date();
    let addResult = await db.settings.add({
        id: setting.id,
        name: setting.name,
        value: setting.value,
        createdOn: now,
        updatedOn: now,
        version: DBVERSION
    });
    return addResult;
}

/**
 * Update a Setting object
 * 
 * @param {string} id An id of the Setting object to be updated
 * @param {Setting} setting the updated setting object which will replace old settings
 * 
 * @returns {Promise} Returns id of the setting on successful update
 */
export async function updateSetting(setting) {
    let db = await getDB();
    let now = new Date();
    let addResult = await db.settings.put({
        id: setting.id,
        name: setting.name,
        value: setting.value,
        createdOn: setting.createdOn,
        updatedOn: now,
        version: DBVERSION
    }, setting.id);
    return addResult;
}

/**
 * get list of stored Setting objects
 * 
 * @returns {[Setting]} An array of Setting objects
 */
export async function getSettings() {
    let db = await getDB();
    const settings = await db.settings.toArray();
    let result = [];
    for (const ob of settings) {
        let preparedOb = new Setting(ob.id, ob.name, ob.value, ob.createdOn, ob.updatedOn, ob.version);
        result.push(preparedOb);
    }
    return result
}

