import BotCommand from '~/classes/command';


export default class BruhCommand extends BotCommand {
    constructor(client) {
        const options = {
            name: 'bruh',
            usage: 'g!bruh',
            description: 'yes',
            hidden: false
        }
        super(options, client)
    }

    async runSlash (ctx) {
        return 'Bruh.'
    }

    async run (msg) {
        return 'Bruh.'
    }
}