const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const CSV = require("papaparse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kinlist-remove")
    .setDescription("Removes a kin from your kinlist")
    .addStringOption((option) => option.setName("name").setDescription("Name of the character you kin.").setRequired(true))
    .addStringOption((option) => option.setName("media").setDescription("Media that the kin belongs to").setRequired(true)),
  async execute(interaction) {
    const kinName = interaction.options.getString("name");
    const kinMedia = interaction.options.getString("media");

    // Prepare model
    const Profiles = interaction.client.models.get("Profiles");

    // Defer reply
    await interaction.deferReply();

    // Create entry for user if it does not exist
    const userEntry = await Profiles.findOne({ raw: true, where: { user: interaction.user.id } });
    console.log(userEntry);
    if (!userEntry) {
      try {
        Profiles.create({
          user: interaction.user.id,
          description: "",
          genders: "",
          sexualities: "",
          pronouns: "",
          flags: "",
          kins: "",
        });
      } catch (error) {
        return interaction.editReply(`Something went wrong while creating a profile. ${error.name}: ${error.message}`);
      }
    }

    // fetch current and transform
    const userProfile = await Profiles.findOne({ raw: true, where: { user: interaction.user.id } });
    let currentList = userProfile.kins.length == 0 ? [] : CSV.parse(userProfile.kins).data;
    currentList.push([kinName, kinMedia]);
    const finalList = CSV.unparse(
      currentList.filter((row) => {
        [elKinName, elKinMedia] = row;
        return !(kinName == elKinName && kinMedia == elKinMedia);
      })
    );
    // update
    const affectedRows = await Profiles.update({ kins: finalList }, { where: { user: interaction.user.id } });
    if (affectedRows < 1) {
      return interaction.editReply("Did not edit any entry!");
    }

    return interaction.editReply(`Removed ${kinName} (${kinMedia}) from your kinlist! Do \`/kinlist\` to show your full kinlist.`);
  },
};
