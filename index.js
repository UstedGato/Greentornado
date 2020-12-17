import Bot from './classes/bot';

const bot = new Bot(process.env.TOKEN, {}, {
    name: 'GreenTornado',
    owner: 'AAGaming#9395, Dr. Gato#9454',
    prefix: ['dg!', '@mention']
})