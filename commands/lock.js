const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Verrouille un salon textuel')
        .setDefaultMemberPermissions(null)
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('Salon à verrouiller')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)),
    async execute(interaction) {
        const MODERATOR_ROLE_ID = '1246110077430009973';
        const isModerator = interaction.member.roles.cache.has(MODERATOR_ROLE_ID);
        const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels);

        // Vérification IMMÉDIATE des permissions (avant deferReply)
        if (!isModerator && !isAdmin) {
            return interaction.reply({ 
                content: "🔐 Réservé au staff",
                ephemeral: true 
            });
        }

        // Seulement pour les admins/modos : réponse différée
        await interaction.deferReply();

        const channel = interaction.options.getChannel('channel');
        
        try {
            if (!interaction.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.ManageChannels)) {
                return interaction.editReply({
                    content: "❌ Je n'ai pas la permission de gérer ce salon!",
                    ephemeral: true
                });
            }

            await channel.permissionOverwrites.edit(interaction.guild.id, { 
                SendMessages: false 
            });

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setDescription(`🔒 ${channel} a été verrouillé par ${interaction.user}`)
                .setTimestamp();

            // Message PUBLIC pour les admins/modos
            await interaction.editReply({ 
                embeds: [embed] 
            });
        } catch (error) {
            console.error('Erreur /lock:', error);
            await interaction.editReply({
                content: error.code === 50013 
                    ? "❌ Permission manquante! Placez mon rôle plus haut" 
                    : "❌ Erreur lors du verrouillage",
                ephemeral: true
            });
        }
    }
}