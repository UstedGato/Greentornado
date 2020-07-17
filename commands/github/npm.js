const { Command } = require('discord.js-commando');
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'npm',
            group: 'github',
            memberName: 'npm',
            description: 'Check NPM module stats.',
            examples: ['repeat'],
            
            args: [
				{
					key: 'module',
                    label: 'user',
                    prompt: 'ghjfghg',
                    type: 'string',
                    default: ''
				}
			]
        });
    }

    async run(msg, { module }){
        const embed = {
            "color": 1638182,
            "image": {
              "url": `https://nodei.co/npm/${module}.png?downloads=true&downloadRank=true&stars=true`
            }
          };
        return msg.reply({ embed });
    }
};