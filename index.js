const Discord           = require("discord.js");
const client            = new Discord.Client();
const auth              = require("./config/auth.json");
const statTracker       = require("./data/stattracker.js");
const fs                = require("fs");
const commandFiles      = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const chalk             = require("chalk");



let digitCheck          = /\d+/g;
let channels            = [];

const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


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

client.on("message", async message => {

    if (message.author.bot) return;
    let serverPrefix;
    
    try {
        serverPrefix = await statTracker.getPrefix(message.guild.id);
    } catch (e) {
        if (e instanceof TypeError)
            serverPrefix = "!";
        else    
            console.error(e);
    }
    
    let reply = "You did not provide any arguments.";

    const args = message.content.slice(serverPrefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (commandName == "test"){
        await test.correctLeaderboard(message, message.guild.id);
        return;
    }

    //Check if command exists
    if (!client.commands.has(commandName)) return;

    // Check for spam with cooldowns.
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} second(s), before using \`${command.name}\` again.`);
        }
    }

    timestamps.set(message.author.id, now);
    // resets the cooldown for user once the command time is up
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Checking to see if the user added the required argument if not send an error
    if (command.args && !args.length) {
        if (command.usage)
            reply += `\n The proper usage would be: ${serverPrefix}${command.name} ${command.usage}`;
        return message.channel.send(reply).then(msg => { msg.delete({ timeout: 120000 }) });
    }

    if (commandName == "info"){
        args[0] = await client.users.cache.get("167777692735766529").avatarURL();
    }


    // runs the command
    try {
        command.execute(message, args);
        channels = await statTracker.getAllChannels();
    } catch (err) {
       return  console.error(err);

    }
    console.log ("Server prefix " + serverPrefix);
    let msg = message.content;
    if (message.author.bot || msg.includes(serverPrefix) || message.channel.type === "dm")
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
    if (channels.includes(message.channel.id) && !message.author.bot){
        let currentCount = await statTracker.getCurrentCount(message.guild.id);
        let lastUser = await statTracker.getLastUser(message.guild.id);
        message.delete();
        //await statTracker.editUpdate(message.author.id);
        currentCount--;
        await statTracker.updateCountAndUser(message.guild.id, currentCount, lastUser);
        message.channel.send(`A message was edited. The count has been reverted to **${currentCount}**`).then(msg => {msg.delete({timeout: 600000})});
    }
})
