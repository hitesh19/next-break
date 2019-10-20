import { getUsers, createUser } from "./storage.mjs";
import { User } from "./models/user.mjs";

let start = async function () {

    // Retrieve list of users to see if the user is already initiated
    let users = await getUsers();
    if (users && users.length > 0) {
        alert("Welcome back: " + users[0].nickname);
    } else {
        // Create new user if app is not yet initiated
        const name = "Random User 001";
        let newUserOb = new User(name, name, "logo-001");
        let addRes = await createUser(newUserOb)
        alert("Welcome : " + addRes)
    }
}

start();
