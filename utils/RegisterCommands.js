require('dotenv').config();
const { REST, Routes } = require('discord.js');

module.exports = async (client) => {
    console.log('[SYNC] Début de la synchronisation...');

    const commands = [];
    for (const [name, command] of client.commands) {
        commands.push(command.data.toJSON());
        console.log(`[SYNC] Préparation : /${name}`);
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log(`[SYNC] Envoi de ${commands.length} commandes à Discord...`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.APP_ID),
            { body: commands }
        );

        console.log(`[SYNC] Succès ! ${data.length} commandes synchronisées.`);
    } catch (error) {
        console.error('[SYNC] ERREUR CRITIQUE :');
        console.error('1. Vérifiez que :');
        console.error('   - Le token dans .env est exact (copiez depuis le portail Discord)');
        console.error('   - L\'APP_ID correspond à l\'application (pas au bot)');
        console.error('2. Régénérez l e token si nécessaire\n');
        console.error('Détails techniques:', error);
        process.exit(1); // Quitte le processus en cas d'échec
    }
};