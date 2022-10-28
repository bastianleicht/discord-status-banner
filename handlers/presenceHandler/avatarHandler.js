const Canvas = require("canvas");
module.exports.avatarHandler = async function avatarHandler(avatar, color) {
    // create new Canvas
    const canvas = Canvas.createCanvas(395, 80);
    // make it "2D"
    const ctx = canvas.getContext('2d');

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

    ctx.save();
    return canvas;
}
