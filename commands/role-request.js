const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role-request")
    .setDescription("Requests the creation of a role to the YYHY admins")
    .addStringOption((option) => option.setName("name").setDescription("Name for the requested role.").setRequired(true))
    .addStringOption((option) => option.setName("hex").setDescription("HEX color for the requested role.").setRequired(true)),
  async execute(interaction) {
    const roleName = interaction.options.getString("name");
    const roleColor = interaction.options.getString("hex").replace(/#/g, "");

    // create role request
    try {
      const RoleRequests = interaction.client.models.get("RoleRequests");
      const roleRequest = await RoleRequests.create({
        name: roleName,
        hex: roleColor,
        username: interaction.user.id,
      });

      // reply
      const replyEmbed = new MessageEmbed()
        .setColor(`#${roleRequest.hex}`)
        .setTitle("Your role has been requested!")
        .setDescription(`Requested role ${roleRequest.name} with color #${roleRequest.hex}`);
      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      await interaction.reply(`Something went wrong with the role request. ${error.name}: ${error.message}`);
    }
  },
};
