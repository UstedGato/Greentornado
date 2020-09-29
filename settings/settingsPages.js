const GuildSettings = require('./guild')
const pages = []
pages.push(GuildSettingsHelper)

module.exports = {
    getPages: function() {
        return pages
    }
};
