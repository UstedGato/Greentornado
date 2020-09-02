const { MessageAttachment } = require("discord.js");
const faunadb = require('faunadb'),
  q = faunadb.query,
  client = new faunadb.Client({ secret: process.env.FAUNA_KEY })
  async function getSettings(id) {
    let settings;
    try {
        settings = await client.query(
            q.Get(
                q.Match(
                    q.Index("guildIndex"),
                    id
                )
            )
        ) 
        } catch (error) {
            return false
        }
    return settings
  }
exports.welcomeAUser = async function (member) {
  const settings = await getSettings(member.guild.id)
  if (!settings) return false
  const channel = await member.guild.channels.cache.find(ch => ch.id === settings.data.welcomeChannel);
  // Send the message, mentioning the member
  const Canvas = require('canvas');
  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext('2d');
  
  // Since the image takes time to load, you should await it
  const background = await Canvas.loadImage(`https://proxy.duckduckgo.com/iu/?u=${settings.data.background}`);
  // This uses the canvas dimensions to stretch the image onto the entire canvas
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      
  
  // Select the font size and type from one of the natively available fonts
  ctx.font = '50px sans-serif';
  // Select the style that will be used to fill the text in
  ctx.fillStyle = '#ffffff';
  // Actually fill the text with a solid color
  ctx.textAlign = "center"; 
  ctx.fillText(`Welcome ${member.displayName}!`, canvas.width / 2, canvas.height / 1.1);
  // Pick up the pen
  ctx.beginPath();
  // Start the arc to form a circle
  ctx.arc(canvas.width / 2.04, canvas.height / 2.8, 70, 0, Math.PI * 2, true);
  // Put the pen down
  ctx.closePath();
  // Clip off the region you drew on
  ctx.clip();
  const avatar = await Canvas.loadImage(`https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`);
  ctx.drawImage(avatar, canvas.width / 2.6, canvas.height / 20, 150, 150);
  const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
  console.log(member.id + "and" + member.user.avatar);
  await channel.send({ files: [ attachment ]});
  return true
}; 