const Canvas = require("canvas");
const fetch = require('isomorphic-unfetch');
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch);

// https://stackoverflow.com/a/1199420
const StringHelper = str => {
    const sliceBoundary = str => str.substr(0, str.lastIndexOf(" "));
    const truncate = (n, useWordBoundary) =>
        str.length <= n ? str : `${ useWordBoundary
            ? sliceBoundary(str.slice(0, n - 1))
            : str.slice(0, n - 1)}...`;
    return { full: str,  truncate };
};

module.exports.spotifyHandler = async function spotifyHandler(activity) {
    // create new Canvas
    const canvas = Canvas.createCanvas(395, 80);
    // make it "2D"
    const ctx = canvas.getContext('2d');

    let spotifyData;
    await getDetails('https://open.spotify.com/track/' + activity.syncId).then(data => spotifyData = data);

    let song_string = `${spotifyData.preview.title} - ${spotifyData.preview.artist}`;

    // https://stackoverflow.com/a/23161562
    const uppercaseCount = song_string.length - song_string.replace(/[A-Z]/g, '').length;
    if(uppercaseCount >= 20) {
        length = 29;
    } else {
        length = 35;
    }

    const trimmedString = StringHelper(song_string).truncate(length)

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
    cover_ctx.arc(370, (song_cover_canvas.height / 2) + 14, 25.5, 0, Math.PI * 2, true);
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

    ctx.save();
    return canvas;
}
