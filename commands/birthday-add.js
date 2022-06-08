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
        const Birthdays = interaction.client.models.get('Birthdays');

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
        var scheduleTrigger = async fired => {
            console.log("Event fired!", fired);
            const now = dayjs();
            if ((now.month() == date.month()) && (now.date() == date.date())) {
                // get birthday user
                const birthdayUser = interaction.user;
                // rename channel
                const birthdayChannel = interaction.guild.channels.cache.resolve('982752381265670154');
                birthdayChannel.setName(`happy-birthday-${birthdayUser.username}`)
                    .then(newChannel => console.log(`Channel's new name is ${newChannel.name}`))
                    .catch(console.error);
                // post in announcements
                const announcementsChannel = interaction.guild.channels.resolve('982755821870010508');
                const announcementEmbed = new MessageEmbed()
                    .setColor(`#000000`)
                    .setTitle("It is someone's birthday!")
                    .setDescription(`Everyone go wish <@${birthdayUser.id}> a happy birthday!`);
                await announcementsChannel.send({ embeds: [announcementEmbed] });
            }
        }
        scheduleTrigger(dayjs()); // temporary trigger for testing

        const job = interaction.client.schedule.scheduleJob("0 0 * * *", scheduleTrigger);

        // reply back
        return interaction.reply("The birthday has been set!");
    },
};