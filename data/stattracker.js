const fs          = require("fs");
const chalk       = require("chalk");
let   statsFile   = require("../data/stats.json"); // read the file into memory

exports.deleteUpdate = async (author, server) => {
    let index = await findUser(author, server);
    (index != -1) ? statsFile.users[index].delete = statsFile.users[index].delete + 1: await createUser(author, 0, server); 
}

exports.correctUpdate = async (author) => {
    let index = await findUser(author, server);
    (index!= -1) ? statsFile.users[index].correct = statsFile.users[index].correct + 1: await createUser(author, 1, server);
    updateUser();
}

async function findUser (author, server) {
    let serverIndex = await findServer(server);
    if (serverIndex == -1) await createServer(server);
    let users = statsFile.servers[serverIndex].users;
    for (let i = 0; i < users.length; i ++)
        if (users[i].author == author) return i;
    return -1;
}

async function createUser (author, choice, server) {
    if (choice == 0) statsFile.servers[server]['users'].push({ "author": author, "delete": 1, "correct": 0 });
    else if (choice == 1) statsFile.servers[server]['users'].push({ "author": author, "delete": 0, "correct": 1 });
    console.log(chalk.green(`User was created: ${author}`))
}

async function updateUser () {
    let data = JSON.stringify(statsFile);
    fs.writeFileSync("./data/stats.json", data);
}

async function findServer (server) {
    let servers = statsFile.servers;
    for (let i = 0; i < servers.length; i ++)
        if (servers[i].server == server) return i;
    return -1;
}

async function createServer(server){
    statsFile["servers"].push(["users"]);
    console.log(chalk.green(`Server was created: ${server}`));
}