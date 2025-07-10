require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');


const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(`./commands/${file}`);
        if (command.data) {
            commands.push(command.data.toJSON());
            console.log(`✓ ${file}`);
        }
    } catch (error) {
        console.error(`❌ Erreur dans ${file}:`, error.message);
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`\n🚀 Envoi de ${commands.length} commandes à Discord...`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.APP_ID),
            { body: commands }
        );

        console.log(`\n✅ Synchronisation réussie ! ${data.length} commandes actives :`);
        data.forEach(cmd => console.log(`- /${cmd.name}`));
    } catch (error) {
        console.error('\n🔥 ERREUR DE SYNCHRONISATION :');
        console.error('1. Vérifiez que :');
        console.error('   - Le token dans .env est EXACTEMENT celui du portail Discord');
        console.error('   - L\'APP_ID correspond à l\'ID de l\'application (pas du bot)');
        console.error('2. Régénérez le token si nécessaire');
        console.error('\nDétail technique:', error.message);
        
        // Test supplémentaire
        console.log('\n🔎 Test API:');
        try {
            const response = await rest.get(Routes.user('@me'));
            console.log('✅ Token valide! Bot:', response.username);
        } catch (apiError) {
            console.error('❌ Échec du test API:', apiError.message);
        }
    }
})();