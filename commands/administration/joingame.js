import discord from "discord.js-commando";
import runner from '../../among-us/session-runner'
const { Command } = discord;
export default (class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'joingame',
            group: 'administration',
            memberName: 'joingame',
            description: 'Bridge the 2 among us channels.',
            examples: ['g!joingame'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'region',
                    label: 'region',
                    prompt: 'ghjfghg',
                    type: 'string',
                    default: ''
                },
                {
                    key: 'id',
                    label: 'id',
                    prompt: 'ghjfghg',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }
    async run(msg, { region, id }) {
        await runner(this.client, {lobbyCode: id, region}, msg)
    }
});
