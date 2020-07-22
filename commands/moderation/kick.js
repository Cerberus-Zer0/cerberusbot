const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "kick",
    aliases: ["boot"],
    category: "moderation",
    description: "Kick a user from the server.",
    usage: "<mention | id>",
    run: async (client, message, args) => {

      const logChannel = message.guild.channels.find(c => c.name === process.env.LOG_CHANNEL) || message.channel;
      const kickReason = args.slice(1).join(" ");

      if (message.deletable) message.delete();

      if (!args[0]) {
          return message.reply("Please provide a user to kick.")
              .then(m => m.delete(5000));
      }
      if (!args[1]) {
          return message.reply("Please provide a reason to kick user.")
              .then(m => m.delete(5000));
      }
      if (!message.member.hasPermission("KICK_MEMBERS")) {
          return message.reply("You do not have permission to kick users. Please contact an admin.")
              .then(m => m.delete(5000));
      }
      if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
          return message.reply("I do not have permission to kick members. Please contact an admin.")
              .then(m => m.delete(5000));
      }

      const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);

      if (!toKick) {
          return message.reply("Couldn't find that user.")
              .then(m => m.delete(5000));
      }

      if (message.author.id === toKick.id) {
          return message.reply("You can't kick yourself.")
              .then(m => m.delete(5000));
      }

      if (!toKick.kickable) {
          return message.reply("User is not kickable.")
              .then(m => m.delete(5000));
      }

      const embed = new RichEmbed()
          .setColor("#ff0000")
          .setThumbnail(toKick.user.displayAvatarURL)
          .setFooter(message.memeber.displayName, message.author.displayAvatarURL)
          .setTimestamp()
          .setDescription(stripIndents`
          **> Kicked member:** ${toKick} (${toKick.id})
          **> Kicked by:** ${message.author} (${message.author.id})
          **> Reason:** ${kickReason}`);

      const promptEmbed = new RichEmbed()
          .setColor("GREEN")
          .setAuthor("This verification becomes invalid after 30s.")
          .setDescription(`Are you sure you want to kick ${toKick}?`);

      message.channel.send(promptEmbed).then(async msg => {
          const emoji = await promptMessage(msg, message.author, 30, ["'✅'", "❌"]);
          msg.delete();

          if (emoji === "✅") {
              toKick.kick(kickReason)
                  .catch(err => {
                      if (err) return message.channel.send(`Something went wrong while trying to kick.\nError: ${err}`);
                  });

              logChannel.send(embed);
          } else if (emoji === "❌") {
              message.reply("Kick cancelled...")
                  .then(m => m.delete(5000));
          } else {
              message.reply("Somehow you managed to choose an option that was not provided.")
                  .then(m=> m.delete(5000));
          }
      });

    }
  }
