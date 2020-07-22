module.exports = {
    name: "resume",
    //aliases: [""],
    category: "music",
    description: "Resumes the music.",
    //usage: "",
    run: async (client, message, args, queue, serverQueue) => {

      if (serverQueue && !serverQueue.playing) {
    			serverQueue.playing = true;
    			serverQueue.connection.dispatcher.resume();
    			return message.channel.send('▶ Resumed the music for you!');
		  }
		  return message.channel.send('There is nothing playing.');
    }
}
