const fs = require('fs');
const path = require('node:path');
const logger = require('log4js').getLogger();

const config = require('./config.json');

logger.level = config.logLevel;

const { Client, Collection } = require('discord.js');
// const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
// const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const client = new Client({ intents: [] });
client.commands = new Collection();
client.config = config;
client.logger = logger;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

setTimeout(() =>
{
    client.logger.info('Loading DJS client eventhandlers.');
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles)
    {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        client.logger.debug(`Event ${event.name} loaded!`);
        if (event.once)
        {
            client.once(event.name, (...args) => event.execute(...args));
        }
        else
        {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}, 1000);

setTimeout(() =>
{
    client.login(config.token);
}, 3000);