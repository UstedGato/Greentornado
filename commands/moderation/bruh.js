import BotCommand from '~/classes/Command';


export default class BruhCommand extends BotCommand {
    constructor(client) {
        const options = {
            name: 'bruh',
            usage: 'g!bruh',
            description: 'yes',
            guildID: process.env.AAPS_GUILD,
            hidden: false
        }
        super(options, client)
    }

    async runSlash (ctx) {
        console.log('what')
        await ctx.send('Bruh', { ephemeral: true })
    }

    async run (msg) {
        return 'Bruh.'
    }
}