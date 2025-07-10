require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion réussie!');
    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

testConnection();