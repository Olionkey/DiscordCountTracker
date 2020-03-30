const statTracker = require("../data/stattracker.js");
// THis command currently not in use
/*
module.exports = {

    name: "setbreak",
    cooldown: 30,
    description: "Allows continuous count messages sent by one person ",
    execute(message, args) {
        message.delete();
        if (message.member.hasPermission("MANAGE_CHANNELS") || message.author.id == 167777692735766529) {
            let currentMessage = message.content;
            if (!currentMessage.match(digitCheck) || currentMessage.includes(".") || currentMessage.includes(",")) {
                message.channel.send("Sorry but that is not a valid value, please try again.").then(msg => { msg.delete({ timeout: 120000 }) });
            } else {
                await statTracker.updateCount(message.guild.id, args[0]);
                message.channel.send("The current count for this server has been updated to. " + args[0]).then(msg => { msg.delete({ timeout: 120000 }) });
            }
        }
        return;
    }
};
*/