const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

module.exports = {
  data: new SlashCommandBuilder().setName("birthday-init").setDescription("Reschedules all birthdays"),
  async execute(interaction) {
    const Birthdays = interaction.client.models.get("Birthdays");
    if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      await interaction.reply("You do not have permissions to execute this command! (Administrator)");
      return;
    }
    if (interaction.client.birthdayInit) {
      return interaction.reply("There is no need to init again!");
    }
    interaction.client.birthdayInit = true;
    try {
      Birthdays.findAll({ attributes: ["user", "date"], raw: true })
        .then((birthdayList) => {
          for (const [bid, birthday] of birthdayList.entries()) {
            const birthdayGuild = interaction.guild;
            console.log(bid, birthday);
            const birthdayDate = birthday.date;
            birthdayGuild.members.fetch(birthday.user).then((birthdayUser) => {
              console.log(`Scheduling birthday for ${birthdayUser.displayName}: ${birthdayDate}`);
              const birthdayTrigger = (fired) => {
                const now = dayjs();
                const date = dayjs(birthdayDate, "MMMM D");
                if (!date.isValid()) {
                  throw new Error("Stored date is not valid!");
                }
                if (now.month() == date.month() && now.date() == date.date()) {
                  // rename channel
                  const birthdayChannel = birthdayGuild.channels.resolve("982752381265670154");
                  birthdayChannel
                    .setName(`happy-birthday-${birthdayUser.user.username}`)
                    .then((newChannel) => console.log(`Channel's new name is ${newChannel.name}`))
                    .catch(console.error);
                  // post in announcements
                  const announcementsChannel = birthdayGuild.channels.resolve("982755821870010508");
                  const announcementEmbed = new MessageEmbed()
                    .setColor(`#000000`)
                    .setTitle("It is someone's birthday!")
                    .setDescription(`Everyone go wish <@${birthdayUser.id}> a happy birthday!`);

                  announcementsChannel.send({ embeds: [announcementEmbed] });
                }
              };
              birthdayTrigger(dayjs());
              const job = interaction.client.schedule.scheduleJob("0 0 * * *", birthdayTrigger);
              interaction.client.scheduled.set(birthdayUser.id, job);
            });
          }
        })
        .catch(console.error);

      return interaction.reply("Done!");
    } catch (error) {
      console.log("Could not reset all scheduled events.", error.message);
    }
  },
};
