import { User, getUsers, createUser } from "./user.mjs";
import { Setting, createSetting, getSettings } from "./setting.mjs";
import { Plan, getPlans, createPlan } from "./plan.mjs";
import { deletePlan } from "./plan.mjs";

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
        let newSetting = new Setting("sid1", "interval", { "label": "Exercise interval", "duration": 30 });
        let addSetRes = await createSetting(newSetting);
        alert("New setting created: " + addSetRes);
    }

    // Create new plan if not yet created
    let allPlans = await getPlans();
    if (allPlans && allPlans.length > 0) {
        alert("Found " + allPlans.length + " existing plans");
        console.log("Plans : ", allPlans);
        
        let delRes = await deletePlan("neck-exercise-1");
        alert("Plan delete result : " + delRes);
    } else {
        let newPlan = new Plan("neck-exercise-1", "neck-exercise-1", new Date()+10000,{ setsRequired: 10 }, {setsCompleted: 0 });
        let addPlanRes = await createPlan(newPlan);
        alert("New Plan created: " + addPlanRes);
    }


}

start();
