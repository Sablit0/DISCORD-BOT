const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Éteint le bot'),
    
    async execute(interaction) {
        // Vérification du propriétaire
        if (interaction.user.id !== process.env.OWNER_ID) {
            return interaction.reply({ 
                content: '❌ Réservé au propriétaire', 
                ephemeral: true 
            });
        }

        // 1. Réponse immédiate
        await interaction.reply({ 
            content: '🛑 Extinction en cours... (Statut Discord peut mettre 30s à se mettre à jour)', 
            ephemeral: true 
        });

        // 2. Force le statut "invisible" et pause
        await interaction.client.user.setStatus('invisible');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. Déconnexion propre
        console.log(`[SHUTDOWN] Demandé par ${interaction.user.tag}`);
        await interaction.client.destroy();
        process.exit(0);
    }
};