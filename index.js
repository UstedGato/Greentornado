import { join } from 'path';
import Bot from './classes/bot';

// Setup the Bot instance
const bot = new Bot(process.env.TOKEN, {}, {
    name: 'GreenTornado',
    owner: '<@373833473091436546>, <@421883193969344524>',
    prefix: ['dg!', '@mention']
})

// Connect to gateway
bot.connect()

// Register all commands in ./commands
bot.registerCommands(join(__dirname, 'commands'))