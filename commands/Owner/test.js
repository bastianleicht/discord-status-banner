const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { createPresence, createPresenceTheme1} = require("../../handlers/createPresence");
const {GetUser} = require("../../handlers/functions");
const Discord = require("discord.js");
module.exports = {
    name: "test",
    category: "Owner",
    aliases: ["t"],
    cooldown: 5,
    usage: "test",
    description: "Tests the Presence Generation",
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: settings.ownerIDS, //Only allow specific Users to execute a Command [OPTIONAL]
    minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
    maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
    minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        try{
            let user = await GetUser(message, args)
            let member = message.guild.members.cache.get(user.id);
            let canvas = await createPresence(client, user, member.presence);
            let canvasTheme1 = await createPresenceTheme1(client, user, member.presence);

            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png');
            const attachment2 = new Discord.MessageAttachment(canvasTheme1.toBuffer(), 'canvasTheme1.png');

            message.reply({ content: `<@${user.id}> Your Status Updated \n <https://discord.bastianleicht.de/widget/theme-1/${user.id}.png>`, files: [attachment]})
            message.reply({ content: `<@${user.id}> Your Status Updated (Theme1) \n <https://discord.bastianleicht.de/widget/theme-1/${user.id}.png>`, files: [attachment2]})
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

