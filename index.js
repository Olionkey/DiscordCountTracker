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

var channels = require("./data/channel.json");

client.login(auth.token);
client.on ("ready", () => {
    console.log("I am on, hello world!!");
})

client.on("message", message => {
    if (message.author.bot)
        return;

    // A user (with perms) can use the !count command to register the channel as being a channel for counting.
    if (message.content == "!count") {
        if (message.member.hasPermission("MANAGE_CHANNELS") && !channels.includes(message.channel.id)) {
            channels.push(message.channel.id);
            updateJsonFile("./data/channel.json", (data) => { 
                data = channels; 
                return data; 
            });
            message.delete();
        }
    }

    if (channels.includes(message.channel.id)) {
        let currentMessage = message.content;
        if (!currentMessage.match(digitCheck) || currentMessage < currentCount || currentMessage > currentCount + 1 || message.author == lastUser || currentMessage != currentCount || currentMessage.includes(".")){
            console.log( chalk.red(`Message delete ${currentMessage} , Message author ${message.author.username}`) );
            statTracker.deleteUpdate(message.author.id); // message.guild.id
            message.delete();
        }
        else{
            currentCount++;
            lastUser = message.author.id;
            // Updates the current count for persitent storage.
            updateJsonFile("./config/config.json", (data) => {
                data.currentNumber = currentCount;
                data.lastUser = lastUser;
                return data;
            });
            statTracker.correctUpdate(message.author.id); // Message.guild.id
        }
    }
})

// Check to see if there is a message edited, if so move the counter down one and remove the message. 
client.on("messageUpdate", message => {
    if (channels.includes(message.channel.id)) {
        message.delete();
        statTracker.editUpdate(message.author.id);
        currentCount--;
        updateJsonFile("./config/config.json", (data) => {
            data.currentNumber = currentCount;
            return data;
        })
        message.channel.send(`A message was edited. The count has been reverted to **${currentCount}**`).then(msg => {msg.delete({timeout: 600000})});
    }
})