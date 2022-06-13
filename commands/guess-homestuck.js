const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

const CLASSES = ["Thief", "Rogue", "Bard", "Prince", "Heir", "Page", "Seer", "Maid", "Sylph", "Knight", "Witch", "Mage", "Muse", "Lord"];
const ASPECTS = ["Space", "Time", "Mind", "Heart", "Hope", "Rage", "Breath", "Blood", "Life", "Doom", "Life", "Doom", "Light", "Void"];
const SWAYS = ["Derse", "Prospit"];
const BLOODS = ["Rust", "Bronze", "Gold", "Lime", "Candy Red", "Red", "Jade", "Teal", "Cobalt", "Indigo", "Purple", "Violet", "Fuchsia"];
const DEATHS = ["Just", "Heroic"];

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randomFromPair = (items) => items[Math.round(Math.random())];
const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess-homestuck')
        .setDescription('Guesses someone\'s Homestuck characteristics')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to make fun of.')),
    async execute(interaction) {
        let guessUser = interaction.options.getUser('user');
        if (guessUser == null) {
            guessUser = interaction.user;
        }
        return interaction.reply(`<@${guessUser.id}>'s classpect is **${randomItem(CLASSES)}** of **${randomItem(ASPECTS)}**\nTheir lunar sway is **${randomFromPair(SWAYS)}**\nTheir blood color is **${randomItem(BLOODS)}**\nTheir death is **${randomFromPair(DEATHS)}**`);
    },
};