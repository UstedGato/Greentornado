const { Command } = require('discord.js-commando');
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            group: 'administration',
            memberName: 'purge',
            description: 'Purge Messages (only works for last 100 messages in channel)',
            examples: ['g!purge 20', 'g!purge 20 @GreenTornado'],
            userPermissions: ['MANAGE_MESSAGES'],
            args: [
				{
					key: 'amount',
					label: 'amount',
					prompt: 'Specify an amount, up to 100',
                    type: 'string'
                },
                {
					key: 'user',
					label: 'user',
					prompt: 'No user was specified, defaulting to all',
                    type: 'string',
                    default: false
				}
			]
        });
    }

    async run(msg, { amount, user }) {
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.reply("You need to have the ``Manage Messages`` permission to use this command.");
        const messages = await msg.channel.messages.fetch({limit: amount || 100})
        let msgs = messages;
        if (user) {
            var userid = user.match(/<@(?:!?)(\D)>/g)[1];
            msgs = msgs.filter(message => message.author.id.toString() === userid);
        }
        const array = msgs.array();
        const todelete = [];
        for (const item of array) {
            todelete.push(item)
        }  
        await msg.channel.bulkDelete(todelete)
    }
};
