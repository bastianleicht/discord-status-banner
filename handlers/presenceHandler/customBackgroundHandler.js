const Canvas = require("canvas");
module.exports.customBackgroundHandler = async function customBackgroundHandler(background) {
    // create new Canvas
    const canvas = Canvas.createCanvas(395, 80);
    // make it "2D"
    const ctx = canvas.getContext('2d');

    ctx.drawImage(background,
        canvas.height / 2 - 20,
        -25,
        435,
        130
    );

    /*
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.drawImage(background,-background.width/2,-background.height/2);
    ctx.translate(-canvas.width/2,-canvas.height/2);
     */

    // Faded image created with: https://jsfiddle.net/4hu3sxzy/2/
    const background_fade = await Canvas.loadImage(`./assets/theme-2/background-faded.png`);
    ctx.drawImage(background_fade, 0, 0, canvas.width, canvas.height);
    ctx.save();

    return canvas;
}
