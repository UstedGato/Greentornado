const { Command } = require('discord.js-commando');
const faunadb = require('faunadb'),
  q = faunadb.query,
  client = new faunadb.Client({ secret: process.env.FAUNA_KEY })

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'guildsettings',
            group: 'settings',
            memberName: 'npm',
            description: 'opens guild settings.',
            examples: ['g!guildsettings'],
            userPermissions: ['ADMINISTRATOR'],
        });
    }
    async getSettings(id) {
        let settings;
        try {
            settings = await client.query(
                q.Get(
                  q.Match(
                      q.Index("guildIndex"),
                      id
                    )
                )
            ) 
            } catch (error) {
                await client.query(
                    q.Create(
                      q.Collection('guildSettings'),
                      { data: { id: id } },
                    )
                  )
                return true
            }
        return settings
    }
    async run(msg){
        const embed = {
            "title": "Server Name",
            "description": "React with one of theese reactions to change it's setting",
            "color": 9174784,
            "thumbnail": {
              "url": "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            "image": {
              "url": "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            "author": {
              "name": "Guild Settings",
              "url": "https://discordapp.com",
              "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            "fields": [
              {
                "name": ":hash:",
                "value": "Welcome channel:"
              },
              {
                "name": "🌃",
                "value": "Welcome background:"
              }
            ]
          };
        const botMessage = await message.channel.send({ embed })
    }
};