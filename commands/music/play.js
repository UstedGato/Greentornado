const commando = require('discord.js-commando');
const { Player, GuildQueue, getQueues } = require('./../../utils/musicClasses');
const search = require('youtube-search');

module.exports = class ReplyCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: ['play youtube.com/url'],
      group: 'music',
      memberName: 'play',
      hidden: true, //i need to fix it y e s
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
    const voiceChannel = message.member.voice.channel;
    if (url.indexOf('youtube.com') === -1 && url.indexOf('soundcloud.com') === -1) {
      console.log('searching')
      const ytsearch = await search(url, {
        maxResults: 1,
        key: process.env.YOUTUBE_KEY
      });
      url = ytsearch.results[0].link
    }
    if (!voiceChannel) {
        return message.reply('Please join a voice channel first!');
    }
    const player = new Player(url, message);
    let queues = getQueues();
    if (queues[message.guild.id]) {
      if(!message.guild.voice){
      delete queues[message.guild.id]
      const queue = new GuildQueue(voiceChannel, message.guild);
      await queue.addPlayer(player);
      await queue.init();
      message.reply('Created a new queue.')
      return;
      }
      queues[message.guild.id].addPlayer(player);
      message.reply(`Added ${url} to the queue.`)
    }
    else {
      const queue = new GuildQueue(voiceChannel, message.guild);
      await queue.addPlayer(player);
      await queue.init();
      message.reply('Created a new queue.')
    }

  }
};
