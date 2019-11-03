import { getDB, DBVERSION } from "./storage.mjs";

export class Plan {
    constructor(id, name, startTime, constants, variables, createdOn, updatedOn, version) {
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.constants = constants;
        this.variables = variables;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        this.version = version;
    }
}

/**
 * Creates and stores a Plan object
 * 
 * @param {Plan} plan A Plan object to be stored
 * 
 * @returns {Promise} Returns id of the plan added on success
 */
export async function createPlan(plan) {
    let db = await getDB();
    let now = new Date();
    let addResult = await db.plans.add({
        id: plan.id,
        name: plan.name,
        startTime: plan.startTime,
        constants: plan.constants,
        variables: plan.variables,
        createdOn: now,
        updatedOn: now,
        version: DBVERSION
    });
    return addResult;
}

/**
 * Deletes a Plan object from the database
 * 
 * @param {string} id The id of the plan to be deleted
 * 
 * @returns {boolean} Returns true if the Plan object is deleted
 */
export async function deletePlan(id) {
    let db = await getDB();
    await db.plans.delete(id);
    return true;
}


/**
 * get list of stored Plan objects
 * 
 * @returns {[Plan]} An array of Plan objects
 */
export async function getPlans() {
    let db = await getDB();
    const obs = await db.plans.toArray();
    let result = [];
    for (const o of obs) {
        let pOb = new Plan(o.id, o.name, o.startTime, o.constants, o.variables, o.createdOn, o.updatedOn, o.version);
        result.push(pOb);
    }
    return result
} 
