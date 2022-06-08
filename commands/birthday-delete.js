const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday-delete')
        .setDescription('Removes your own birthday'),
    async execute(interaction) {
        const Birthdays = interaction.client.models.get('Birthdays');
        // delete entry from database
        const rowCount = await Birthdays.destroy({ where: { user: interaction.user.id } });
        if (!rowCount) return interaction.reply('You have not registered a birthday yet.');
        // cancel job
        interaction.client.scheduled.delete(interaction.user.id);
        // reply back
        return interaction.reply("The birthday has been deleted!");
    },
};