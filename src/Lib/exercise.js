import { getDB, DBVERSION } from "./IndexedDB/storage";

export const EXERCISE_STATES = {
    "PENDING" : "PENDING",
    "STARTED": "STARTED",
    "PAUSED": "PAUSED",
    "FINISHED": "FINISHED",
    "CANCELLED": "CANCELLED"
};

export class Exercise {
    constructor(id, name, startTime, endTime, tags, currentState, constants,
        variables,
        progress,
        createdOn,
        updatedOn,
        version
    ) {
        this.id = id;
        this.name = name;
        this.startTime = !startTime || startTime == null ? null : new Date(startTime);
        this.endTime = !endTime || endTime == null ? null : new Date(endTime);
        this.tags = tags;
        this.currentState = currentState;
        this.constants = constants;
        this.variables = variables;
        this.progress = progress;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        this.version = version;
    }

    isActive() {
        let retVal = false;
        let now = new Date();
        if (this.startTime <= now) {
            if (typeof this.currentState.exerciseState === "string") {
                if (this.currentState.exerciseState !== EXERCISE_STATES.FINISHED
                    && this.currentState.exerciseState !== EXERCISE_STATES.CANCELLED) {
                    retVal = true;
                }
            }
        }
        return retVal;
    }
}

/**
 * Creates and stores a Exercise object
 *
 * @param {Exercise} exercise An Exercise object to be stored
 *
 * @returns {Promise} Returns id of the exercise added on success
 */
export async function createExercise(exercise) {
    let db = await getDB();
    let now = new Date();

    //Set default state of the exercise
    let exerciseOb = {
        id: exercise.id,
        name: exercise.name,
        startTime: exercise.startTime,
        endTime: exercise.endTime,
        tags: exercise.tags,
        currentState: exercise.currentState,
        constants: exercise.constants,
        variables: exercise.variables,
        progress: exercise.progress,
        createdOn: now,
        updatedOn: now,
        version: DBVERSION
    };
    exerciseOb.currentState["exerciseState"] = EXERCISE_STATES.PENDING;

    let addResult = await db.exercises.add(exerciseOb);
    return addResult;
}


/**
 * Retrieve exercise objects from database.  Optionally filter from startTime
 *
 * @param {string} startTimeAfter The ISO timestamp after which the exercise can start or null if not required
 * @param {string} startTimeBefore The ISO timestamp before which the exercise can start or null if not required
 *
 * @returns {[Exercise]} Returns array of Exercise objects
 */
export async function getExercises(startTimeAfter, startTimeBefore) {
    let db = await getDB();
    let stA = (!startTimeAfter || startTimeAfter != null) ? new Date(startTimeAfter) : null;
    let stB = (!startTimeBefore || startTimeBefore != null) ? new Date(startTimeBefore) : null;
    let obs = await db.exercises.filter((ob) => {
        let retVal = true;
        if (stA != null) {
            if (new Date(ob.startTime) < stA) {
                retVal = false;
            }
        }

        if (stB != null) {
            if (new Date(ob.startTime) >= stB) {
                retVal = false;
            }
        }

        return retVal;
    }).toArray();

    let result = [];
    for (const o of obs) {
        let pOb = new Exercise(o.id,
            o.name,
            o.startTime,
            o.endTime,
            o.tags,
            o.currentState,
            o.constants,
            o.variables,
            o.progress,
            o.createdOn,
            o.updatedOn,
            o.version);
        result.push(pOb);
    }
    return result;
}

/**
 * Delete all Exercise objects from the database started before a timestamp
 *
 * @param {string} timestamp The ISO timestamp before the exercises have to be deleted
 *
 * @returns {boolean} Returns number of deleted records
 */
export async function deleteExerciseStartedBefore(timestamp) {
    let db = await getDB();
    if (!timestamp || timestamp == null || typeof timestamp !== "string") {
        return 0;
    }

    let upperLimit = new Date(timestamp);
    let delCount = await db.exercises.where("startTime").below(upperLimit).delete();
    return delCount;
}


/**
 * Updates an existing exercise object
 *
 * @returns {Promise} Returns id of the exercise on successful update
 */
export async function updateExercise(exercise) {
    let db = await getDB();
    let now = new Date();
    let result = await db.exercises.put({
        id: exercise.id,
        name: exercise.name,
        startTime: exercise.startTime,
        endTime: exercise.endTime,
        tags: exercise.tags,
        currentState: exercise.currentState,
        constants: exercise.constants,
        variables: exercise.variables,
        progress: exercise.progress,
        createdOn: exercise.createdOn,
        updatedOn: now,
        version: DBVERSION
    });
    return result;
}
