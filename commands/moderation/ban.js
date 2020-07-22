const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "ban",
    category: "moderation",
    description: "Bans the user from the server.",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === process.env.LOG_CHANNEL) || message.channel;
        const banReason = args.slice(1).join(" ");

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("Please provide a user to ban.")
                .then(m => m.delete(5000));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please provide a reason to ban.")
                .then(m => m.delete(5000));
        }

        // No author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("You do not have permissions to ban members. Please contact an admin.")
                .then(m => m.delete(5000));

        }
        // No bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("I do not have permissions to ban members. Please contact an admin.")
                .then(m => m.delete(5000));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toBan) {
            return message.reply("I couldn't find that user.")
                .then(m => m.delete(5000));
        }

        // Can't ban urself
        if (toBan.id === message.author.id) {
            return message.reply("You can't ban yourself.")
                .then(m => m.delete(5000));
        }

        // Check if the user's banable
        if (!toBan.bannable) {
            return message.reply("That user can't be banned.")
                .then(m => m.delete(5000));
        }

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> Banned member:** ${toBan} (${toBan.id})
            **> Banned by:** ${message.member} (${message.member.id})
            **> Reason:** ${banReason}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to ban ${toBan}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
            msg.delete();

            // Verification stuffs
            if (emoji === "✅") {
                toBan.ban(banReason)
                    .catch(err => {
                        if (err) return message.channel.send(`Something went wrong while trying to ban.\nError: ${err}`);
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                message.reply(`Ban cancelled...`)
                    .then(m => m.delete(10000));
            } else {
                message.reply("Somehow you managed to choose an option that was not provided.")
                    .then(m=> m.delete(5000));
            }
        });
    }
};
