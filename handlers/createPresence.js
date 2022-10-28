const Canvas = require("canvas");
const Discord = require("discord.js");
const fs = require("fs");
const fetch = require('isomorphic-unfetch')
const {registerFont} = require("canvas");
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch)
registerFont('./assets/fonts/whitney-bold.otf', { family: 'Whitney' })
registerFont('./assets/fonts/HelveticaNeue-Medium.otf', { family: 'Helvetica Neue' })
registerFont('./assets/fonts/Lato-Regular.ttf', { family: 'Lato' })

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

async function createPresence(client, user, presence) {
    if(user.bot) return;

    const canvas = Canvas.createCanvas(395, 80);
    //make it "2D"
    const ctx = canvas.getContext('2d');

    // 395 x 80 px
    const background = await Canvas.loadImage(`./background-1.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    //define the Username
    const username = `${user.username}#${user.discriminator}`;
    //if the text is too big then smaller the text
    ctx.font = 'bold 15px "Whitney"';
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
        let activity = presence.activities[0];

        // Always select the Last "added" activity. Else it would always display the Custom Status.
        // TODO: Add Setting to change this.
        if(presence.activities.length > 1) {
            activity = presence.activities[presence.activities.length - 1];
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

            if(activity.name === "Spotify") {
                let spotifyData;
                await getDetails('https://open.spotify.com/track/' + activity.syncId).then(data => spotifyData = data);

                /*
                let trackQuery = 'https://api.spotify.com/v1/tracks/' + activity.syncId;
                let spotifyResponse = {};
                await axios.get(trackQuery, {
                    headers: {
                        Authorization: `Bearer ${config.spotify.oauth}` }
                }).then(response => spotifyResponse = response.data);

                //console.log(spotifyResponse)
                let json = JSON.parse(JSON.stringify(spotifyResponse));

                console.log(json)

                let artistsCount = json.artists.length;
                //"images": [
                //       {
                //         "height": 64,
                //         "url": "https://i.scdn.co/image/ab67616d00004851697139b846fe2e76b86c8f21",
                //         "width": 64
                //       },
                //       {
                //         "height": 300,
                //         "url": "https://i.scdn.co/image/ab67616d00001e02697139b846fe2e76b86c8f21",
                //         "width": 300
                //       },
                //       {
                //         "height": 640,
                //         "url": "https://i.scdn.co/image/ab67616d0000b273697139b846fe2e76b86c8f21",
                //         "width": 640
                //       }
                //     ],
                let songCover = json.album.images[1];

                console.log(json.artists)

                let featured = "";
                for (let i = 1; i <= artistsCount; i++) {
                    featured += ', ' + json.artists[i].name;
                }

                let song_string = `${json.album.name} - ${json.artists[0].name} ${featured}`;

                const trimmedString = song_string.length > length ?
                    song_string.substring(0, length - 3) + "..." :
                    song_string
                 */

                //console.log(spotifyData);

                let song_string = `${spotifyData.preview.title} - ${spotifyData.preview.artist}`;

                length = 29;
                const trimmedString = song_string.length > length ?
                    song_string.substring(0, length - 3) + "..." :
                    song_string

                let status_text = `Listening to ${activity.name}`;

                const song_cover_canvas = Canvas.createCanvas(395, 80);
                //make it "2D"
                const cover_ctx = song_cover_canvas.getContext('2d');

                //draw the status text
                cover_ctx.font = '14px "Lato"';
                cover_ctx.fillStyle = '#40b681';
                cover_ctx.fillText(status_text, 145, song_cover_canvas.height / 2 + 8);

                //draw the activity label
                /*
                ctx.font = 'bold 14px "Whitney"';
                ctx.fillStyle = '#c2c4c7';
                ctx.fillText('Playing:', 90, canvas.height / 2 + 27);
                */
                const spotify_logo = await Canvas.loadImage('./assets/spotify_18x18.png');
                // Render Image in Circle
                cover_ctx.drawImage(spotify_logo, 90, (song_cover_canvas.height / 2) + 14, 18, 18);

                //draw the activity text
                cover_ctx.font = '14px "Lato"';
                cover_ctx.fillStyle = '#FFFFFF';
                cover_ctx.fillText(trimmedString, 110, canvas.height / 2 + 27);

                // TODO: Start
                // TODO: Redo the rounded Corners!
                // Create Avatar Circle
                cover_ctx.save();
                cover_ctx.beginPath();
                cover_ctx.arc(370, (song_cover_canvas.height / 2) + 14, 25, 0, Math.PI * 2, true);
                cover_ctx.closePath();
                cover_ctx.clip();

                let song_cover = await Canvas.loadImage(spotifyData.preview.image);
                // Render Image in Circle
                cover_ctx.drawImage(song_cover, 350, (song_cover_canvas.height / 2) - 6, 40, 40);
                // TODO: End

                ctx.drawImage(song_cover_canvas, 0, 0);

                //TODO TEST
                //const attachment = new Discord.MessageAttachment(song_cover_canvas.toBuffer(), 'image.png');
                //const log_channel = client.channels.cache.get('1035282377947222026');
                //log_channel.send({ content: `TEST`, files: [attachment]})
                // TODO TEST
            } else {
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

    // Discord Logo
    const discord_logo = await Canvas.loadImage(`./assets/discord-logo.png`);

    //draw the discord logo
    ctx.drawImage(discord_logo, 316, (canvas.height / 2) - 35, 69.4, 20);

    //create a circular avatar "mask"
    //ctx.beginPath();
    //ctx.arc(40, canvas.height / 2, 34, 0, Math.PI * 2, true);//position of img
    //ctx.closePath();
    //ctx.clip();

    //define the user avatar
    const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));

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
    const out = fs.createWriteStream(`./public/theme-1/${user.id}.png`)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', () =>  {
        console.log('The PNG file was created.');
        //log_channel.send({ content: `<@ ${guildMember.user.id}> Your Status Updated \n <https://discord.bastianleicht.de/widget/theme-1/${guildMember.user.id}.png>`, files: [attachment]})
    });

    return canvas;
}
