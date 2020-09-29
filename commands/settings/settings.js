const { Command } = require('discord.js-commando');
const SettingsMenu = require('../../settings/settings')
const faunadb = require('faunadb'),
  q = faunadb.query,
  faunaclient = new faunadb.Client({ secret: process.env.FAUNA_KEY })
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'settings',
            group: 'settings',
            memberName: 'settings',
            description: 'opens guild settings.',
            examples: ['g!settings'],
            userPermissions: ['ADMINISTRATOR'],
        });
    }

    async run(msg){
        let setting = new SettingsMenu(msg.guild.id, msg, faunaclient, this.client)
        await setting.init()
    }
};