const commando = require('discord.js-commando');
const { Player, GuildQueue, getQueues } = require('./../../utils/musicClasses');

module.exports = class ReplyCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: ['play youtube.com/url'],
      group: 'music',
      memberName: 'play',
      description: 'Music player.',
                  args: [
				{
					key: 'url',
					label: 'url',
					prompt: 'No url was specified',
                    type: 'string'
				}
			]
    });
  }

  async run(message, { url }) {
    if (message.channel.type === 'dm') return;
    if (message.content.indexOf('youtu') === -1 && message.content.indexOf('soundcloud') === -1){
      return message.reply('Invalid link.');
    }
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
        return message.reply('Please join a voice channel first!');
    }
    const player = new Player(url, message);
    let queues = getQueues();
    if (queues[message.guild.id]) {
      queues[message.guild.id].addPlayer(player);
    }
    else {
      const queue = new GuildQueue(voiceChannel, message.guild);
      await queue.addPlayer(player);
      await queue.init();
    }

  }
};
