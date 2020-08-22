const { Command } = require('discord.js-commando');
const faunadb = require('faunadb'),
  q = faunadb.query,
  client = new faunadb.Client({ secret: process.env.FAUNA_KEY })

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coin',
            group: 'coins',
            memberName: 'coin',
            description: 'Give people cross-server virtual coins (Admin only)',
            examples: ['g!coin @AAGaming'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
				{
					key: 'user',
					label: 'user',
					prompt: 'No user was specified, defaulting to self',
                    type: 'string',
                    default: ''
				}
			]
        });
    }
    async updateCoins(id, toadd) {
        try {
            var coins = await client.query(
                q.Get(
                  q.Match(
                      q.Index("coinIndex"),
                      id
                    )
                )
            ) 
            } catch (error) {
                await client.query(
                    q.Create(
                      q.Collection('coins'),
                      { data: { userId: id, coins: toadd } },
                    )
                  )
                return toadd
            }
        if (coins) {
            await client.query(
                q.Update(
                  q.Ref(coins.ref),
                  { data: { userId: id, coins: coins.data.coins + toadd } },
                )
              )
              return coins.data.coins + toadd
        }
        return false
    }
    async run(msg, { user }) {
        if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply("You need to be an admin to use this command.");
        console.log(user);
        //var user = user.substring("<",">");
        //console.log(user);
        var mention = user;
        var nouser = false;
        if (user === "") {
            user = msg.author.id;
            nouser = true;
        }
        else {
            if (!user.match(/[\\<>@#&!]/g)) {
                return msg.reply("Error: Invalid user");
            }
            else {
                user = user.replace(/[\\<>@#&!]/g, "");
                console.log(user);
                user = user.replace(/\D/g,'');
            }
        }
        console.log(user);
        if (nouser === true) {
            const coins = await this.updateCoins(user, 1)
            return msg.reply("you now now have " + coins + " coin(s).");
        }
        else {
            const coins = await this.updateCoins(Number.parseInt(user), 1)
            return msg.reply(mention + " now has " + coins + " coin(s).");
        }

        
    }
};
