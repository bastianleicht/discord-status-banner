const Canvas = require("canvas");
const {registerFont} = require("canvas");

registerFont('./assets/fonts/whitney-bold.otf', { family: 'Whitney' })
registerFont('./assets/fonts/HelveticaNeue-Medium.otf', { family: 'Helvetica Neue' })
registerFont('./assets/fonts/Lato-Regular.ttf', { family: 'Lato' })

module.exports.defaultPlayingHandler = async function defaultPlayingHandler(activity, status_text, color) {
    // create new Canvas
    const canvas = Canvas.createCanvas(395, 80);
    // make it "2D"
    const ctx = canvas.getContext('2d');

    const length = 38;

    let activity_icon_large = null;
    let activity_icon_small = null;

    //console.log(activity);

    let details = '';
    if(activity.details !== null) {
        details = '| ' + activity.details;
    }

    let activity_string = `${activity.name} ${details}`;
    const trimmedString = activity_string.length > length ?
        activity_string.substring(0, length - 3) + "..." :
        activity_string

    //draw the status text
    ctx.font = '14px "Lato"';
    ctx.fillStyle = color;
    ctx.fillText(status_text, 145, canvas.height / 2 + 8);

    /*
    if(activity.assets !== null) {
        if(activity.assets.largeImage !== null) {
            activity_icon_large = `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.largeImage}.png`;
        }

        if(activity.assets.smallImage !== null) {
            activity_icon_small = `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.smallImage}.png`;
        }

        //console.log(activity_icon_small)
        //console.log(activity_icon_large)

        const logo = await Canvas.loadImage(activity_icon_small ?? activity_icon_large);
        // Render Image in Circle
        ctx.drawImage(logo, 90, (canvas.height / 2) + 14, 18, 18);
    }
    */

    //draw the activity label
    ctx.font = 'bold 14px "Whitney"';
    ctx.fillStyle = '#c2c4c7';
    ctx.fillText('Playing:', 90, canvas.height / 2 + 27);

    //draw the activity text
    ctx.font = '14px "Lato", Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(trimmedString, 145, canvas.height / 2 + 27);

    ctx.save();
    return canvas;
}
