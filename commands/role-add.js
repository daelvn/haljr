const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-add')
        .setDescription('Gives yourself a role')
        .addRoleOption(option =>
            option.setName('role')
            .setDescription('Role to give yourself.')
            .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const currentUser = interaction.guild.client.user;

        // check that role is within bounds
        if ((role.position > interaction.guild.roles.resolve('982715881287188501').position) && (role.position < interaction.guild.roles.botRoleFor(currentUser).position - 1)) {
            interaction.member.roles.add(role);

            // reply
            const replyEmbed = new MessageEmbed()
                .setColor(role.hexColor)
                .setTitle("Assigned a role!")
                .setDescription(`We gave you the role ${role.name}`);
            return interaction.reply({ embeds: [replyEmbed] })
        } else {
            return interaction.reply(`You cannot give yourself that role!`)
        }
    },
};