const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./config/auth.json");
const config = require("./config/config.json");

let currentCount = 368;
let lastUser = "";
let digitCheck = /\d+/g;

client.login(auth.token);
client.on ("ready", () => {
    console.log("I am on, hello world!!");
})

client.on("message", message => {
       // currentCount = parseInt(message.last);
       // console.log(currentCount);
    if (message.channel.id == "684838856922628149"){
        let currentMessage = message.content;
        console.log(message.content);
    if (!currentMessage.match(digitCheck) || currentMessage < currentCount || currentMessage > currentCount + 1 || message.author == lastUser || currentMessage != currentCount){
        console.log(`Message delete ${currentMessage} , Message author ${message.author.username}`);
        message.delete();
    }
        else if (message.content == config.max)
            return message.channel.send ("Congrets we hit the max! \n Counting will we revert back to zero");
        else{
            currentCount ++;
            lastUser = message.author;
        }
            
    }
})
