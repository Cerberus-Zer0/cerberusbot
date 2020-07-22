const { RichEmbed } = require("discord.js");

module.exports = {
    name: "info",
    //aliases: ["", ""],
    category: "info",
    description: "Displays bot information.",
    //usage: "",
    run: async (client, message, args) => {

				let boticon = client.user.displayAvatarURL;
				let botembed = new RichEmbed()
					.setDescription("Poseidon Information")
					.setColor("GREEN")
					.setThumbnail(boticon)
					.addField("Bot Name", client.user.username)
					.addField("Created On", client.user.createdAt);

				return message.channel.send(botembed);
    }
}
