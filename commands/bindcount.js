const statTracker = require("../data/stattracker.js");
module.exports = {
    name: "bindcount",
    cooldown: 30,
    description: "Bind's the bot to only look in this bound channel", 
    async execute (message, args){
        if (message.channel.type === "dm"){
            return message.channel.send("Sorry but you can not run that command in an DM channel").then(msg => { msg.delete({ timeout: 120000 }) });
        } else if (message.member.hasPermission("MANAGE_CHANNELS")) {
            await statTracker.updateCountChannel(message.guild.id, message.channel.id);
            message.delete();
            message.channel.send("Channel has been bound").then(msg => { msg.delete({ timeout: 120000 }) });
         } else 
            message.channel.send("Sorry but you are missing the MANAGE_CHANNELS permission").then(msg => { msg.delete({ timeout: 120000 }) });
    }
};