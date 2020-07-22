const { Client, RichEmbed, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");

const client = new Client({
    disableEveryone: true
});

const queue = new Map();

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

const prefix = process.env.PREFIX;

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client.on("warn", console.warn);

client.on("error", console.error);

client.on("ready", () => {
    console.log(`${client.user.username} is online!`);

    client.user.setPresence({
        status: "online",
        game: {
            name: "the gates to Hades.",
            type: "WATCHING"
        }
    });
});

client.on('reconnecting', () => {

    console.log('Reconnecting!');
});

client.on('disconnect', () => {

    console.log('Disconnect!');
});

client.on("message", async message => {

    const serverQueue = queue.get(message.guild.id);

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command)
        command.run(client, message, args, queue, serverQueue);
});

client.login(process.env.TOKEN);
