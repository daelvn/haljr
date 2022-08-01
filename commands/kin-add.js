const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const { guilds } = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kin-add")
    .setDescription("Gives yourself a kin")
    .addStringOption((option) => option.setName("name").setDescription("Name of the character you kin.").setRequired(true)),
  async execute(interaction) {
    const roleName = interaction.options.getString("name");
    const currentUser = interaction.guild.client.user;

    // resolve role
    console.log(`Searching for ${roleName.toLowerCase() + " in the flesh"}`);
    const role = interaction.guild.roles.cache.find((role) => role.name === roleName.toLowerCase() + " in the flesh");
    if (role == null) {
      return interaction.reply("Could not find a role for that kin!");
    }

    // check that role is within bounds
    if (
      role.position > interaction.guild.roles.resolve(guilds[interaction.guildId].endOfRoles).position &&
      role.position < interaction.guild.roles.botRoleFor(currentUser).position - 1
    ) {
      interaction.member.roles.add(role);

      // reply
      const replyEmbed = new MessageEmbed().setColor(role.hexColor).setTitle("Assigned a kin!").setDescription(`We gave you the kin ${roleName.toLowerCase()}`);
      return interaction.reply({ embeds: [replyEmbed] });
    } else {
      return interaction.reply(`You cannot give yourself that kin!`);
    }
  },
};
