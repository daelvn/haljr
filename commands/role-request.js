const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-request')
        .setDescription('Requests the creation of a role to the YYHY admins')
        .addStringOption(option =>
            option.setName('name')
            .setDescription('Name for the requested role.')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('hex')
            .setDescription('HEX color for the requested role.')
            .setRequired(true)),
    async execute(interaction) {
        const roleName = interaction.options.getString('name');
        const roleColor = interaction.options.getString('hex');

        // create role request
        try {
            const rolereq = await interaction.client.models.RoleRequests.create({
                name: roleName,
                hex: roleColor,
                username: interaction.user.id
            });

            // reply
            const replyEmbed = new MessageEmbed()
                .setColor(`#${rolereq.hex}`)
                .setTitle("A new role has been created!")
                .setDescription(`Requested role ${rolereq.name} with color #${rolereq.hex}`);
            await interaction.reply({ embeds: [replyEmbed] });
        } catch (error) {
            await interaction.reply('Something went wrong with the role request.');
        }
    },
};