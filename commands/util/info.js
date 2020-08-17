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


child = exec('neofetch --stdout --color_blocks off --gpu_brand on --gpu_type all --disk_show / --ip_host="green-tornado-discord-bot.fly.dev"',
   function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
      msg.reply(`\`\`\`css\n${stdout}\n\`\`\``);
   });
  }
};
