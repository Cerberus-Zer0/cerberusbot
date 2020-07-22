module.exports = {
    name: "clear",
    aliases: ["purge", "nuke"],
    category: "moderation",
    description: "Clears the chat.",
    run: async (client, message, args) => {

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("You don't have permission to delete messages.")
                .then(m => m.delete(5000));
        }
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("Amount of messages to clear is not a number or 0.")
                .then(m => m.delete(5000));
        }
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("I don't have permission to delete messages.")
                .then(m => m.delete(5000));
        }

        let clearAmount = parseInt(args[0]) + 1;
        let deleteAmount;

        if (clearAmount > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = clearAmount;
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`I deleted \`${deleted.size - 1}\` messages.`))
            .then(m => m.delete(5000))
            .catch(err => message.reply(`Something went wrong... Error: ${err}`));

    }
}
