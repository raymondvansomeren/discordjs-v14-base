const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'ping',
    description: 'Replies with Pong!',
    async execute(interaction)
    {
        try
        {
            const embed = new EmbedBuilder()
                .setTitle('Ping')
                .setDescription('---ms')
                .setColor(interaction.client.config.color)
                .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.defaultAvatarURL });

            // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
            const t = new Date();
            interaction.reply({ embeds: [embed.data], ephemeral: false })
                .then(() =>
                {
                    const tt = new Date();
                    const ping = tt - t;
                    // embed.setFields({ name: 'Ping', value: `${ping}ms` });
                    embed.setDescription(`${ping}ms`);
                    interaction.editReply({ embeds: [embed.data], ephemeral: false });
                });
        }
        catch (err)
        {
            const embed = new EmbedBuilder()
                .setDescription('Something wen\'t wrong, try again later');
            interaction.reply({ embeds: [embed.data], ephemeral: true });
            interaction.client.logger.error(err);
        }
    },
    getCommand()
    {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);
    },
};