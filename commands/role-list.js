const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const { endOfRoles, roleRelativePosition } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-list')
        .setDescription('Lists all available roles'),
    async execute(interaction) {
        const currentUser = interaction.guild.client.user;
        const finalRole = interaction.guild.roles.resolve(endOfRoles);
        const botRole = interaction.guild.roles.botRoleFor(currentUser);

        let rolemap = interaction.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .filter(r => r.position < botRole.position + roleRelativePosition) // list begin
            .filter(r => r.position > finalRole.position) // list end
            .join("\n");
        if (rolemap.length > 1024) rolemap = "Too many roles to display";
        if (!rolemap) rolemap = "No roles";

        const replyEmbed = new MessageEmbed()
            .addField("Role List", rolemap);

        return interaction.reply({ embeds: [replyEmbed] });
    },
};