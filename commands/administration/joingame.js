const { Command } = require('discord.js-commando');
const runner = require('../../among-us-js/session-runner')
const { REGIONS } = require('../../among-us-js/constants')
let session;
let started = false;
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'joingame',
            group: 'administration',
            memberName: 'joingame',
            description: 'Bridge the 2 among us channels.',
            examples: ['g!joingame'],
            userPermissions: ['ADMINISTRATOR'],
            disabled: true,
            args: [
                {
                    key: 'id',
                    label: 'id',
                    prompt: 'enter a room code you idiot.',
                    type: 'string',
                },
                {
                    key: 'region',
                    label: 'region',
                    prompt: 'ghjfghg',
                    type: 'string',
                    default: 'NA'
                }
            ]
        });
    }
    async run(msg, { region, id }) {
        if (!started) {
            started = true
            session = await runner(this.client, {lobbyCode: id, region: REGIONS[region]}, msg)
        } else {
            await session.leaveLobby()
            msg.channel.send('stopping')
            session = null
            started = false
        }
    }
};
