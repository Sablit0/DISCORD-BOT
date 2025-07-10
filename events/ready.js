const { ActivityType } = require('discord.js');
const cowsay = require("cowsay");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Connecté en tant que ${client.user.tag}`);
        console.log(`App ID: ${client.config.APP_ID}`);
        client.user.setActivity('🌍 En ligne', { type: ActivityType.Watching });
        
        // Supprimer la partie MongoDB car elle est gérée dans index.js
    }
};