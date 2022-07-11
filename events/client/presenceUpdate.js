const Canvas = require("canvas");
const Discord = require("discord.js");
const { registerFont, createCanvas } = require('canvas')

//here the event starts
module.exports = async (client, oldMember, newMember) => {
    //console.log(oldMember);
    //console.log(newMember);
    console.log(`Old Presence: ${oldMember.status} | New Presence: ${newMember.status}`);

    const canvas = Canvas.createCanvas(1772, 633);
    //make it "2D"
    const ctx = canvas.getContext('2d');
    //set the Background to the welcome.png
    const background = await Canvas.loadImage(`./welcome.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#f2f2f2';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    //set the first text string
    var textString3 = `${newMember.user.username}`;
    //if the text is too big then smaller the text
    if (textString3.length >= 14) {
        ctx.font = 'bold 100px "Roboto"';
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(textString3, 720, canvas.height / 2 + 20);
    }
    //else dont do it
    else {
        ctx.font = 'bold 150px "Roboto"';
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(textString3, 720, canvas.height / 2 + 20);
    }
    //define the Discriminator Tag
    var textString2 = `#${newMember.user.discriminator}`;
    ctx.font = 'bold 40px "Roboto"';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString2, 730, canvas.height / 2 + 58);
    //define the Member count
    var textString4 = `Member #${newMember.guild.memberCount}`;
    ctx.font = 'bold 60px "Roboto"';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString4, 750, canvas.height / 2 + 125);
    //get the Guild Name
    var textString4 = `${newMember.guild.name}`;
    ctx.font = 'bold 60px "Roboto"';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString4, 700, canvas.height / 2 - 150);
    //create a circular "mask"
    ctx.beginPath();
    ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true);//position of img
    ctx.closePath();
    ctx.clip();

    //define the user avatar
    const avatar = await Canvas.loadImage(newMember.user.displayAvatarURL({ format: 'jpg' }));

    //draw the avatar
    ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);

    //get it as a discord attachment
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    //define the welcome channel
    const channel = client.channels.cache.get('996038161153146882');
    //send the welcome embed to there
    channel.send({ files: [attachment] })
        .catch(console.error);

}
