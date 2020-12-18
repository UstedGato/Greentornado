import BotCommand from '~/classes/command';


export default class EvalCommand extends BotCommand {
    constructor(client) {
        const options = {
            name: 'eval',
            description: 'yes',
            usage: 'g!eval <code>',
            hidden: true,
            isPureCommand: true,
            invalidUsageMessage: () => `Invalid usage! Example: \`${options.usage}\``,
            requirements: {
                permissions: {
                    manageMessages: true
                }
            },
            args: [
				{
					key: 'code',
					label: 'code',
                    prompt: 'actually put some code u dumb dumb',
                    required: true
                }
			]
        }
        super(options, client)
    }

    async run (msg, { code }) {
        return 'soontm'
        return code
    }
}