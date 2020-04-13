import { User, getUsers, createUser } from "./user.mjs";
import { Setting, createSetting, getSettings } from "./setting.mjs";
import {
    Exercise,
    createExercise,
    getExercises,
    deleteExerciseStartedBefore,
    updateExercise
} from "./exercise.mjs";

let start = async function () {

    // Retrieve list of users to see if the user is already initiated
    let users = await getUsers();
    if (users && users.length > 0) {
        alert("Welcome back: " + users[0].nickname);
        console.log("Users : ", users);
    } else {
        // Create new user if app is not yet initiated
        const name = "Random User 001";
        let newUserOb = new User(name, name, "logo-001");
        let addRes = await createUser(newUserOb)
        alert("Welcome : " + addRes)
    }


    // Create new setting if not yet created
    let allSettings = await getSettings();
    if (allSettings && allSettings.length > 0) {
        alert("Found " + allSettings.length + " existing settings");
        console.log("Settings : ", allSettings);

    } else {
        let newSetting = new Setting("sid1",
            "interval",
            { "label": "Exercise interval", "duration": 30 });
        let addSetRes = await createSetting(newSetting);
        alert("New setting created: " + addSetRes);
    }

    // Create new exercise if not yet created
    let allExercises = await getExercises(null, new Date().toISOString());
    if (allExercises && allExercises.length > 0) {
        alert("Found " + allExercises.length + " existing exercises");
        console.log("Exercises : ", allExercises);

        let selectedExercise = Object.assign({}, allExercises[0]);
        selectedExercise.currentState = "IN-PROGRESS";
        selectedExercise.progress = 1;
        let updatedId = await updateExercise(selectedExercise)
        alert("Updated Id : " + updatedId)
        alert("Deletion of exercise queued in 30 seconds");

        setTimeout(async () => {
            let delRes = await deleteExerciseStartedBefore(new Date().toISOString());
            alert("No. of Exercises deleted : " + delRes);
        }, 30000);
    } else {
        let newExercise = new Exercise("exc-1", "exc-1",
            new Date(new Date().getTime() + 10000).toISOString(),
            null,
            ["neck"],
            "PENDING",
            { setsRequired: 10,
                recommendedInterval:2  },
            { setsCompleted: 0 },
            0);
        let addRes = await createExercise(newExercise);
        alert("New Exercise created: " + addRes);
    }
}

start();