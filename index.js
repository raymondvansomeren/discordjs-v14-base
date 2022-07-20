const fs = require('fs');
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

client.on('interactionCreate', async interaction =>
{
    if (interaction.type != 2) return;

    if (!client.commands.has(interaction.commandName)) return;

    try
    {
        await client.commands.get(interaction.commandName).execute(interaction);
    }
    catch (error)
    {
        client.logger.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.once('ready', () =>
{
    client.logger.log('Fully started!');
});

client.login(config.token);