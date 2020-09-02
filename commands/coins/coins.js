const { Command } = require('discord.js-commando');
const faunadb = require('faunadb'),
  q = faunadb.query,
  fauna = new faunadb.Client({ secret: process.env.FAUNA_KEY })

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coins',
            group: 'coins',
            memberName: 'coins',
            description: 'Check your coins.',
            examples: ['g!coins', 'g!coins @AAGaming'],
            
            args: [
				{
					key: 'user',
                    label: 'user',
                    prompt: 'ghjfghg',
                    type: 'string',
                    default: ''
				}
			]
        });
    }
    async getCoins(id) {
        try {
        var coins = await fauna.query(
            q.Get(
              q.Match(
                  q.Index("coinIndex"),
                  id
                )
            )
        ) 
        } catch (error) {
            return false
            console.log(error)
        }
        if (coins) {
            return coins.data.coins
        }
        return false
    }
    async run(msg, { user }){
        var msguserid = msg.author.id;
        //var user = user.substring("<",">");
        user = user.replace(/[\\<>@#&!]/g, "");
        user = user.replace(/\D/g,'');
        if (user === "") {
            const coins = await this.getCoins(msguserid)
            if (coins) {
                return msg.reply("You have " + coins + " coins.");
            } else {
                return msg.reply("You're broke, idiot.");
            }
        } else {
            const coins = await this.getCoins(Number.parseInt(user))
            if (coins) {
                return msg.reply("They have " + coins + " coins.");
            } else {
                return msg.reply("They're broke, you idiot.");
            }
        }
    }
};