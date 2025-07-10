const { SlashCommandBuilder } = require('discord.js');
const testSchema = require('../schemas/test'); // Correction du chemin

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-schema')
    .setDescription('Supprime tous les documents du schéma test'),
    
  async execute(interaction) {
    try {
      if (!interaction.member.permissions.has('Administrator')) {
        return await interaction.reply({
          content: '❌ Seuls les administrateurs peuvent utiliser cette commande',
          ephemeral: true
        });
      }

      const result = await testSchema.deleteMany({});
      
      await interaction.reply({
        content: `✅ ${result.deletedCount} documents supprimés avec succès`,
        ephemeral: true
      });

    } catch (error) {
      console.error('Erreur dans delete-schema:', error);
      await interaction.reply({
        content: '❌ Une erreur est survenue lors de la suppression',
        ephemeral: true
      });
    }
  }
};