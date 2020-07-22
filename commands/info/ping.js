module.exports = {
    name: "ping",
    //aliases: ["", ""],
    category: "info",
    description: "Fetches your ping.",
    //usage: "",
    run: async (client, message, args) => {

        const msg = await message.channel.send(`🏓 Pinging...`);

        msg.edit(`🏓 Pong\nLatency is ${Math.floor(msg.createdAt - message.createdAt)} ms\nAPI Latency ${Math.round(client.ping)} ms`);
    }
}
