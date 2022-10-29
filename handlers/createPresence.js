const Canvas = require("canvas");
const Discord = require("discord.js");
const fs = require("fs");
const fetch = require('isomorphic-unfetch')
const {registerFont} = require("canvas");
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch)

const {customBackgroundHandler} = require("./presenceHandler/customBackgroundHandler");
const {defaultPlayingHandler} = require("./presenceHandler/defaultPlayingHandler");
const {spotifyHandler} = require("./presenceHandler/apps/spotifyHandler");
const {avatarHandler} = require("./presenceHandler/avatarHandler");

registerFont('./assets/fonts/whitney-bold.otf', { family: 'Whitney' })
registerFont('./assets/fonts/HelveticaNeue-Medium.otf', { family: 'Helvetica Neue' })
registerFont('./assets/fonts/Lato-Regular.ttf', { family: 'Lato' })

module.exports.createPresence = createPresence;

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

// https://stackoverflow.com/a/1199420
const StringHelper = str => {
    const sliceBoundary = str => str.substr(0, str.lastIndexOf(" "));
    const truncate = (n, useWordBoundary) =>
        str.length <= n ? str : `${ useWordBoundary
            ? sliceBoundary(str.slice(0, n - 1))
            : str.slice(0, n - 1)}...`;
    return { full: str,  truncate };
};

async function createPresence(client, user, presence) {
    if(user.bot) return;
    let backgroundCanvas, activityCanvas, avatarCanvas;

    // create "main" Canvas
    const canvas = Canvas.createCanvas(395, 80);
    // make it "2D"
    const ctx = canvas.getContext('2d');

    // 395 x 80 px
    let custom_bg = false;
    if(custom_bg === true) {
        // TODO: Load Images from URL
        const background = await Canvas.loadImage(`./test-bg.png`);
        backgroundCanvas = await customBackgroundHandler(background);
        // Append backgroundCanvas to main canvas.
        ctx.drawImage(backgroundCanvas, 0, 0);
    } else {
        const background = await Canvas.loadImage(`./background-1.png`);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }

    //define the Username
    const username = `${user.username}#${user.discriminator}`;
    //if the text is too big then smaller the text
    ctx.font = 'bold 15px "Whitney", Arial';
    ctx.fillStyle = '#bec1c6';
    ctx.fillText(username, 88, canvas.height / 2 - 20);

    // Status Logic
    let color, status_text, status_icon;

    switch (presence?.status) {
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
            status_text = "Offline";
            status_icon = "./assets/offline.png";
    }

    //draw the status label
    ctx.font = 'bold 14px "Whitney"';
    ctx.fillStyle = '#c2c4c7';
    ctx.fillText('Status:', 90, canvas.height / 2 + 8);

    if (!presence?.activities || presence?.activities.length === 0) {
        // NOTE: No activity found

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
        // NOTE: Activity was found
        let activity = presence.activities[0];

        // Always select the Last "added" activity. Else it would always display the Custom Status.
        // TODO: Add Setting to change this.
        if(presence.activities.length > 1) {
            activity = presence.activities[presence.activities.length - 1];
        }

        if(activity.type === "CUSTOM") {
            //draw the status text
            ctx.font = '14px "Lato"';
            ctx.fillStyle = color;
            ctx.fillText(status_text, 145, canvas.height / 2 + 8);

            //draw the activity text
            ctx.font = '14px "Lato"';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(activity.state, 90, canvas.height / 2 + 27);
        } else if(activity.type === 'PLAYING') {
            activityCanvas = await defaultPlayingHandler(activity);
            ctx.drawImage(activityCanvas, 0, 0);
        } else if(activity.type === 'LISTENING') {
            let length = 38;

            let activity_icon_large = null;
            let activity_icon_small = null;

            console.log(activity);
            if(activity.assets?.largeImage !== null) {
                activity_icon_large = `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.largeImage}.png`;
            }

            if(activity.assets?.smallImage !== null) {
                activity_icon_small = `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.smallImage}.png`;
            }

            //console.log(activity_icon_small);
            //console.log(activity_icon_large);

            switch (activity.name) {
                case "Spotify": {
                    activityCanvas = await spotifyHandler(activity);
                    ctx.drawImage(activityCanvas, 0, 0);
                } break;

                default: {
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

                    //draw the status text
                    ctx.font = '14px "Lato"';
                    ctx.fillStyle = color;
                    ctx.fillText(trimmedString, 145, canvas.height / 2 + 27);
                }
            }

        }
    }

    // Discord Logo
    const discord_logo = await Canvas.loadImage(`./assets/discord-logo.png`);

    //draw the discord logo
    ctx.drawImage(discord_logo, 316, (canvas.height / 2) - 35, 69.4, 20);

    // create the User Avatar and Status dot
    const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));
    avatarCanvas = await avatarHandler(avatar, color);
    ctx.drawImage(avatarCanvas, 0, 0);

    // get the Image as a discord attachment
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png');

    //define the channel (DEBUG)
    const log_channel = client.channels.cache.get('1035282377947222026');

    //const out = fs.createWriteStream(__dirname + '/test.png')
    const out = fs.createWriteStream(`./public/theme-1/${user.id}.png`)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', () =>  {
        console.log('The PNG file was created.');
        //log_channel.send({ content: `<@ ${guildMember.user.id}> Your Status Updated \n <https://discord.bastianleicht.de/widget/theme-1/${guildMember.user.id}.png>`, files: [attachment]})
    });

    return canvas;
}
