const { RichEmbed } = require("discord.js");
const superagent = require("superagent");

module.exports = {
    name: "meow",
    aliases: ["cat", "kitty"],
    category: "fun",
    description: "Grabs a random cat image.",
    //usage: "",
    run: async (client, message, args) => {

        try {
            let { body } = await superagent
                .get(`http://aws.random.cat/meow`);

            let catEmbed = new RichEmbed()
                .setTitle("Meow! :cat:")
                .setColor("#ff9900")
                .setImage(body.file);

            message.channel.send(catEmbed);
        } catch (e) {   
            console.log(e.body);
        }
    }
}
