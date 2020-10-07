process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
const commando = require('discord.js-commando');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const sqlite = require('better-sqlite3');
const welcomer = require('./actions/welcomeUser')
const statusRotator = require('./rotators/status')
let client;
if (process.env.BOT_ENV === "prod") {
client = new commando.Client({
  owner: ['421883193969344524', '373833473091436546'],
  commandPrefix: 'g!'
});
}
else {
client = new commando.Client({
  owner: ['421883193969344524', '373833473091436546'],
  commandPrefix: 'dg!'
});
}
client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('ready', () => {
    console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
    statusRotator.startRotation(client);
    // start the REST api
    const app = require('express')();
    require('./rest')(app, client)
    app.get('/', function (req, res) {
      res.send('GreenTornado REST API v1');
    });
    app.listen(process.env.BOT_ENV === "prod" ? 80 : 8080, function () {
      console.log('App listening on port 80');
    });
  })
  .on('disconnect', () => { console.warn('Disconnected!'); })
  .on('reconnecting', () => { console.warn('Reconnecting...'); })
  .on('commandError', (cmd, err) => {
    if (err instanceof commando.FriendlyError) return;
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
  })
  .on('commandBlocked', (msg, reason) => {
    console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
  })
  .on('commandPrefixChange', (guild, prefix) => {
    console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('commandStatusChange', (guild, command, enabled) => {
    console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('groupStatusChange', (guild, group, enabled) => {
    console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('guildMemberAdd', member => {
    welcomer.welcomeAUser(member);
  })
  .on('message', message => {
    if (message.content === 'debug!join') {
      if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You need to be an admin to use this command.");
      client.emit('guildMemberAdd', message.member);
    }
  });

client.setProvider(
  new commando.SyncSQLiteProvider(new sqlite(path.join(__dirname, 'database.sqlite3')))
).catch(console.error);

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerGroups([
    ['administration', 'Administration'],
    ['math', 'Math'],
    ['test', 'Test'],
    ['coins', 'Coins'],
    ['annoyance', 'Annoyance'],
    ['how_to_win_an_arguement', 'how to win an argument'],
    ['github', 'GitHub'], 
    ['osu', 'osu!'],
    ['music', 'Music'],
    ['settings', 'Settings']
  ])
  .registerTypesIn(path.join(__dirname, 'types'))
  .registerCommandsIn(path.join(__dirname, 'commands'));
client.login(process.env.TOKEN);


