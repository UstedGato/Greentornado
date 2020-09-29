const { getPages } = require('./settingsPages')
class SettingsMenu {
    constructor(guildId, message, fauna, client) {
        this.guildId = guildId
        this.triggerMessage = message
        this.fauna = fauna
        this.client = client
        this.pages = getPages()
        this.settingId = 0
        }
    async init() {
        this.message = await this.triggerMessage.channel.send('<a:botloader:750419652256989331>')
        const filter = (reaction, user) => {
            return user.id === this.triggerMessage.author.id;
          };
        this.message.react('🛑')
          this.collector = await this.message.createReactionCollector(filter);
          this.collector.on('collect', r => {
              console.log(r.emoji.name)
            if (r.emoji.name === '🛑') {
                this.stop()
            }
            r.users.remove(this.triggerMessage.author)
          });
          this.collector.on('end', collected => console.log(`Collected ${collected.size} items`));
          this.currentSetting = new this.pages[0](this)
          await this.currentSetting.init()
    }
    async changePage (forward) {
        await this.currentSetting.destroy()
        forward ? this.settingId++ : this.settingId--
        if (this.settingId < 0) {
            this.settingId = 1
        }
        this.currentSetting = new this.pages[this.settingId](this)
        await this.currentSetting.init()
    }
    async stop() {
        await this.currentSetting.destroy()
        await this.collector.stop()
        await this.message.delete()
        await this.triggerMessage.delete()
    }
    }


module.exports = SettingsMenu