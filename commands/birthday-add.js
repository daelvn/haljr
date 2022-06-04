const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday-add')
        .setDescription('Adds a birthday to the list.')
        .addStringOption(option =>
            option.setName('date')
            .setDescription('Date in the format "Month Day", like these: January 21, April 13')
            .setRequired(true)),
    async execute(interaction) {
        const dateString = interaction.options.getString('date');
        const date = dayjs(dateString, 'MMMM D');
        const Birthdays = interaction.client.models.get('RoleRequests');

        // find if day is valid
        if (!date.isValid()) {
            return interaction.reply("The date is in the wrong format!");
        }
        // add to the database
        try {
            const birthday = await Birthdays.create({
                date: dateString,
                user: interaction.user.id
            });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return interaction.reply('You have already registered your own birthday.');
            }
            return interaction.reply('Something went wrong with adding a birthday. ' + error.message);
        }
        // setup trigger
        // reply back
    },
};