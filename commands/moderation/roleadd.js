const { RichEmbed } = require("discord.js");

module.exports = {
    name: "roleadd",
    //aliases: ["", ""],
    category: "moderation",
    description: "Adds a role to the user.",
    usage: "<mention> <role name>",
    run: async (client, message, args) => {

				if (!message.member.hasPermission("MANAGE_MEMBERS"))
						return message.reply("You do not have the required permissions.")
								.then(m => m.delete(5000));

				let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
				if (!rMember)
						return message.reply("Couldn't find that user.")
								.then(m => m.delete(5000));

				let role = args.slice(1).join(" ");
				if (!role)
						return message.reply("Specify a role.")
								.then(m => m.delete(5000));

				let gRole = message.guild.roles.find(`name`, role);
				if (!gRole)
						return message.reply("Couldn't find that role.")
								.then(m => m.delete(5000));

				if (!rMember.roles.has(gRole.id))
						return message.reply("They already have that role.")
								.then(m => m.delete(5000));

				await(rMember.addRole(gRole.id));

				try {
						await rMember.send(`You have been given the role ${gRole.name}`);
				} catch(e) {
						message.channel.send(`<@${rMember.id}> has been given the role ${gRole.name}. DMs locked.`);
				}
    }
}
