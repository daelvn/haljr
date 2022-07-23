const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kin-remove")
    .setDescription("Removes a kin from yourself")
    .addStringOption((option) => option.setName("name").setDescription("Name of the character you do not kin anymore.").setRequired(true)),
  async execute(interaction) {
    const roleName = interaction.options.getString("name");
    const currentUser = interaction.guild.client.user;

    // resolve role
    const role = interaction.guild.roles.cache.find((role) => role.name === roleName.toLowerCase() + " in the flesh");
    if (role == null) {
      return interaction.reply("Could not find a role for that kin!");
    }

    // check that role is within bounds
    if (
      role.position > interaction.guild.roles.resolve("982715881287188501").position &&
      role.position < interaction.guild.roles.botRoleFor(currentUser).position - 1
    ) {
      interaction.member.roles.remove(role);

      // reply
      const replyEmbed = new MessageEmbed()
        .setColor(role.hexColor)
        .setTitle("Removed a kin!")
        .setDescription(`We took the kin ${roleName.toLowerCase()} away from you!`);
      return interaction.reply({ embeds: [replyEmbed] });
    } else {
      return interaction.reply(`You cannot take that kin away from yourself!`);
    }
  },
};
