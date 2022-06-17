const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const { endOfRoles, roleRelativePosition } = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder().setName("kin-list").setDescription("Lists all available kins"),
  async execute(interaction) {
    const currentUser = interaction.guild.client.user;
    const finalRole = interaction.guild.roles.resolve(endOfRoles);
    const botRole = interaction.guild.roles.botRoleFor(currentUser);

    interaction.guild.roles.fetch().then((roles) => {
      let rolemap = roles
        .sort((a, b) => b.position - a.position)
        .map((r) => r)
        .filter((r) => r.position < botRole.position + roleRelativePosition) // list begin
        .filter((r) => r.position > finalRole.position) // list end
        .filter((r) => /in the flesh/g.test(r.name)) // has "in the flesh"
        .join("\n");
      if (rolemap.length > 1024) rolemap = "Too many roles to display";
      if (!rolemap) rolemap = "No roles";

      const replyEmbed = new MessageEmbed()
        .addField("Role List", rolemap)
        .addField("Instructions", "Use `/kin-add Character Name` to give yourself a Kin Role. There is no need to include 'in the flesh'.");

      return interaction.reply({ embeds: [replyEmbed] });
    });
  },
};
