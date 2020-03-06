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
let channels            = [];

client.login(auth.token);
client.on ("ready", async () => {
    console.log("I am on, hello world!!");
    channels = await statTracker.getAllChannels();
})

// Create a new server when the bot joins a new server.
client.on('guildCreate', async guild => {
    await statTracker.createServer(guild.id);
    console.log(chalk.green("Server has been created, with guild id: " + guild.id));
});

client.on("message", async message => {
    if (message.author.bot) return;
    let serverPrefix = await statTracker.getPrefix(message.guild.id);
    const args = message.content.slice(serverPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    switch (command){
        case "bindcount":
            if (message.member.hasPermission("MANAGE_CHANNELS")){
                await statTracker.updateCountChannel(message.guild.id, message.channel.id);
                message.channel.send("Channel has been bound").then(msg => { msg.delete({ timeout: 120000})});
            } else 
                message.channel.send("Sorry but you are missing the MANAGE_CHANNELS permission").then(msg => { msg.delete({ timeout: 120000 }) });
        break;

    }
})

client.on("message", async message => {
    if (message.author.bot)
        return;
    if (channels.includes(message.channel.id)){
        let currentMessage = message.content;
        if (!currentMessage.match(digitCheck) || currentMessage < currentCount || currentMessage > currentCount + 1 || message.author == lastUser || currentMessage != currentCount || currentMessage.includes(".")){
            console.log( chalk.red(`Message delete ${currentMessage} , Message author ${message.author.username}`) );
            await statTracker.deleteUpdate(message.author.id, message.guild.id); // message.guild.id
            //message.delete();
        }
        else{
            currentCount++;
            lastUser = message.author.id;
            // Updates the current count for persitent storage.
            await statTracker.updateCountAndUser(message.guild.id, currentCount, lastUser);
            await statTracker.correctUpdate(message.author.id, message.guild.id); // Message.guild.id
        }
    }
})

// Check to see if there is a message edited, if so move the counter down one and remove the message. 
client.on("messageUpdate", async message => {
    if (channels.includes(message.channel.id)){
        message.delete();
        await statTracker.editUpdate(message.author.id);
        currentCount--;
        await statTracker.updateCountAndUser(message.guild.id, currentCount, lastUser);
        message.channel.send(`A message was edited. The count has been reverted to **${currentCount}**`).then(msg => {msg.delete({timeout: 600000})});
    }
})
