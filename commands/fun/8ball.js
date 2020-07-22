const { RichEmbed } = require("discord.js");

module.exports = {
    name: "8ball",
    aliases: ["ball"],
    category: "fun",
    description: "Displays server information.",
    usage: "<question>",
    run: async (client, message, args) => {

				if (message.deletable) message.delete();

				if (!args[2])
						return message.reply("Please ask a full question.")
							.then(m => m.delete(5000));

				let replies = ["Yes.", "No.", "Quite possibly.", "Unlikely.", "I don't know.", "I don't think you want to know."];
				let result = Math.floor(Math.random() * replies.length);

				let question = args.join(" ");

				let ballEmbed = new RichEmbed()
					.setAuthor(message.author.tag)
					.setColor("#FF9900")
					.addField("Question", question)
					.addField("Answer", replies[result]);

				message.channel.send(ballEmbed);
    }
}
