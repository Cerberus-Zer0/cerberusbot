const { RichEmbed } = require("discord.js");

module.exports = {
    name: "say",
    aliases: ["broadcast"],
    category: "moderation",
    description: "Says your input via the bot.",
    usage: "<message>",
    run: async (client, message, args) => {

        if (message.deletable) message.delete();
        if (args.length < 1)
            return message.reply("Nothing to say...").then(m => m.delete(5000));

        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

        if (args[0].toLowerCase() === "embed") {
            const embed = new RichEmbed()
                .setColor(roleColor)
                .setAuthor(client.user.username, client.user.displayAvatarURL)
                .setDescription(args.slice(1).join(" "))
                .setTimestamp()

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}
