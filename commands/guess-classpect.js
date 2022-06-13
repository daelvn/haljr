const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

const CLASSES = ["Thief", "Rogue", "Bard", "Prince", "Heir", "Page", "Seer", "Maid", "Sylph", "Knight", "Witch", "Mage", "Muse", "Lord"];
const ASPECTS = ["Space", "Time", "Mind", "Heart", "Hope", "Rage", "Breath", "Blood", "Life", "Doom", "Life", "Doom", "Light", "Void"];

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess-classpect')
        .setDescription('Guesses someone\'s classpect')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to guess the classpect of.')),
    async execute(interaction) {
        let guessUser = interaction.options.getUser('user');
        if (guessUser == null) {
            guessUser = interaction.user;
        }
        return interaction.reply(`<@${guessUser.id}>'s classpect is **${randomItem(CLASSES)}** of **${randomItem(ASPECTS)}**`);
    },
};