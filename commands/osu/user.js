const commando = require('discord.js-commando');
const Nodesu = require('nodesu');
const api = new Nodesu.Client(process.env.osu, {
    parseData: true
 });

module.exports = class AddNumbersCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'osuuser',
      group: 'osu',
      memberName: 'user',
      description: 'Gets osu! user info.',
      examples: ['add-numbers 42 1337'],

      args: [
        {
          key: 'username',
          label: 'username',
          prompt: 'What user?',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { username }) {
    // ... see docs/Modules:Components - typical usage = api.<component>.<function>();
    // most functions return Promise objects.
     
    // eg: get beatmap data
    const userdata = await api.user.get(username);
    return msg.reply(`${userdata}`);
  }
};
