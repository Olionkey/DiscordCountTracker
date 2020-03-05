const fs = require("fs");
const chalk = require("chalk");
let statsFile = require("../data/stats.json"); // read the file into memory

exports.deleteUpdate = async (author) => {
    let index = await findUser(author);
    (index != -1) ? statsFile.users[index].delete = statsFile.users[index].delete + 1 : await createUser(author, 0);
    updateUser();
}

exports.correctUpdate = async (author) => {
    let index = await findUser(author);
    (index != -1) ? statsFile.users[index].correct = statsFile.users[index].correct + 1 : await createUser(author, 1);
    updateUser();
}

exports.editUpdate = async (author) => {
    let index = await findUser(author);
    if (index != -1){
        statsFile.users[index].correct = statsFile.users[index].delete + 1;
        statsFile.users[index].correct = statsFile.users[index].edit + 1;
    }
    else
        await createUser(author, 1)
    updateUser();
}

async function findUser(author) {
    let users = statsFile.users;
    for (let i = 0; i < users.length; i++)
        if (users[i].author == author) return i;
    return -1;
}

async function createUser(author, choice) {
    if (choice == 0) statsFile['users'].push({ "author": author, "delete": 1, "correct": 0, "edit": 0 });
    else if (choice == 1) statsFile['users'].push({ "author": author, "delete": 0, "correct": 0, "edit":0 });
    else if (choice == 2) statsFile['users'].push({ "author": author, "delete": 0, "correct": 1, "edit": 1 });
    console.log(chalk.green(`User was created: ${author}`))
}

async function updateUser() {
    let data = JSON.stringify(statsFile);
    fs.writeFileSync("./data/stats.json", data);
}