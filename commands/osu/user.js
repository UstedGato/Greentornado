const commando = require('discord.js-commando');
const Nodesu = require('nodesu');
const api = new Nodesu.Client(process.env.osu, {
    parseData: true
 });

module.exports = class AddNumbersCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'user',
      group: 'osu',
      memberName: 'user',
      description: 'Gets osu! user info.',
      examples: ['add-numbers 42 1337'],

      args: [
        {
          key: 'user',
          label: 'user',
          prompt: 'What user?',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { user }) {
    // ... see docs/Modules:Components - typical usage = api.<component>.<function>();
    // most functions return Promise objects.
     
    // eg: get beatmap data
    const userdata = await api.user.get(user);
    return msg.reply(`${userdata}`);
  }
};
