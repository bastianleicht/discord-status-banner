const Discord = require("discord.js");
const config = require(`./botconfig/config.json`);
const settings = require(`./botconfig/settings.json`);
const colors = require("colors");
const path = require('path');
const express = require('express')
const nocache = require('nocache');
const app = express()

const client = new Discord.Client({
    //fetchAllMembers: false,
    //restTimeOffset: 0,
    //restWsBridgetimeout: 100,
    shards: "auto",
    allowedMentions: {
      parse: [ ],
      repliedUser: false,
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [ 
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ],
    presence: {
      activity: {
        name: `Music`, 
        type: "LISTENING", 
      },
      status: "online"
    }
});
//Define some Global Collections
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = require("fs").readdirSync(`./commands`);

client.config = config;
//Require the Handlers                  Add the antiCrash file too, if its enabled
["events", "commands", "slashCommands", settings.antiCrash ? "antiCrash" : null]
    .filter(Boolean)
    .forEach(h => {
        require(`./handlers/${h}`)(client);
    })
//Start the Bot
client.login(config.token)

// Set static files
app.use('/styles', express.static(__dirname + '/public/styles'));
app.use(express.static(__dirname + '/public'));

// Route index
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

// route theme images
app.use('/widget/theme-1', express.static('public/theme-1'));

// If static image has not been found, respond with unknown user.
app.get(['/widget/theme-1/*', '/widget/*'], function (req, res) {
    res.sendFile(path.join(__dirname+'/public/unknown_user.png'));
});

app.use(nocache());

if(config.webserver.enabled === true) {
    app.listen(config.webserver.port, () => {
        console.log(`Example app listening on port http://${config.webserver.domain}:${config.webserver.port}`)
    })
}
