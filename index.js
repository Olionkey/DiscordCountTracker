const Discord           = require("discord.js");
const client            = new Discord.Client();
const auth              = require("./config/auth.json");
const config            = require("./config/config.json");
const updateJsonFile    = require("update-json-file");
const statTracker       = require("./data/stattracker.js");
const chalk             = require("chalk");

let currentCount        = config.currentNumber;
let lastUser            = config.lastUser;
let digitCheck          = /\d+/g;

client.login(auth.token);
client.on ("ready", () => {
    console.log("I am on, hello world!!");
})

client.on("message", message => {
    if (message.channel.id == "684838856922628149"){
        let currentMessage = message.content;
        if (!currentMessage.match(digitCheck) || currentMessage < currentCount || currentMessage > currentCount + 1 || message.author == lastUser || currentMessage != currentCount){
            console.log( chalk.red(`Message delete ${currentMessage} , Message author ${message.author.username}`) );
            statTracker.deleteUpdate(message.author.id, message.guild.id);
            message.delete();
        }
        else{
            currentCount++;
            lastUser = message.author;
            // Updates the current count for persitent storage.
            updateJsonFile("./config/config.json", (data) => {
                data.currentNumber = currentCount;
                data.lastUser = lastUser;
                return data;
            });
            statTracker.correctUpdate(message.author.id, message.guild.id);
        }
    }
})

// Check to see if there is a message edited, if so move the counter down one and remove the message. 
client.on("messageUpdate", message => {
    if (message.channel.id == "684838856922628149"){
        message.delete();
        currentCount--;
        updateJsonFile("./config/config.json", (data) => {
            data.currentNumber = currentCount;
            return data;
        })
        message.channel.send("The current count has been reverted to, due to a message having an edit: " + currentCount);
    }
})