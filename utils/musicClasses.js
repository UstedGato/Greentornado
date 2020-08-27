const ytdl = require('ytdl-core');
const fetch = require('node-fetch');
let queues = new Object();

module.exports.Player = class Player {
  constructor(URL, message) {
    this.URL = URL;
    this.message = message;
  }
  async play() {
    try {
    let stream;
    if (this.message.content.indexOf('youtube.com') === -1 && this.message.content.indexOf('soundcloud.com') !== -1) {
      
    }
    if (this.message.content.indexOf('youtube.com') !== -1 || this.message.content.indexOf('youtu.be') !== -1){
      stream = ytdl(this.URL, { filter: 'audioonly' });
    }
    if (this.message.content.indexOf('soundcloud.com') !== -1) {
      const resolve = await fetch(`https://api-v2.soundcloud.com/resolve?url=${this.URL}&client_id=${process.env.SOUNDCLOUD_CLIENT_ID}`);
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
        stream = response.body;
      }

      }
      this.message.react('✅');
      this.dispatcher = this.connection.play(stream);

      this.dispatcher.on('finish', () => this.guildQueue());
    } catch (error) {
      this.message.reply(`error playing \`\`${this.URL}: ${error}`);
    }
    }
};

module.exports.GuildQueue = class GuildQueue {
  constructor(voiceChannel, guild) {
    this.voiceChannel = voiceChannel;
    this.guild = guild;
    this.players = [];
  }
  async init() {
    this.connection = await this.voiceChannel.join();
    queues[this.guild.id] = this;
    this.players[0].connection = this.connection;
    this.players[0].guild = this.guild;
    this.players[0].guildQueue = this.next;
    await this.players[0].play();
  }
  async next() {
    queues[this.guild.id].players.shift();
    if (queues[this.guild.id].players[0]) {
      queues[this.guild.id].players[0].connection = queues[this.guild.id].connection;
      queues[this.guild.id].players[0].guild = queues[this.guild.id].guild;
      queues[this.guild.id].players[0].guildQueue = queues[this.guild.id].next;
      await queues[this.guild.id].players[0].play();
    }
    else {
      delete queues[this.guild.id];
      this.connection.channel.leave();
    }
  }

  async addPlayer(player) {
    this.players.push(player);
  }
};
module.exports.getQueues = function() {
  return queues;
};