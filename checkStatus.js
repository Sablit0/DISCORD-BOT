require('dotenv').config(); // Ajoutez cette ligne AU DÉBUT
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
  intents: [
    GatewayIntentBits.GuildPresences 
  ]
});

client.on('ready', () => {
  const targetBot = client.users.cache.get('1391837471217553579');
  console.log(`Statut de ${targetBot?.tag} : ${targetBot?.presence?.status || 'inconnu'}`);
  client.destroy();
});

client.login(process.env.DISCORD_TOKEN); // Utilisez directement process.env