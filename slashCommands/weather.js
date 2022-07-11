const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const weather = require('weather-js');
module.exports = {
    name: "weather", //the command name for the Slash Command
    description: "Gives you the Weather Information of the provided Location", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
        //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
        //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
        //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
        //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
        {"String": { name: "location", description: "Den Wetterstandort? ", required: true }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
    ],
    run: async (client, interaction) => {
        try{
            //console.log(interaction, StringOption)

            //things u can directly access in an interaction!
            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            const { guild } = member;
            //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
            const location = options.getString("location"); //same as in StringChoices
            //let UserOption = options.getUser("OPTIONNAME");
            //let ChannelOption = options.getChannel("OPTIONNAME");
            //let RoleOption = options.getRole("OPTIONNAME");

            //await interaction.reply({content: `Getting the current Weather Information...`, ephemeral: true});

            weather.find({search: location, degreeType: 'C'}, async function (err, result) {
                try {
                    let embed = new MessageEmbed()
                        .setTitle(`Wettevorhersage - ${result[0].location.name}`)
                        .setColor("#FF8000")
                        .addField("Beschreibung", result[0].current.skytext, true)
                        .addField("Temperatur", `${result[0].current.temperature} Celsius`, true)
                        .addField("Luftfeuchtigkeit", result[0].current.humidity, true)
                        .addField("Windgeschwindigkeit", result[0].current.windspeed, true)//What about image
                        .addField("Beobachtungszeit", result[0].current.observationtime, true)
                        .addField("Windanzeige", result[0].current.winddisplay, true)
                        .setThumbnail(result[0].current.imageUrl)
                    await interaction.reply({embeds: [embed], ephemeral: false});

                } catch (err) {
                    console.log(String(err.stack).bgRed)
                    await interaction.reply.editReply({
                        content: "Die Daten des angegebenen Standorts können nicht abgerufen werden!",
                        ephemeral: false
                    });
                }
            });

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}
