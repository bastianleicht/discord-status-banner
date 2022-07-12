const Canvas = require("canvas");
const Discord = require("discord.js");
const fs = require('fs')
const { registerFont, createCanvas } = require('canvas')
registerFont('./whitney-bold.otf', { family: 'Whitney' })

//here the event starts
module.exports = async (client, oldMember, newMember) => {
    //console.log(oldMember);
    //console.log(newMember);
    console.log(`Old Presence: ${oldMember.status} | New Presence: ${newMember.status}`);

    const canvas = Canvas.createCanvas(395, 80);
    //make it "2D"
    const ctx = canvas.getContext('2d');
    //set the Background to the welcome.png

    // 395 x 80 px
    const background = await Canvas.loadImage(`./banner1-1.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    //ctx.strokeStyle = '#f2f2f2';
    //ctx.strokeRect(0, 0, canvas.width, canvas.height);
    //define the Username
    const username = `${newMember.user.username}#${newMember.user.discriminator}`;
    //if the text is too big then smaller the text
    if (username.length >= 14) {
        ctx.font = 'bold 15px "Whitney"';
        ctx.fillStyle = '#bec1c6';
        ctx.fillText(username, 88, canvas.height / 2 - 20);
    }
    //else dont do it
    else {
        ctx.font = 'bold 30px "Whitney"';
        ctx.fillStyle = '#bec1c6';
        ctx.fillText(username, 70, canvas.height / 2 + 20);
    }
    //define the Member count
    var textString4 = `Member #${newMember.guild.memberCount}`;
    ctx.font = 'bold 60px "Roboto"';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString4, 10, canvas.height / 2 + 125);
    //get the Guild Name
    var textString4 = `${newMember.guild.name}`;
    ctx.font = 'bold 60px "Roboto"';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString4, 30, canvas.height / 2 - 150);

    // Discord Logo
    const discord_logo = await Canvas.loadImage(`./discord-logo-1.png`);

    //draw the discord logo
    ctx.drawImage(discord_logo, 316, (canvas.height / 2) - 5, 69.4, 20);

    //create a circular "mask"
    ctx.beginPath();
    ctx.arc(40, canvas.height / 2, 34, 0, Math.PI * 2, true);//position of img
    ctx.closePath();
    ctx.clip();

    //define the user avatar
    const avatar = await Canvas.loadImage(newMember.user.displayAvatarURL({ format: 'jpg' }));

    //draw the avatar
    ctx.drawImage(avatar, 5, (canvas.height / 2) - 35, 68, 68);

    //get it as a discord attachment
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png');

    //define the welcome channel
    const channel = client.channels.cache.get('996038161153146882');
    //send the welcome embed to there
    channel.send({ files: [attachment] })
        .catch(console.error);

    channel.send(newMember.status);

    let embed = new Discord.MessageEmbed();

    if (!newMember.activities || newMember.activities.length === 0) {
        embed.addField('⚽️ Activity:', 'Not playing anything')
    } else {
        const activity = newMember.activities[0];
        embed.addField('⚽️ Activity:', `${activity.type} ${activity.name}\n${activity.details}\n${activity.state}`);
    }

    channel.send({ content: `test`, embeds: [embed]});

    //const out = fs.createWriteStream(__dirname + '/test.png')
    const out = fs.createWriteStream('./test.png')
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', () =>  console.log('The PNG file was created.'))

}
