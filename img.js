import fs from "fs";
import Canvas from "canvas";
/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    }
    else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}
async function draw() {
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    // Since the image takes time to load, you should await it
    const background = await Canvas.loadImage('./wallpaper.png');
    // This uses the canvas dimensions to stretch the image onto the entire canvas
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.fillStyle = "rgba(255, 255, 0, .5)";
    roundRect(ctx, 50, 50, 600, 200, true);
    // Select the font size and type from one of the natively available fonts
    ctx.font = '60px sans-serif';
    // Select the style that will be used to fill the text in
    ctx.fillStyle = '#ffffff';
    // Actually fill the text with a solid color
    ctx.textAlign = "center";
    ctx.fillText('Welcome AAGaming!', canvas.width / 2, canvas.height / 1.1);
    // Pick up the pen
    ctx.beginPath();
    // Start the arc to form a circle
    ctx.arc(canvas.width / 2.04, canvas.height / 2.8, 70, 0, Math.PI * 2, true);
    // Put the pen down
    ctx.closePath();
    // Clip off the region you drew on
    ctx.clip();
    const avatar = await Canvas.loadImage("https://cdn.discordapp.com/avatars/634500033366065186/e31c1191cff7699f973b87f25c8f3bd3.png?size=2048");
    ctx.drawImage(avatar, canvas.width / 2.6, canvas.height / 20, 150, 150);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./test.png', buffer);
}
draw();
