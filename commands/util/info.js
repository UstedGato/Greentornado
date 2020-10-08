const commando = require('discord.js-commando');
const exec = require('child_process').exec;
var child;
module.exports = class ReplyCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'info',
      aliases: ['neofetch'],
      group: 'util',
      memberName: 'info',
      description: 'Gets information about the bot.'
    });
  }

  async run(msg, args) {


child = exec('neofetch --stdout --color_blocks off --config ./neoconfig.sh',
   function (error, stdout, stderr) {
      this.client.logger.log('info', 'stdout: ' + stdout);
      this.client.logger.log('info', 'stderr: ' + stderr);
      if (error !== null) {
          this.client.logger.log('info', 'exec error: ' + error);
      }
      msg.reply(`\`\`\`css\n${stdout}\n\`\`\``);
   });
  }
};
