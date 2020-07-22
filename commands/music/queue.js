module.exports = {
    name: "queue",
    aliases: ["q"],
    category: "music",
    description: "Lists all songs in the queue and now playing.",
    //usage: "",
    run: async (client, message, args, queue, serverQueue) => {

        if (!serverQueue)
            return message.channel.send('There is nothing playing.');

        queueText = `
            __**Song queue:**__\n
            **Now playing:** ${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
        `;

    		return message.channel.send(queueText, { split: true });
    }
}
