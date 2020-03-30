const statTracker = require("../data/stattracker.js");
let digitCheck = /\d+/g;
module.exports = {
    name: "setcount",
    cooldown: 30,
    description: "Reset the count, is something went ary",
    args: true,
    usage: '#',
    async execute(message, args) {
        if (message.channel.type === "dm") {
            return message.channel.send("Sorry but you can not run that command in an DM channel").then(msg => { msg.delete({ timeout: 120000 }) });
        }
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