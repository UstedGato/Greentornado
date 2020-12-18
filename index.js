import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Bot from './classes/Bot';

const __dirname = dirname(fileURLToPath(import.meta.url));  // Since we are using ESM, we have to define __dirname manually.

// Setup the Bot instance
const bot = new Bot({
    name: 'GreenTornado',
    owner: '<@373833473091436546>, <@421883193969344524>',
    prefix: ['dg!', '@mention'],
    token: 'Bot ' + process.env.TOKEN,
    publicKey: process.env.PUBKEY,
    applicationID: process.env.APP_ID
})

// Register all commands in ./commands
await bot.registerCommands(join(__dirname, 'commands'))

// Connect to gateway
await bot.connect()
