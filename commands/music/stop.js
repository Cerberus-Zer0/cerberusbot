module.exports = {
    name: "stop",
    //aliases: [""],
    category: "music",
    description: "Stop song and bot leaves.",
    //usage: "",
    run: async (client, message, args, queue, serverQueue) => {

        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
        if (serverQueue === undefined) {
            return message.reply("There is nothing to stop.");
        } else {
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }
    }
}
