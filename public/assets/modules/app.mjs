import { User, getUsers, createUser } from "./user.mjs";
import { Setting, createSetting } from "./setting.mjs";
import { getSettings } from "./setting.mjs";

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


}

start();
