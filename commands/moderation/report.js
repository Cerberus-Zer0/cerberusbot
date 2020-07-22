const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "report",
    aliases: ["rep"],
    category: "moderation",
    description: "Report a user for misconduct.",
    usage: "<mention | id>",
    run: async (client, message, args) => {

        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!rMember)
            return message.reply("Couldn't find that user.")
                .then(m => m.delete(5000));

        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.reply("Can't report that member.")
                .then(m => m.delete(5000));

        if (!args[1])
            return message.channel.send("Please provide a reason for the report.")
                .then(m => m.delete(5000));

        const channel = message.guild.channels.find(channel => channel.name === process.env.LOG_CHANNEL);

        if (!channel)
            return message.channel.send("I couldn't find a report channel.")
                .then(m => m.delete(5000));

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Reported member", rMember.user.displayAvatarURL)
            .setDescription(stripIndents`**> Member:** ${rMember} (${rMember.id})
            **> Reported by:** ${message.member} (${message.member.id})
            **> Reported in:** ${message.channel}
            **> Reason:** ${args.slice(1).join(" ")}`);

        return channel.send(embed);
    }
}
