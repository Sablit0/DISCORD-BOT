// Correction complète :
const { SlashCommandBuilder } = require('discord.js');
const testSchema = require('../schemas/test'); // Chemin corrigé

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test-schema')
        .setDescription('Gestion du schéma de test')
        .addSubcommand(command => command
            .setName('add')
            .setDescription('Ajouter des données')
            .addStringOption(option => option
                .setName('schema-input')
                .setDescription('Texte à enregistrer')
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName('get')
            .setDescription('Récupérer les données')
        )
        .addSubcommand(command => command
            .setName('remove')
            .setDescription('Supprimer les données')
        ),
    
    async execute(interaction) { 
        const { options } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case 'add':
                const string = options.getString('schema-input');
                await testSchema.create({ name: string });
                await interaction.reply('✅ Données enregistrées!');
                break;
                
            case 'get':
                const data = await testSchema.find();
                const values = data.map(d => d.name);
                await interaction.reply(values.join('\n') || 'Aucune donnée trouvée');
                break;
                
            case 'remove':
                const result = await testSchema.deleteMany({});
                await interaction.reply(`🗑️ ${result.deletedCount} documents supprimés!`);
                break;
        }
    }
}