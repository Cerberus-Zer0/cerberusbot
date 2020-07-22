const { Util } = require('discord.js')
const { config } = require("dotenv");
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const getYouTubePlaylistId = require('get-youtube-playlist-id');

module.exports = {
    name: "play",
    //aliases: [""],
    category: "music",
    description: "Add song to queue and play it.\nCurrently requires the url format of https://www.youtube.com/playlist?list=XXXXXXXXXXX",
    usage: "<YouTube link>",
    run: async (client, message, args, queue, serverQueue) => {

        const youtube = new YouTube(process.env.GOOGLE_API_KEY);

        const voiceChannel = message.member.voiceChannel;

        let search = args.join(" ");

        if (!search) {
            return message.reply("You didn't provide a link or search variables.")
              .then(m => m.delete(5000));
        }

        // *** add a check to see if the song is already in the queue

        if (!message.member.voiceChannel) {
            return message.reply("You need to be in a voice channel to play music.")
              .then(m => m.delete(5000));
        }

        if (!message.member.voiceChannel.joinable) {
            return message.reply("I don't have permission to join your voice channel.")
              .then(m => m.delete(5000));
        }

        if (search.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/) ||
            search.match(/^https?:\/\/(?:www\.)?youtube\.com\/watch\?((v=[^&\s]*&list=[^&\s]*)|(list=[^&\s]*&v=[^&\s]*))(&[^&\s]*)*$/)) {

            var playlistId = getYouTubePlaylistId(search);

            if (playlistId === false)
                return message.reply("Playlist ID is not valid.");

            console.log(playlistId);

            var playlistURL = `https://www.youtube.com/playlist?list=${playlistId}`;

            console.log(playlistURL);

            // assign video ids to an array
            const playlist = await youtube.getPlaylist(playlistURL);
            const videos = await playlist.getVideos();            

            for (const getVideo of Object.values(videos)) {

                const video = await youtube.getVideoByID(getVideo.id);
                await handleVideo(queue, video, message, voiceChannel, true);
            }

            message.channel.send(`Playlist: **${playlist.title}** has been added to the queue.`);

        } else {

            try {
                var video = await youtube.getVideo(search);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(search, 1);
                    var video = await youtube.getVideoByID(videos[0].id);
                    return handleVideo(queue, video, message, voiceChannel);
                } catch (err) {
                    console.error(err);
                    return message.reply("I couldn't find any search results.");
                }
            }
        }
    }
}

async function handleVideo(queue, video, message, voiceChannel, playlist = false) {

    const serverQueue = queue.get(message.guild.id);

    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };

    console.log(`Requested ` + song.title);

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 1,
            playing: true,
        };

        queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0], queue);
            return message.channel.send(`${song.title} is now playing!`);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        //console.log(serverQueue.songs);

        if (playlist) {
            return undefined;
        } else {
            return message.channel.send(`${song.title} has been added to the queue!`);
        }
    }

    return undefined;
}

async function play(guild, song, queue) {

    const serverQueue = queue.get(guild.id);

  	if (!song) {
    		serverQueue.voiceChannel.leave();
    		queue.delete(guild.id);
    		return;
  	}

  	const dispatcher = await serverQueue.connection.playStream(ytdl(song.url, {filter: "audioonly"}))
    		.on('end', () => {
      			console.log(`${song.title} ended!`);
      			serverQueue.songs.shift();
      			play(guild, serverQueue.songs[0], queue, serverQueue);
    		})
    		.on('error', error => {
    			  console.error(error);
    		});
  	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}
