const { RichEmbed } = require("discord.js");
const superagent = require("superagent");

module.exports = {
    name: "woof",
    aliases: ["dog", "puppy", "doggo"],
    category: "fun",
    description: "Grabs a random dog image.",
    //usage: "",
    run: async (client, message, args) => {

        let { body } = await superagent
            .get(`https://random.dog/woof.json`);

        let dogEmbed = new RichEmbed()
            .setTitle("Woof! :dog:")
            .setColor("#ff9900")
            .setImage(body.url);

        message.channel.send(dogEmbed);
    }
}
