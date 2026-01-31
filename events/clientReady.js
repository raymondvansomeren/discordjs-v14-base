const { ActivityType } = require('discord.js');

module.exports = {
    name: 'clientReady',
    once: true,
    execute(client)
    {
        require('../deploy-commands.js');

        client.user.setPresence({
            status: 'online',
            activities: [{
                name: `over ${client.guilds.cache.size} servers`,
                // PLAYING: WATCHING: LISTENING: STREAMING:
                type: ActivityType.Watching,
            }],
        });
        client.logger.info('Fully started!');
    },
};