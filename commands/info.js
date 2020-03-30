const statTracker = require("../data/stattracker.js");
const Discord = require("discord.js");

module.exports = {
    name: "info",
    cooldown: 5,
    description: "Display some information on the bot",
    async execute(message, args) {
        if (message.channel.type !== "dm") {
            message.delete();
        }
        
        let infoEmbed = new Discord.MessageEmbed()
            .setFooter("Made by Olionkey#4373", args[0])
            .setColor('#ff7c7c')
            .setTitle("Discord Count Bot")
            .setDescription("Thank you for teaching my bot how to count.")
            .addField("If there is a bug, issue, or idea", "Please contribute it here: https://github.com/Olionkey/DiscordCountTracker/issues")
            .addField("Know how to program and want to help?", "Make a PR here: https://github.com/Olionkey/DiscordCountTracker/pulls");
        message.channel.send(infoEmbed);
    }
}







