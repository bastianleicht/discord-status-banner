const Canvas = require("canvas");
const {defaultPlayingHandler} = require("./defaultPlayingHandler");
const {spotifyHandler} = require("./apps/spotifyHandler");
module.exports.activityHandler = async function activityHandler(presence, status_text, color) {
    // create new Canvas
    const canvas = Canvas.createCanvas(395, 80);
    // make it "2D"
    const ctx = canvas.getContext('2d');

    let activityCanvas;

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
            let activityCanvas = await defaultPlayingHandler(activity, status_text, color);
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

    return canvas;
}