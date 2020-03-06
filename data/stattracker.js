const fs = require("fs");
const chalk = require("chalk");
let statsFile = require("../data/stats.json"); // read the file into memory
let serverIndex;

exports.deleteUpdate = async (author, server) => {
    let index = await findUser(author, server);
    let userObj = statsFile.servers[serverIndex];
    userObj = userObj[server];
    (index != -1) ? userObj.users[index].delete = userObj.users[index].delete + 1 : await createUser(author, 0, server);
    updateFile();
}

exports.correctUpdate = async (author, server) => {
    let index = await findUser(author, server);
    let userObj = statsFile.servers[serverIndex];
    userObj = userObj[server];
    (index != -1) ? userObj.users[index].correct = userObj.users[index].correct + 1 : await createUser(author, 1, server);
    updateFile();
}

exports.updateCountChannel = async (server, channel) => {
    let tempObj = await findServer(server);
    let serverObj = statsFile.servers[tempObj];
    serverObj = serverObj[server];
    serverObj.config.countChannel = channel;
    updateFile();
}

exports.updateCountAndUser = async (server, count, user) => {
    let tempObj = await findServer(server);
    let serverObj = statsFile.servers[tempObj];
    serverObj = serverObj[server];
    serverObj.config.currentCount = count;
    serverObj.config.lastUser = user;
    updateFile();
}

exports.getPrefix = async (server) => {
    console.log(`Server: ${server}`);
    let tempObj = await findServer(server);
    console.log(tempObj);
    let serverObj = statsFile.servers[tempObj];
    console.log(serverObj);
    serverObj = serverObj[server];
    console.log("serverobj " + serverObj);
    return serverObj.config.prefix;
}

exports.createServer = async (server) => {
    if (await findServer(server) != -1) return console.log(chalk.red ("Server has already been created"));
    statsFile["servers"].push({ [server]: { "users": [], "config": { "prefix": "!", "currentCount": 0, "lastUser": "foo", "countChannel": 0 } } });
    await updateFile();
    console.log(chalk.green(`Server was created: ${server}`));
}
    
exports.getAllChannels = async () => {
    let channels = [];
    for (let i = 0 ; i < statsFile.servers.length; i ++){
        let tempObj = statsFile.servers[i];
        tempObj = tempObj[Object.keys(statsFile.servers[i])];
        channels.push(tempObj.config.countChannel);
    }
    return channels;
}

// Currently does not search correctly, it just pulls the first server index even if it is not equal.
async function findServer(server) {
    let servers = statsFile.servers;
    console.log(servers);
    for (let i = 0; i < servers.length; i++) {
        if (servers[i] == server) console.log("hi");
        if ((Object.keys(servers[i]).includes(server))) {
            serverIndex = Object.keys(servers[i]).indexOf(server);
            console.log(`Server index ${serverIndex}`);
            console.log(`ServerIndexObjectKey ${Object.keys(servers[i]).indexOf(server)}`);
            return serverIndex;
        }
    }
    return -1;
}

async function findUser(author, server) {
    let serverObj = await findServer(server);
    let tempObj = statsFile.servers[serverObj];
    tempObj = tempObj[server]
    let userObj = tempObj.users;
    for (let i = 0 ; i < userObj.length; i ++)
        if(userObj[i].author == author) return i;
    return -1;
}

async function createUser(author, choice, server) {
    let file = statsFile.servers[serverIndex];
    file = file[server];
    if (choice == 0) file['users'].push({ "author": author, "delete": 1, "correct": 0 });
    else if (choice == 1) file['users'].push({ "author": author, "delete": 0, "correct": 1 });
    else file['users'].push({ "author": author, "delete": 0, "correct": 1 });
    console.log(chalk.green(`User was created: ${author}`));
    updateFile();
}

async function updateFile() {
    let data = JSON.stringify(statsFile, null, 4);
    fs.writeFileSync("./data/stats.json", data);
    console.log("file updated");
}

