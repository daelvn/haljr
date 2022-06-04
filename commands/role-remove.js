const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-remove')
        .setDescription('Removes a role from yourself')
        .addRoleOption(option =>
            option.setName('role')
            .setDescription('Role to give yourself.')
            .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const currentUser = interaction.guild.client.user;

        // check that role is within bounds
        if ((role.position > interaction.guild.roles.resolve('982715881287188501').position) && (role.position < interaction.guild.roles.botRoleFor(currentUser).position - 1)) {
            interaction.member.roles.remove(role);

            // reply
            const replyEmbed = new MessageEmbed()
                .setColor(role.hexColor)
                .setTitle("Removed a role!")
                .setDescription(`We took the role ${role.name} away from you!`);
            return interaction.reply({ embeds: [replyEmbed] })
        } else {
            return interaction.reply(`You cannot take that role away from yourself!`)
        }
    },
};