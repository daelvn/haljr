const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != "undefined" ? args[number] : match;
    });
  };
}

// turn into ping
const userToPing = (user) => `<@${user.id}>`;

const QUADRANTS = ["♥️", "♦️", "♣️", "♠️"];
const MESSAGES = [
  "{0} is in a matespritship (♥️) with {1}!",
  "{0} is in a moirallegiance (♦️) with {1}!",
  "{0} is in a kismesissitude (♠️) with {1}!",
  "{0} is in an auspisticism (♣️) with {1}! {2} is the auspistice.",
  "{0} is flushed (♥️) for {1}, but {1} doesn't love {0} back!",
  "{1} is flushed (♥️) for {0}, but {0} doesn't love {1} back!",
  "{0} is pale (♦️) for {1}, but {1} doesn't reciprocate!",
  "{1} is pale (♦️) for {0}, but {0} doesn't reciprocate!",
  "{0} is pitch (♠️) for {1}, but {1} doesn't hate {0} back!",
  "{1} is pitch (♠️) for {0}, but {0} doesn't hate {1} back!",
  "{2} wants to be {0} and {1}'s auspistice (♣️)!",
  "{0} and {1} hate each other platonically.",
  "{0} and {1} have no chemistry between them.",
  "{0} and {1} are only fuckbuddies.",
  "{0} and {1}'s relationship trascends quadrants!",
  "{0} and {1} are just friends.",
  "{0} and {1} would never and should never touch each other.",
];

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guess-quadrant")
    .setDescription("Guesses what quadrant two people are in")
    .addUserOption((option) => option.setName("user1").setDescription("First user in the quadrant").setRequired(true))
    .addUserOption((option) => option.setName("user2").setDescription("Second user in the quadrant").setRequired(true))
    .addBooleanOption((option) => option.setName("simple").setDescription('If set to "True" it will only give simple quadrant messages'))
    .addBooleanOption((option) => option.setName("force-auspistice").setDescription('If set to "True" it will always pick auspistice messages')),
  async execute(interaction) {
    const guessUser1 = interaction.options.getUser("user1");
    const guessUser2 = interaction.options.getUser("user2");
    const isSimple = interaction.options.getBoolean("simple");
    const isForcingAuspistice = interaction.options.getBoolean("force-auspistice");

    if (isSimple) {
      return interaction.reply(`${userToPing(guessUser1)} ${randomItem(QUADRANTS)} ${userToPing(guessUser2)}`);
    }

    await interaction.deferReply();

    interaction.guild.members
      .fetch()
      .then((members) => {
        let randomUser = interaction.user;
        console.log(`First random pick: ${randomUser.username}`);
        while (randomUser.username == guessUser1.username || randomUser.username == guessUser2.username || randomUser.bot) {
          randomUser = members.random().user;
          console.log(`New random pick: ${randomUser.username}`);
        }

        if (isForcingAuspistice) {
          return interaction.editReply(MESSAGES[3].format(userToPing(guessUser1), userToPing(guessUser2), userToPing(randomUser)));
        }

        return interaction.editReply(randomItem(MESSAGES).format(userToPing(guessUser1), userToPing(guessUser2), userToPing(randomUser)));
      })
      .catch((msg) => {
        console.error(msg);
        return interaction.editReply("Something went wrong! Please go yell at Hal about it.");
      });
  },
};
