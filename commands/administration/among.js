const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const client = new Discord.Client();
const AudioMixer = require('audio-mixer');
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }  
let yes = false;
let deadconnection;
let aliveconnection;
let mixer = null;
let users = [];
let inputs = [];
client
.on('error', console.error)
.on('warn', console.warn)

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'among',
            group: 'administration',
            memberName: 'amongus',
            description: 'Mute a user(in minutes).',
            examples: ['g!among'],
            ownerOnly: true,
            hidden: true
        });
    }

    async run(msg, { amount, user }) {
        if (yes === false) {
            yes = true
            await client.login(process.env.BRIDGE_TOKEN)
            await sleep(3000);
            const guildthroughotherclient = await client.guilds.fetch(msg.guild.id)
            const alivechannel = await msg.guild.channels.cache.get(process.env.ALIVE_AMONG_CHANNEL)
            const deadchannel = await guildthroughotherclient.channels.cache.get(process.env.DEAD_AMONG_CHANNEL)
            deadconnection = await deadchannel.join()
            aliveconnection = await alivechannel.join()
            mixer = new AudioMixer.Mixer({
                channels: 1,
                bitDepth: 16,
                sampleRate: 48000,
                clearInterval: 250
            });
            await sleep(3000)
            await aliveconnection.play('./join.mp3');
            aliveconnection.on('speaking', async (user, speaking) => {
              if (speaking.bitfield === 1) {
                // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
                users[user.id] = aliveconnection.receiver.createStream(user, {mode: 'pcm'});
                inputs[user.id] = mixer.input({
                    channels: 1,
                    volume: 100
                });
                users[user.id].pipe(inputs[user.id]);
                // when the stream ends (the user stopped talking) tell the user
                users[user.id].on('end', () => {
                    mixer.removeInput(inputs[user.id])
                });
              }
            });
            deadconnection.play(mixer, {type: 'converted'})
        } else {
            yes= false
            await aliveconnection.disconnect()
            await deadconnection.disconnect()
            await client.destroy()
            users = []
            inputs = []
            mixer = null
        }
    }
};
