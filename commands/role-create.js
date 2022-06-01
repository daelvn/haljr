const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-create')
        .setDescription('Creates a role with a given color')
        .addStringOption(option =>
            option.setName('name')
            .setDescription('Name for the new role.')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('hex')
            .setDescription('HEX color for the new role.')
            .setRequired(true)),
    async execute(interaction) {
        const newRoleName = interaction.options.getString('name');
        const newRoleColor = interaction.options.getString('hex');
        const currentUser = interaction.guild.client.user;

        if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            await interaction.reply("You do not have permissions to execute this command! (Manage Roles)");
            return;
        }

        // create role
        interaction.guild.roles.create({
                name: newRoleName,
                color: newRoleColor,
                hoist: true,
                reason: "Created by YYHY^3 Admins",
                // position:
                position: interaction.guild.roles.botRoleFor(currentUser).position - 1
            })
            .then(console.log)
            .catch(console.error);

        // reply
        const replyEmbed = new MessageEmbed()
            .setColor(`#${newRoleColor}`)
            .setTitle("A new role has been created!")
            .setDescription(`Created role ${newRoleName} with color #${newRoleColor}`);
        await interaction.reply({ embeds: [replyEmbed] });
    },
};