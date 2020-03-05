const updateJson = require("update-json-file");
const statsFile  = require("../data/stats.json");
const fs         = require("fs");
let stats;

exports.delete = (author) => {
    let StatsObject = JSON.parse(statsFile);
    let temp = statsFile.users.author;
    if (temp.includes(author)) {
        console.log(temo.includes(author));
        console.log(temp.indexOf(author));
        index = temp.indexOf(author);
    }
    else
        index = -1;

    if (index != -1)
        statsFile.users[findUser(author)].delete = statsFile.users[findUser(author)].delete + 1;
    else 
        createUser(author);
        
}

async function findUser (author) {
    let temp = statsFile.users.author;


}

async function createUser (author) {
    statsFile['users'].push({"author":author, "delete" : "1"});
}

// read the file into memory
async function readFile (){
    console.log(statsFile);
}