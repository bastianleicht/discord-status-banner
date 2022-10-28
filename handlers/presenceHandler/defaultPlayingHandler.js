const Canvas = require("canvas");
module.exports.defaultPlayingHandler = async function defaultPlayingHandler(activity, status_text, color) {
    // create new Canvas
    const canvas = Canvas.createCanvas(395, 80);
    // make it "2D"
    const ctx = canvas.getContext('2d');

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

    ctx.save();

    return canvas;
}
