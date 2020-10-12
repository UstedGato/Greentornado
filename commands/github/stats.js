const { Command } = require('discord.js-commando');
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            group: 'github',
            memberName: 'stats',
            description: 'Get GitHub stats (broken)',
            examples: ['repeat'],
            userPermissions: ['MANAGE_MESSAGES'],
            // args: [
			// 	{
			// 		key: 'user',
			// 		label: 'user',
			// 		prompt: 'No user was specified, defaulting to self',
            //         type: 'string',
            //         default: ''
			// 	}
			// ]
        });
    }

    async run(msg, { user }) {
        return msg.reply("This command will be fixed soon.");
        const embed = {
            "color": 1638182,
            "image": {
              "url": "https://github-readme-stats-umber.vercel.app/api?username=adoesgit&show_icons=true"
            }
          };
        return msg.reply({ embed });
}};