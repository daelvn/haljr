const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

// YES: 6
// NO: 6
// MAYBE: 6
const CANONS = [
    "is **canon**", // yes
    "is **not canon**", // no
    "**might** be canon", // maybe
    "**could** be canon", // maybe
    "**could** be canon with a little bit of effort", // maybe
    "is **not canon**, and **will never be canon**, even if you run the command again", //no
    "**would** be canon if you weren't such a little bitch", // no
    "is **canon**, and will **always be canon**, even if you run the command again", // yes
    "**could** be canon, if you gave me a little kiss", // maybe
    "**could** be canon, if you asked me nicely", // maybe
    "? Hell yes, fuck yes, it's so **canon**", // yes
    "? Hell no, fuck no, it's **not canon**", // no
    "? Hmm... maybe..", // maybe
    "is **canon as fuck**", // yes
    "is the stupidest thing I've ever heard. **Not canon**", // no
    "is the coolest thing I've ever heard. **So canon**", // yes
    "is **canon** because I want to see how that goes..", // yes
    "is **not canon** because I don't want to imagine a universe where that happens" // no
];

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randomFromPair = (items) => items[Math.round(Math.random())];
const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('is-canon')
        .setDescription('Answers whether something is canon or not.')
        .addStringOption(option =>
            option.setName('text')
            .setDescription('What you want to know if it is canon or not.')
            .setRequired(true)),
    async execute(interaction) {
        let guessCanon = interaction.options.getString('text');
        return interaction.reply(`"${guessCanon}" ${randomItem(CANONS)}.`);
    },
};