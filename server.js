const auth = require("./config/auth.json");
const chalk = require("chalk");
const Discord = require("discord.js");
const client  = new Discord.Client();
const child_process = require("child_process");

client.login(auth.token);
client.login(auth.token);
client.on("ready", () => {
    console.log(
        chalk.rgb(235, 97, 35)(
            "Bot has launched"
        )
    )

});
function workerProcessSpawn() {
    let workerProcess = child_process.spawn('node', ['./index.js'], {
        stdio: "inherit"
    });
    workerProcess.on('close', function (code) {
        console.log('Bot process exited with code ' + code);
        console.log(chalk.grey("Bot offline, changing status"));
        //client.user.setStatus('dnd');
       // client.user.setActivity("Looks like I crashed...")
    });
    return workerProcess
};

var process = workerProcessSpawn();

client.on("message", async message => {
    if (message.content === `!r`) {

        if (message.author.id == 167777692735766529) {
            //await message.delete(); // no worky work
            message.delete();
            if (message.guild !== null) {
                console.log(chalk.red(`<<<<<[Restart command issued from guild '${message.guild.name}' by ${message.author.tag}]>>>>>`));
            } else {
                console.log(chalk.red(`<<<<<[Restart command issued from DM by ${message.author.tag}]>>>>>`));
            }
            client.user.setStatus('idle')
            process.kill();
            process = workerProcessSpawn();
        }
    }

});