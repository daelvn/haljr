const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

const SWAYS = ["Derse", "Prospit"];

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randomFromPair = (items) => items[Math.round(Math.random())];
const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess-sway')
        .setDescription('Guesses someone\'s lunar sway')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to guess the lunar sway of.')),
    async execute(interaction) {
        let guessUser = interaction.options.getUser('user');
        if (guessUser == null) {
            guessUser = interaction.user;
        }
        return interaction.reply(`<@${guessUser.id}>'s lunar sway is **${randomFromPair(SWAYS)}**`);
    },
};