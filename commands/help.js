const statTracker = require("../data/stattracker.js");
module.exports = {
    name: 'help',
    description: 'List all of the commands that is possible.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    async execute(message, args) {
        const data = [];
        const { commands } = message.client;
        let prefix;
        try {
            prefix = await statTracker.getPrefix(message.guild.id);
        } catch (e) {
            if (e instanceof TypeError)
                prefix = "!";
            else
                console.error(e);
        }


        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!').then(msg => { msg.delete({ timeout: 10000 }) });
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you!').then(msg => { msg.delete({ timeout: 10000 }) });
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.author.send(data, { split: true });
    },
};