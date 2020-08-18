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
    let stream;
    let connection = await voiceChannel.join();
      if (message.content.indexOf('youtu') !== -1){
        stream = ytdl(video, { filter: 'audioonly' });
      }
      message.react('✅')
      if (message.content.indexOf('soundcloud') != -1) {
        const resolve = await fetch(`https://api-v2.soundcloud.com/resolve?url=${video}&client_id=${process.env.SOUNDCLOUD_CLIENT_ID}`);
        const resolveResponse = await resolve.json();
        let streamApiUrl;
        for (let i = 0; i < resolveResponse.media.transcodings.length; i++) {
          if (resolveResponse.media.transcodings[i].format.protocol === "progressive") {
            streamApiUrl = resolveResponse.media.transcodings[i].url;
            break;
          }
        } 

        const streamUrl = await fetch(`${streamApiUrl}?client_id=${process.env.SOUNDCLOUD_CLIENT_ID}`);
        const streamUrlResponse = await streamUrl.json();
        const response = await fetch(`${streamUrlResponse.url}`);

        if (response.ok) {
          stream = response.body
        }

        }
        const dispatcher = connection.play(stream);

        dispatcher.on('finish', () => voiceChannel.leave());
      }
};
