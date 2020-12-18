import BotCommand from '~/classes/command';


export default class PurgeCommand extends BotCommand {
    constructor(client) {
        const options = {
            name: 'purge',
            group: 'administration', // @todo: add group suppoer
            description: 'Purge Messages (only works for last 100 messages in channel)',
            usage: 'g!purge <amount> [user]',
            invalidUsageMessage: () => `Invalid usage! Example: \`${options.usage}\``,
            requirements: {
                permissions: {
                    manageMessages: true
                }
            },
            args: [
				{
					key: 'amount',
					label: 'amount',
                    prompt: 'Error: amount is required',
                    required: true
                },
                {
					key: 'user',
					label: 'user'
				}
			]
        }
        super(options, client)
    }

    async run (msg, { amount, user }) {
        const messages = await msg.channel.getMessages(amount || 100)
        let msgs = messages;
        if (user) {
            var userid = user.match(/<@!?(\d+)>/g)[1];
            msgs = msgs.filter(message => message.author.id === userid);
        }
        const todelete = msgs.map(message => message.id)
        await msg.channel.deleteMessages(todelete)
    }
}