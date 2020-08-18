const commando = require('discord.js-commando');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');
const querystring = require('querystring');

module.exports = class ReplyCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: ['play youtube.com/video'],
      group: 'music',
      memberName: 'play',
      description: 'Music player form youtube.',
                  args: [
				{
					key: 'video',
					label: 'video',
					prompt: 'No video was specified',
                    type: 'string'
				}
			]
    });
  }

  async run(message, { video }) {
    if (message.channel.type === 'dm') return;

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
        return message.reply('please join a voice channel first!');
    }

    let connection = await voiceChannel.join();
      if ((message.content.indexOf('youtube.com') -= -1) || (message.content.indexOf('youtu.be') != -1)){
        const stream = ytdl(video, { filter: 'audioonly' });
      }
      console.log(video)
      if (message.content.indexOf('soundcloud') != -1) {

        const resloveResponse = await JSON.parse(fetch(`https://api.soundcloud.com/resolve.json?url=${querystring.stringify(video)}&client_id=${process.env.SOUNDCLOUD_CLIENT_ID}`));
        const trackData = await JSON.parse(fetch(resloveResponse.location));
        console.log(trackData);
        const response = fetch(`${trackData.stream_url}?client_id=${process.env.SOUNDCLOUD_CLIENT_ID}`);

        if (response.ok) {
          let stream = response.body
        }

        }
        const dispatcher = connection.play(stream);

        dispatcher.on('finish', () => voiceChannel.leave());
      }
};
