const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

const DEATHS = ["Just", "Heroic"];

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randomFromPair = (items) => items[Math.round(Math.random())];
const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess-death')
        .setDescription('Guesses someone\'s death type')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to guess the death type of.')),
    async execute(interaction) {
        let guessUser = interaction.options.getUser('user');
        if (guessUser == null) {
            guessUser = interaction.user;
        }
        return interaction.reply(`<@${guessUser.id}>'s death is **${randomFromPair(DEATHS)}**`);
    },
};