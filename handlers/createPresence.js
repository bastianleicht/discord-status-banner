const Canvas = require("canvas");
const Discord = require("discord.js");
const fs = require("fs");
const config = require(`../botconfig/config.json`);
const fetch = require('isomorphic-unfetch')
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch)
module.exports.createPresence = createPresence

function roundedImage(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

async function createPresence(client, guildMember) {
    //console.log(guildMember.presence);
    //return null;

    if(guildMember.user.bot) {
        return;
    }

    //const cachedMember = guild.members.cache.get(memberPresence.userId);

    const canvas = Canvas.createCanvas(395, 80);
    //make it "2D"
    const ctx = canvas.getContext('2d');

    // 395 x 80 px
    const background = await Canvas.loadImage(`./banner1-1.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    //define the Username
    const username = `${guildMember.user.username}#${guildMember.user.discriminator}`;
    //if the text is too big then smaller the text
    ctx.font = 'bold 15px "Whitney"';
    ctx.fillStyle = '#bec1c6';
    ctx.fillText(username, 88, canvas.height / 2 - 20);

    // Status Logic
    let color, status_text, status_icon;

    switch (guildMember.presence?.status) {
        case "online":
            color = "#43b581";
            status_text = "Online";
            status_icon = "./assets/online.png";
            break;

        case "idle":
            color = "#fda317";
            status_text = "Idle";
            status_icon = "./assets/idle.png";
            break;

        case "dnd":
            color = "#f2474d";
            status_text = "Do Not Disturb";
            status_icon = "./assets/dnd.png";
            break;

        case "offline":
            color = "#747f8d";
            status_text = "Offline";
            status_icon = "./assets/offline.png";
            break;

        case "streaming":
            color = "#747f8d";
            status_text = "Streaming";
            status_icon = "./assets/streaming.png";
            break;

        default:
            color = "#747f8d";
            status_text = "Unknown";
            status_icon = "./assets/offline.png";
    }

    //draw the status label
    ctx.font = 'bold 14px "Whitney"';
    ctx.fillStyle = '#c2c4c7';
    ctx.fillText('Status:', 90, canvas.height / 2 + 8);

    if (!guildMember.presence?.activities || guildMember.presence?.activities.length === 0) {
        //draw the status text
        ctx.font = '14px "Lato"';
        ctx.fillStyle = color;
        ctx.fillText(status_text, 145, canvas.height / 2 + 8);

        //draw the activity label
        ctx.font = 'bold 14px "Whitney"';
        ctx.fillStyle = '#c2c4c7';
        ctx.fillText('Playing:', 90, canvas.height / 2 + 27);

        //draw the status text
        ctx.font = 'italic 13px "Lato"';
        ctx.fillStyle = '#7c7c7c';
        ctx.fillText('Currently not running any process/game.', 145, canvas.height / 2 + 27);
    } else {
        let activity = guildMember.presence.activities[0];

        // Always select the Last "added" activity. Else it would always display the Custom Status.
        // TODO: Add Setting to change this.
        if(guildMember.presence.activities.length > 1) {
            activity = guildMember.presence.activities[guildMember.presence.activities.length - 1];
        }

        if(activity.type === "CUSTOM") {
            //draw the status text
            ctx.font = '14px "Lato"';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(activity.state, 90, canvas.height / 2 + 27);
        } else if(activity.type === 'PLAYING') {
            const length = 38;

            let activity_icon_large = null;
            let activity_icon_small = null;

            //console.log(activity);
            if(activity.assets?.largeImage !== null) {
                activity_icon_large = `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.largeImage}.png`;
            }

            if(activity.assets?.smallImage !== null) {
                activity_icon_small = `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.smallImage}.png`;
            }

            let activity_string = `${activity.name} | ${activity.details}`;
            const trimmedString = activity_string.length > length ?
                activity_string.substring(0, length - 3) + "..." :
                activity_string

            //draw the status text
            ctx.font = '14px "Lato"';
            ctx.fillStyle = color;
            ctx.fillText(status_text, 145, canvas.height / 2 + 8);

            //draw the activity label
            ctx.font = 'bold 14px "Whitney"';
            ctx.fillStyle = '#c2c4c7';
            ctx.fillText('Playing:', 90, canvas.height / 2 + 27);

            //draw the activity text
            ctx.font = '14px "Lato"';
            ctx.fillStyle = color;
            ctx.fillText(trimmedString, 145, canvas.height / 2 + 27);
        }
    }

    // Discord Logo
    const discord_logo = await Canvas.loadImage(`./discord-logo-1.png`);

    //draw the discord logo
    //ctx.drawImage(discord_logo, 316, (canvas.height / 2) - 35, 69.4, 20);

    //create a circular avatar "mask"
    //ctx.beginPath();
    //ctx.arc(40, canvas.height / 2, 34, 0, Math.PI * 2, true);//position of img
    //ctx.closePath();
    //ctx.clip();

    //define the user avatar
    const avatar = await Canvas.loadImage(guildMember.user.displayAvatarURL({ format: 'jpg' }));

    // Create Avatar Circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(40, (canvas.height / 2), 34, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    // Render Image in Circle
    ctx.drawImage(avatar, 6, (canvas.height / 2) - 34, 68, 68);


    ctx.beginPath();
    ctx.arc(5, (canvas.height / 2) - 35, 34, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.restore();

    // Draw Status Circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(62, (canvas.height / 2) + 21, 7, 0, 2 * Math.PI);
    ctx.fill();
    // Outline with background Color
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1b1e21';
    ctx.stroke();

    //draw the status icon
    //const s_icon = await Canvas.loadImage(status_icon);
    //ctx.drawImage(s_icon, 55, (canvas.height / 2) + 15, 14, 14);

    //get it as a discord attachment
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png');

    //define the channel
    const log_channel = client.channels.cache.get('1035282377947222026');

    //const out = fs.createWriteStream(__dirname + '/test.png')
    const out = fs.createWriteStream(`./public/theme-1/${guildMember.user.id}.png`)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', () =>  {
        console.log('The PNG file was created.');
        //log_channel.send({ content: `<@ ${guildMember.user.id}> Your Status Updated \n <https://discord.bastianleicht.de/widget/theme-1/${guildMember.user.id}.png>`, files: [attachment]})
    });

}
