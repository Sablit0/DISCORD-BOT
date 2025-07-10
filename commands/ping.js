const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Vérifie le statut du bot'),
    async execute(interaction) {
        const ownerTag = `<@${interaction.client.config.OWNER_ID}>`;
        await interaction.reply({
            content: `Pong! (Owner: ${ownerTag})`,
            ephemeral: true
        });
    }
};