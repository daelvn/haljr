const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const { endOfRoles, roleRelativePosition } = require("../config.json");
const { ButtonPaginator } = require("@psibean/discord.js-pagination");

module.exports = {
  data: new SlashCommandBuilder().setName("role-list").setDescription("Lists all available roles"),
  async execute(interaction) {
    const currentUser = interaction.guild.client.user;
    const finalRole = interaction.guild.roles.resolve(endOfRoles);
    const botRole = interaction.guild.roles.botRoleFor(currentUser);

    await interaction.deferReply();

    interaction.guild.roles.fetch().then((roles) => {
      var pages = [];
      let rolemap = roles
        .sort((a, b) => b.position - a.position)
        .map((r) => r)
        .filter((r) => r.position < botRole.position + roleRelativePosition) // list begin
        .filter((r) => r.position > finalRole.position) // list end
        .join("\n");
      // split role list into several embeds of 1024 max length
      if (rolemap.length > 1024) {
        let parts = rolemap.match(/[\s\S]{1,920}/gm);
        console.log(`Rolemap length (${rolemap.length}) vs. 920s (${parts.length})`);
        for (let [n, part] of parts.entries()) {
          pages.push(new MessageEmbed().addField(`Role List (page ${n + 1}/${parts.length})`, part));
        }
        const buttonPaginator = new ButtonPaginator(interaction, { pages });
        return buttonPaginator.send();
      }
      if (!rolemap) rolemap = "No roles";

      const replyEmbed = new MessageEmbed().addField("Role List", rolemap);

      return interaction.reply({ embeds: [replyEmbed] });
    });
  },
};
