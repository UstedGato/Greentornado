const commando = require('discord.js-commando');
const ytdl = require('ytdl-core');

module.exports = class ReplyCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: ['play youtube.com/video'],
      group: 'util',
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

    voiceChannel.join().then(connection => {
        const stream = ytdl(video, { filter: 'audioonly' });
        const dispatcher = connection.play(stream);

        dispatcher.on('finish', () => voiceChannel.leave());
    });
  }
};
