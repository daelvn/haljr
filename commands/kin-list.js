const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const { guilds, roleRelativePosition } = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder().setName("kin-list").setDescription("Lists all available kins"),
  async execute(interaction) {
    const currentUser = interaction.guild.client.user;
    const finalRole = interaction.guild.roles.resolve(guilds[interaction.guildId].endOfRoles);
    const botRole = interaction.guild.roles.botRoleFor(currentUser);

    interaction.guild.roles.fetch().then((roles) => {
      var pages = [];
      let rolemap = roles
        .sort((a, b) => b.position - a.position)
        .map((r) => r)
        .filter((r) => r.position < botRole.position + roleRelativePosition) // list begin
        .filter((r) => r.position > finalRole.position) // list end
        .filter((r) => /in the flesh/g.test(r.name)) // has "in the flesh"
        .join("\n");
      if (rolemap.length > 1024) {
        let parts = rolemap.match(/[\s\S]{1,920}/gm);
        console.log(`Rolemap length (${rolemap.length}) vs. 920s (${parts.length})`);
        for (let [n, part] of parts.entries()) {
          pages.push(new MessageEmbed().addField(`Kin Role List (page ${n + 1}/${parts.length})`, part));
        }
        const buttonPaginator = new ButtonPaginator(interaction, { pages });
        return buttonPaginator.send();
      }
      if (!rolemap) rolemap = "No roles";

      const replyEmbed = new MessageEmbed()
        .addField("Role List", rolemap)
        .addField("Instructions", "Use `/kin-add Character Name` to give yourself a Kin Role. There is no need to include 'in the flesh'.");

      return interaction.reply({ embeds: [replyEmbed] });
    });
  },
};
