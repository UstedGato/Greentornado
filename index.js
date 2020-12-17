import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Bot from './classes/bot';

const __dirname = dirname(fileURLToPath(import.meta.url));  // Since we are using ESM, we have to define __dirname manually.

// Setup the Bot instance
const bot = new Bot(process.env.TOKEN, {}, {
    name: 'GreenTornado',
    owner: '<@373833473091436546>, <@421883193969344524>',
    prefix: ['dg!', '@mention']
})

// Connect to gateway
await bot.connect()

bot.on("ready", async () => {
    // Register all commands in ./commands
    await bot.registerCommands(join(__dirname, 'commands'))
});
