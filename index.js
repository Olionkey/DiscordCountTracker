const Discord           = require("discord.js");
const client            = new Discord.Client();
const auth              = require("./config/auth.json");
const statTracker       = require("./data/stattracker.js");
const chalk             = require("chalk");


let digitCheck          = /\d+/g;
let channels            = [];

client.login(auth.token);
client.on ("ready", async () => {
    client.user.setActivity(`how to count`, { type: "WATCHING" }).then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);
    channels = await statTracker.getAllChannels();
})

// Create a new server when the bot joins a new server.
client.on('guildCreate', async guild => {
    await statTracker.createServer(guild.id);
    console.log(chalk.green("Server has been created, with guild id: " + guild.id));
});

// This all should probably be moved to it's own file for just commands.
client.on("message", async message => {
    if (message.author.bot) return;
    let serverPrefix = await statTracker.getPrefix(message.guild.id);
    const args = message.content.slice(serverPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    switch (command){
        case "bindcount":
            message.delete();
            if (message.member.hasPermission("MANAGE_CHANNELS")){
                await statTracker.updateCountChannel(message.guild.id, message.channel.id);
                message.channel.send("Channel has been bound").then(msg => { msg.delete({ timeout: 120000})});
                channels = await statTracker.getAllChannels();
            } else 
                message.channel.send("Sorry but you are missing the MANAGE_CHANNELS permission").then(msg => { msg.delete({ timeout: 120000 }) });
            return;
        break;
        case 'setcount':
            message.delete();
            if (message.member.hasPermission("MANAGE_CHANNELS") || message.author.id == 167777692735766529){
                let currentMessage = message.content;
                if (!currentMessage.match(digitCheck) || currentMessage.includes(".") || currentMessage.includes(",")){
                    message.channel.send("Sorry but that is not a valid value, please try again.").then(msg => { msg.delete({ timeout: 120000 }) });
                } else {
                    await statTracker.updateCount(message.guild.id, args[0]);
                    message.channel.send("The current count for this server has been updated to. " + args[0]).then(msg => { msg.delete({ timeout: 120000 }) });
                }
            }
            return;
        break;
        case 'setbreak':
            message.delete();
            if (message.member.hasPermission("MANAGE_CHANNELS")){
                if (args.length < 0)
                    message.channel.send("Sorry but you are missing an argument looking for true or false").then(msg => { msg.delete({ timeout: 30000 }) });
                else if (args[0] == Boolean) {
                    let temp = await statTracker.setContinuous(message.guild.id, args[0]);
                    message.channel.send("Continuous message are now set to: " + temp).then(msg => { msg.delete({ timeout: 30000 }) });
                }
            } else {
                message.channel.send("Sorry but you are missing the MANAGE_CHANNELS permission").then(msg => { msg.delete({ timeout: 120000 }) });
            }
            return;
        break;
        case 'getcount' :
            message.delete();
            let count = await statTracker.getCurrentCount(message.guild.id);
            message.channel.send("The current count is... **" + count + "**").then(msg => { msg.delete({ timeout: 120000 }) });
            return;
        break;
        case 'users' :
            statTracker.testFunction(message.guild.id);
            
    }
})

client.on("message", async message => {
    let serverPrefix = await statTracker.getPrefix(message.guild.id);
    let msg = message.content;
    if (message.author.bot && !msg.includes(serverPrefix))
        return;
    if (channels.includes(message.channel.id)){
        let currentMessage = message.content;
        let currentCount = await statTracker.getCurrentCount(message.guild.id);
        let lastUser    = await statTracker.getLastUser(message.guild.id);
        if (!currentMessage.match(digitCheck) || currentMessage < currentCount || currentMessage > currentCount + 1 || currentMessage != currentCount || currentMessage.includes(".") || currentMessage.charAt(0) == 0 || message.author.id == lastUser){
           // if (await statTracker.ifContinuous(message.guild.id) && currentMessage.author == lastUser){
                console.log(chalk.red(`Message delete ${currentMessage}, Message author \t${message.author.username} in server \t${message.guild.id}`));
                await statTracker.deleteUpdate(message.author.id, message.guild.id); // message.guild.id
                message.delete();
            //}

        }
        else{
            currentCount++;
            lastUser = message.author.id;
            // Updates the current count for persitent storage.
            await statTracker.updateCountAndUser(message.guild.id, currentCount, lastUser);
            await statTracker.correctUpdate(message.author.id, message.guild.id);
        }
    }
})

// Check to see if there is a message edited, if so move the counter down one and remove the message. 
client.on("messageUpdate", async message => {
    if (channels.includes(message.channel.id)){
        let currentCount = await statTracker.getCurrentCount(message.guild.id);
        let lastUser = await statTracker.getLastUser(message.guild.id);
        message.delete();
        //await statTracker.editUpdate(message.author.id);
        currentCount--;
        await statTracker.updateCountAndUser(message.guild.id, currentCount, lastUser);
        message.channel.send(`A message was edited. The count has been reverted to **${currentCount}**`).then(msg => {msg.delete({timeout: 600000})});
    }
})
