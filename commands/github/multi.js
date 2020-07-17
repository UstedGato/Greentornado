const { Command } = require('discord.js-commando');
const Embed = require("./../../utils/embed");
const embed1 = 
      {
        "title": "Woah",
        "description": "You can also have multiple embeds!"
      }
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'multi',
            group: 'github',
            memberName: 'multi',
            description: 'Check your coins.',
            examples: ['repeat'],
        });
    }
    async run(msg, { user }){
        Embed.sendhook(msg, [embed1]);

    }
};