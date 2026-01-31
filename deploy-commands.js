const fs = require('fs');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const config = require('./config.json');

const logger = require('log4js').getLogger();

let commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    commands.push(command.getCommand());
}

commands = commands.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(config.token);

if (config.inDevelopment)
{
    rest.put(Routes.applicationGuildCommands(config.clientId, config.devServer), { body: commands })
        .then(() => logger.info('Successfully registered application commands.'))
        .catch(console.error);
}
else
{
    rest.put(Routes.applicationCommands(config.clientId, config.devServer), { body: commands })
        .then(() => logger.info('Successfully registered application commands.'))
        .catch(console.error);
}