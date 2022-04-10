const { Client, Collection } = require("discord.js");
const config = require("./config.js");
const client = new Client({ disableMentions: "everyone", disabledEvents: ["TYPING_START"], intents: 32767, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const events = require("./structures/event");
const command = require("./structures/slash");


client.commands = new Collection();
client.aliases = new Collection();
client.limits = new Map();
client.generateCase = () => {
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i = 0; i < 12; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}
client.config = config;
command.run(client);
events.run(client)

client.login(config.token)