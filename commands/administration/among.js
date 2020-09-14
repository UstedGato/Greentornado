const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const client = new Discord.Client();
const AudioMixer = require('audio-mixer');
let yes = false;
let deadconnection;
let aliveconnection;
let mixer = null;
let users = [];
let inputs = [];
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

async function unmute(member, role, msg) {
    await member.roles.remove(role.id);
}
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'among',
            group: 'administration',
            memberName: 'amongus',
            description: 'Mute a user(in minutes).',
            examples: ['g!among'],
            userPermissions: ['ADMINISTRATOR']
        });
    }

    async run(msg, { amount, user }) {
        if (yes === false) {
            await client.login(process.env.BRIDGE_TOKEN)
            const guildthroughotherclient = await client.guilds.resolveID(msg.guild.id)
            const alivechannel = await msg.guild.channels.resolveID(process.env.ALIVE_AMONG_CHANNEL)
            const deadchannel = await guildthroughotherclient.channels.resolveID(process.env.DEAD_AMONG_CHANNEL)
            deadconnection = await deadchannel.join()
            aliveconnection = await alivechannel.join()
            const receiver = aliveconnection.createReceiver();
            mixer = new AudioMixer.Mixer({
                channels: 1,
                bitDepth: 16,
                sampleRate: 48000,
                clearInterval: 250
            });
            aliveconnection.on('speaking', async (user, speaking) => {
              if (speaking) {
                console.log(`I'm listening to ${user}`);
                // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
                users[user.id] = await receiver.createPCMStream(user);
                inputs[user.id] = mixer.input({
                    channels: 1,
                    volume: 100
                });
                users[user.id].pipe(inputs[user.id]);
                // when the stream ends (the user stopped talking) tell the user
                users[user.id].on('end', () => {
                    mixer.removeInput(inputs[user.id])
                });
              } else {

              }
            });
            let connection = new ReadableStream
            mixer.pipe(connection)
            deadchannel.play(connection)
        } else {
            await aliveconnection.disconnect()
            await deadconnection.disconnect()
            await client.destroy()
            users = []
            inputs = []
            mixer = null
            yes = true;
        }
    }
};
