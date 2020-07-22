const { RichEmbed } = require("discord.js");

module.exports = {
    name: "server",
    //aliases: ["", ""],
    category: "info",
    description: "Displays server information.",
    //usage: "",
    run: async (client, message, args) => {

				let servericon = message.guild.iconURL;
				let serverembed = new RichEmbed()
					.setDescription("Server Information")
					.setColor("YELLOW")
					.setThumbnail(servericon)
					.addField("Server Name", message.guild.name)
					.addField("Created On", message.guild.createdAt)
					.addField("You Joined", message.member.joinedAt)
					.addField("Total Members", message.guild.memberCount);

				return message.channel.send(serverembed);
    }
}
