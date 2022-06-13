const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

const BLOODS = ["Rust", "Bronze", "Gold", "Lime", "Candy Red", "Red", "Jade", "Teal", "Cobalt", "Indigo", "Purple", "Violet", "Fuchsia"];

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess-blood')
        .setDescription('Guesses someone\'s blood color')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to guess the blood color of.')),
    async execute(interaction) {
        let guessUser = interaction.options.getUser('user');
        if (guessUser == null) {
            guessUser = interaction.user;
        }
        return interaction.reply(`<@${guessUser.id}>'s blood color is **${randomItem(BLOODS)}**`);
    },
};