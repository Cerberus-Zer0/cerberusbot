module.exports = {
    name: "skip",
    //aliases: [""],
    category: "music",
    description: "Skip song.",
    //usage: "",
    run: async (client, message, args, queue, serverQueue) => {

        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music.');
	      if (!serverQueue) return message.channel.send('The music queue is empty.');
	      serverQueue.connection.dispatcher.end();

    }
}
