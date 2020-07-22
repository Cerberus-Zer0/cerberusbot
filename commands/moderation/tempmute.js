const { RichEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "tempmute",
    aliases: ["temp"],
    category: "moderation",
    description: "Temporarily mute a user for a set time.",
    usage: "<mention> <time {s, m, h, d}>",
    run: async (client, message, args) => {

				let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);

				if (!toMute)
					return message.reply("Couldn't find user.")
							.then(m => m.delete(5000));

				if (toMute.hasPermission("MANAGE_MESSAGES"))
						return message.reply("Can't mute them!")
								.then(m => m.delete(5000));

				let muteRole = message.guild.roles.find(`name`, "Muted");
				if (!muteRole) {
						try {
							muteRole = await message.guild.createRole({
									name: "Muted",
									color: "#000000",
									permissions: []
							});
							message.guild.channels.forEach(async (channel, id) => {
									await channel.overwritePermissions(muteRole, {
											SEND_MESSAGES: false,
											ADD_REACTIONS: false
									});
							});
						} catch(e) {
								console.log(e.stack);
						}
				}

				let muteTime = args[1];
				if (!muteTime)
						return message.reply("You didn't specify a time!")
								.then(m => m.delete(5000));

				await(toMute.addRole(muteRole.id));
				message.reply(`<@${toMute.id}> has been muted for ${ms(ms(muteTime))}`);

				setTimeout(function() {
						toMute.removeRole(muteRole.id);
						message.channel.send(`<@${toMute.id}> has been unmuted!`);
				}, ms(muteTime));
    }
}
