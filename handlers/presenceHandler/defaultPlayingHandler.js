const Canvas = require("canvas");
module.exports.defaultPlayingHandler = async function defaultPlayingHandler(activity) {
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

    //console.log(activity_icon_small)
    //console.log(activity_icon_large)

    let activity_string = `${activity.state ?? activity.details}`;
    const trimmedString = activity_string.length > length ?
        activity_string.substring(0, length - 3) + "..." :
        activity_string

    //draw the status text
    ctx.font = '14px "Lato"';
    ctx.fillStyle = '#40b681';
    ctx.fillText(`Playing ${activity.name}`, 145, canvas.height / 2 + 8);

    if(activity.assets.smallImage !== null || activity.assets.largeImage !== null) {
        const logo = await Canvas.loadImage(activity_icon_small ?? activity_icon_large);
        // Render Image in Circle
        ctx.drawImage(logo, 90, (canvas.height / 2) + 14, 18, 18);
    }

    //draw the activity text
    ctx.font = '14px "Lato", Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(trimmedString, 115, canvas.height / 2 + 27);

    ctx.save();
    return canvas;
}
