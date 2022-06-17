const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Collection } = require("discord.js");
const CSV = require("papaparse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kinlist")
    .setDescription("Shows someone's full kinlist")
    .addUserOption((option) => option.setName("user").setDescription("User to see the kinlist of")),
  async execute(interaction) {
    let user = interaction.options.getUser("user");
    if (user == null) {
      user = interaction.user;
    }
    // get model
    const Profiles = interaction.client.models.get("Profiles");

    // Defer reply
    await interaction.deferReply();

    // Create entry for user if it does not exist
    const userEntry = await Profiles.findOne({ raw: true, where: { user: user.id } });
    console.log(userEntry);
    if (!userEntry) {
      try {
        Profiles.create({
          user: user.id,
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

    // Top role for colors
    const topRoleColor = interaction.guild.members.resolve(user.id).displayHexColor;

    // Setup embed
    const replyEmbed = new MessageEmbed()
      .setColor(topRoleColor)
      .setAuthor({
        name: user.tag,
        iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`,
      })
      .setTitle("Kinlist")
      .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`);

    //// Fetch data progressively ////
    const userProfile = await Profiles.findOne({ raw: true, where: { user: user.id } });
    let currentList = userProfile.kins.length == 0 ? [] : CSV.parse(userProfile.kins).data;

    // Process kinlist
    let kinlist = new Collection();

    for (const [kin, media] of currentList) {
      // create media list if it does not exist
      if (!kinlist.get(media)) {
        kinlist.set(media, []);
      }
      // get list and push
      let mediaList = kinlist.get(media);
      mediaList.push(kin);
      // resave list
      kinlist.set(media, mediaList);
    }

    // Process embed
    if (kinlist.size == 0) {
      replyEmbed.setDescription("(none)");
      return interaction.editReply({ embeds: [replyEmbed] });
    }
    kinlist.each((mediaList, mediaName) => {
      replyEmbed.addField(mediaName, mediaList.join("\n"), true);
    });

    // return embed
    return interaction.editReply({ embeds: [replyEmbed] });
  },
};
