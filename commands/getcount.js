const statTracker = require("../data/stattracker.js");
module.exports = {
    name: "getcount",
    cooldown: 60,
    description: "Reset the count, is something went ary",
    async execute(message, args) {
        if (message.channel.type === "dm") {
            return message.channel.send("Sorry but you can not run that command in an DM channel").then(msg => { msg.delete({ timeout: 120000 }) });
        }
        message.delete();
        let count = await statTracker.getCurrentCount(message.guild.id);
        message.channel.send("The current count is... **" + count + "**").then(msg => { msg.delete({ timeout: 120000 }) });
        return;
    }
};