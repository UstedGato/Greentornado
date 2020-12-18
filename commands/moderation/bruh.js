import BotCommand from '~/classes/command';


export default class BruhCommand extends BotCommand {
    constructor(client) {
        const options = {
            name: 'bruh',
            usage: 'g!bruh',
            description: 'yes',
            hidden: true
        }
        super(options, client)
    }

    async run (msg) {
        return 'Bruh.'
    }
}