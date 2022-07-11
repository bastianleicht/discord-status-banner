const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { duration } = require("../../handlers/functions")
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "uptime", //the command name for execution & for helpcmd [OPTIONAL]
    category: "Information", //the command category for helpcmd [OPTIONAL]
    aliases: [], //the command aliases for helpcmd [OPTIONAL]
    cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
    usage: "uptime", //the command usage for helpcmd [OPTIONAL]
    description: "Returns the duration on how long the Bot is online", //the command description for helpcmd [OPTIONAL]
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try{
      message.reply({embeds: [new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`:white_check_mark: **${client.user.username}** is since:\n ${duration(client.uptime)} online`)]
      });
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.reply({embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
        ]});
    }
  }
}

