import discord from "discord.js-commando";
import SettingsMenu from "../../settings/settings";
import faunadb from "faunadb";
const { Command } = discord;
const q = faunadb.query, faunaclient = new faunadb.Client({ secret: process.env.FAUNA_KEY });
export default (class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'guildsettings',
            group: 'settings',
            memberName: 'guildsettings',
            description: 'opens guild settings.',
            examples: ['g!guildsettings'],
            userPermissions: ['ADMINISTRATOR'],
        });
    }
    async run(msg) {
        let setting = new SettingsMenu(msg.guild.id, msg, faunaclient, this.client);
        await setting.init();
    }
});
