import BotCommand from '~/classes/command';


export default class PurgeCommand extends BotCommand {
    constructor(client) {
        const options = {
            label: 'purge',
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

    run (msg, { amount, user }) {
        return `${amount} and ${user}`
    }
}