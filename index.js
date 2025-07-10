const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Configuration
client.config = {
  APP_ID: process.env.APP_ID,
  OWNER_ID: process.env.OWNER_ID
};
client.cooldowns = new Map();
client.cache = new Map();

// Chargement des composants
require('./utils/ComponentLoader')(client);
require('./utils/EventLoader')(client);
require('./utils/RegisterCommands')(client);

// Connexion MongoDB  
client.login(process.env.DISCORD_TOKEN)
  .then(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté!');
  })
  .catch(err => {
    console.error('❌ Échec de connexion:', err);
    process.exit(1);
  });

// Gestion des erreurs
process.on('unhandledRejection', error => {
    console.error('Unhandled Rejection:', error);
});

// Connexion Discord (UNE SEULE FOIS)
client.login(process.env.DISCORD_TOKEN)
  .then(() => connectToMongoDB())
  .catch(err => console.error("Échec:", err));

// Handler d'interactions
async function InteractionHandler(interaction, type) {
    const component = client[type].get(interaction.customId ?? interaction.commandName);
    if (!component) return;

    try {
        // Vérifications des permissions
        if (component.admin && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ 
                content: '⚠️ Réservé aux administrateurs', 
                ephemeral: true 
            });
        }

        if (component.owner && interaction.user.id !== client.config.OWNER_ID) {
            return await interaction.reply({ 
                content: '⚠️ Réservé au propriétaire', 
                ephemeral: true 
            });
        }

        await component.execute(interaction, client);
    } catch (error) {
        console.error(`Erreur dans ${type}:`, error);
        if (interaction.replied || interaction.deferred) {
            await interaction.editReply({
                content: `Erreur: \`\`\`${error.message}\`\`\``,
                components: []
            }).catch(() => {});
        } else {
            await interaction.reply({
                content: `Erreur: \`\`\`${error.message}\`\`\``,
                ephemeral: true
            }).catch(() => {});
        }
    }
}

// Gestion des interactions
client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) return InteractionHandler(interaction, 'commands');
    if (interaction.isButton()) return InteractionHandler(interaction, 'buttons');
    if (interaction.isStringSelectMenu()) return InteractionHandler(interaction, 'dropdowns');
    if (interaction.isModalSubmit()) return InteractionHandler(interaction, 'modals');
});