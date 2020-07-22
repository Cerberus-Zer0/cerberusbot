const { Util } = require('discord.js');
const { config } = require("dotenv");
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const Spotify = require('node-spotify-api');

const spotify = new Spotify({
    id: process.env.SPOTIFY_CLIENT_ID,
    secret: process.env.SPOTIFY_CLIENT_SECRET
});

module.exports = {
    name: "spotify",
    //aliases: [""],
    category: "music",
    description: "Play a spotify playlist.",
    //usage: "",
    run: async (client, message, args, queue, serverQueue) => {

        // spotify:album:[id]
        // spotify:playlist:[id]
        const uri = args.toString().split(":");
        const apiType = uri[1];
        const apiId = uri[2];

        // build the api URL
        // *** limit this shit to 20 songs and allow user to provide an offset ***
        if (apiType == "album") {
            apiURL = `https://api.spotify.com/v1/albums/${apiId}/tracks`;
        } else if (apiType == "playlist") {
            apiURL = `https://api.spotify.com/v1/playlists/${apiId}/tracks`;
        }

        spotify.request(apiURL)
            .then(async function (data) {

                //console.log(data);
                // console.log(data.items[0].track);

                const youtube = new YouTube(process.env.GOOGLE_API_KEY);
                const voiceChannel = message.member.voiceChannel;

                for ($i = 0; data.items[$i]; $i++) {
                    var songSearch = data.items[$i].track.name + " " + data.items[$i].track.artists[0].name;
                    console.log(songSearch);
                    try {
                        var video = await youtube.getVideo(songSearch);
                    } catch (error) {
                        try {
                            var videos = await youtube.searchVideos(songSearch, 1);
                            var video = await youtube.getVideoByID(videos[0].id);
                        } catch (err) {
                            console.error(err);
                            console.log(`I couldn't find any search results for ${data.items[$i].track.name}.`);
                        }
                    }
                    if (video) {
                        handleVideo(queue, video, message, voiceChannel);
                    } else {
                        console.log("No video was received.");
                    }
                }
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });

        // Spotify playlist > Share > Copy URI

        // https://api.spotify.com/v1/playlists/[id]/tracks
        // spotify:playlist:0ZFHhBThXiLYjJpb5t3Kwa

        // https://api.spotify.com/v1/albums/[id]/tracks
        // spotify:album:4fZL8IIvPlmrjcG66mQ4md

        // spotify:artist:6RB22DhArLFMDMuTsl0e6q

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
    }

    return undefined;
}

function play(guild, song, queue) {

    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url, { filter: "audioonly" }))
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
