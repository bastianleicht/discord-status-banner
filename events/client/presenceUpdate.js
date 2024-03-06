const {createPresence} = require("../../handlers/createPresence");
const Discord = require("discord.js");

//here the event starts
module.exports = async (client, oldMember, newMember) => {
    //console.log(oldMember);
    //console.log(newMember);
    console.log(`Old Presence: ${oldMember.status} | New Presence: ${newMember.status}`);

    const user = await client.users.fetch(newMember.userId);
    let canvas = await createPresence(client, user, newMember);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png');
    const log_channel = client.channels.cache.get(client.config.presence_log_channel);
    log_channel.send({ content: `<@${user.id}> Your Status Updated \n <https://${client.config.webserver.domain}:${client.config.webserver.port}/widget/theme-1/${user.id}.png>`, files: [attachment]})

    /*
    const canvas = Canvas.createCanvas(395, 80);
    //make it "2D"
    const ctx = canvas.getContext('2d');

    // 395 x 80 px
    const background = await Canvas.loadImage(`./banner1-1.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    //define the Username
    const username = `${newMember.user.username}#${newMember.user.discriminator}`;
    //if the text is too big then smaller the text
    ctx.font = 'bold 15px "Whitney"';
    ctx.fillStyle = '#bec1c6';
    ctx.fillText(username, 88, canvas.height / 2 - 20);

    // Status Logic
    let color, status_text, status_icon;

    switch (newMember.status) {
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

    //draw the status text
    ctx.font = '14px "Lato"';
    ctx.fillStyle = color;
    ctx.fillText(status_text, 145, canvas.height / 2 + 8);

    if (!newMember.activities || newMember.activities.length === 0) {
        //draw the activity label
        ctx.font = 'bold 14px "Whitney"';
        ctx.fillStyle = '#c2c4c7';
        ctx.fillText('Playing:', 90, canvas.height / 2 + 27);

        //draw the status text
        ctx.font = 'italic 13px "Lato"';
        ctx.fillStyle = '#7c7c7c';
        ctx.fillText('Currently not running any process/game.', 145, canvas.height / 2 + 27);
    } else {
        const activity = newMember.activities[0];
        if(activity.type === "CUSTOM") {
            //draw the status text
            ctx.font = '14px "Lato"';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(activity.state, 90, canvas.height / 2 + 27);
        } else if(activity.type === 'PLAYING') {
            const length = 38;

            let activity_icon_large = null;
            let activity_icon_small = null;

            console.log(activity);
            if(activity.assets.largeImage !== null) {
                activity_icon_large = `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.largeImage}.png`;
            }

            if(activity.assets.smallImage !== null) {
                activity_icon_small = `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.smallImage}.png`;
            }

            let activity_string = `${activity.name} | ${activity.details}`;
            const trimmedString = activity_string.length > length ?
                activity_string.substring(0, length - 3) + "..." :
                activity_string

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
    const avatar = await Canvas.loadImage(newMember.user.displayAvatarURL({ format: 'jpg' }));

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

    //define the welcome channel
    const test_channel = client.channels.cache.get('996038161153146882');
    const log_channel = client.channels.cache.get('997570518037315744');


    //send the welcome embed to there
    test_channel.send({ files: [attachment] })
        .catch(console.error);

    test_channel.send(newMember.status);

    let embed = new Discord.MessageEmbed();

    if (!newMember.activities || newMember.activities.length === 0) {
        embed.addField('⚽️ Activity:', 'Not playing anything')
    } else {
        const activity = newMember.activities[0];
        console.log(activity);
        embed.addField('⚽️ Activity:', `${activity.type} ${activity.name}\n${activity.details}\n${activity.state}`);
    }

    test_channel.send({ content: `test`, embeds: [embed]});

    //const out = fs.createWriteStream(__dirname + '/test.png')
    const out = fs.createWriteStream(`./public/theme-1/${newMember.user.id}.png`)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', () =>  {
            console.log('The PNG file was created.');
            log_channel.send({ content: `<@${newMember.user.id}> Your Status Updated \n <https://discord.bastianleicht.de/widget/theme-1/${newMember.user.id}.png>`, files: [attachment]})
    });
     */

}
