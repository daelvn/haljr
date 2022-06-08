const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
dayjs.extend(customParseFormat);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-birthdays')
        .setDescription('Checks the birthdays coming up in the next 30 days'),
    async execute(interaction) {
        const Birthdays = interaction.client.models.get('Birthdays');
        // set dates
        const now = dayjs().subtract(2, "days");
        const d30 = dayjs().add(30, "days");
        // create collection of selected birthdays
        var upcomingList = [];
        Birthdays.findAll({ attributes: ["user", "date"], raw: true })
            .then(birthdayList => {
                for (const [bid, birthday] of birthdayList.entries()) {
                    // verify validity
                    const date = dayjs(birthday.date, "MMMM D");
                    if (!date.isValid()) {
                        throw new Error("Stored date is not valid!");
                    }
                    // check if date is between two dates
                    console.log(`? ${now.format("MMMM D")} < ${date.format("MMMM D")} < ${d30.format("MMMM D")}`);
                    if (date.isBetween(now, d30)) {
                        upcomingList.push(birthday);
                    }
                }
                // sort list by day
                upcomingList.sort((r, l) => {
                    const rdate = dayjs(r.date, "MMMM D");
                    const ldate = dayjs(l.date, "MMMM D");
                    if (rdate.date() < ldate.date()) {
                        return -1;
                    }
                    if (rdate.date() > ldate.date()) {
                        return 1;
                    }
                    // r must be equal to l
                    return 0;
                });
                // display list
                if (upcomingList.length === 0) {
                    return interaction.reply("There are no birthdays in the next 30 days!");
                }

                let replyMessage = "";
                for (const birthday of upcomingList) {
                    replyMessage += `${birthday.date} → ${interaction.guild.members.resolve(birthday.user).displayName}\n`;
                }
                return interaction.reply(replyMessage);
            })
            .catch(console.error);
        //await interaction.reply(replyMessage);
    }
};