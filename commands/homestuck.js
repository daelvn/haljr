const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Collection } = require("discord.js");
const CSV = require("papaparse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("homestuck")
    .setDescription("Displays someone's Homestuck profile")
    .addUserOption((option) => option.setName("user").setDescription("User you want the profile of")),
  async execute(interaction) {
    // fetch all variables
    let user = interaction.options.getUser("user");
    //console.log(`User: ${user.tag}`);
    if (!user) {
      user = interaction.user;
    }
    console.log(`Final user: ${user.tag}`);
    const HomestuckProfiles = interaction.client.models.get("HomestuckProfiles");
    const Profiles = interaction.client.models.get("Profiles");

    // Defer reply
    await interaction.deferReply();

    // Create entry for user if it does not exist
    let userEntry = await HomestuckProfiles.findOne({ raw: true, where: { user: user.id } });
    console.log(userEntry);
    if (!userEntry) {
      try {
        userEntry = HomestuckProfiles.create({
          user: user.id,
          classpects: "",
          species: "",
          color: "",
          sway: "",
          lusii: "",
          quadrants: "",
        });
      } catch (error) {
        return interaction.editReply(`Something went wrong while creating a Homestuck profile. ${error.name}: ${error.message}`);
      }
    }
    let commonUserEntry = await Profiles.findOne({ raw: true, where: { user: user.id } });
    console.log(commonUserEntry);
    if (!commonUserEntry) {
      try {
        commonUserEntry = Profiles.create({
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
      .setTitle("Homestuck Profile")
      .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`);

    //// Fetch data progressively ////
    const userProfile = await HomestuckProfiles.findOne({ raw: true, where: { user: user.id } });
    // Classpect
    console.log("Classpect");
    try {
      // FIXME theres an error here
      let currentList = userProfile.classpects.length == 0 ? ["(none)"] : CSV.parse(userProfile.classpects).data[0];
      replyEmbed.addField("Classpects", currentList.join("\n"), true);
    } catch (error) {
      return interaction.editReply(`Something went wrong while fetching profile data. ${error.name}: ${error.message}`);
    }

    // Species
    console.log("Species");
    try {
      let currentList = userProfile.species.length == 0 ? ["(none)"] : CSV.parse(userProfile.species).data[0];
      replyEmbed.addField("Species", currentList.join("\n"), true);
    } catch (error) {
      return interaction.editReply(`Something went wrong while fetching profile data. ${error.name}: ${error.message}`);
    }

    // Lusii
    console.log("Lusii");
    try {
      let currentList = userProfile.lusii.length == 0 ? ["(none)"] : CSV.parse(userProfile.lusii).data[0];
      replyEmbed.addField("Lusii", currentList.join("\n"), true);
    } catch (error) {
      return interaction.editReply(`Something went wrong while fetching profile data. ${error.name}: ${error.message}`);
    }

    // Blood color
    console.log("Blood");
    try {
      let currentList = userProfile.color.length == 0 ? ["(none)"] : CSV.parse(userProfile.color).data[0];
      replyEmbed.addField("Bloods", currentList.join("\n"), true);
    } catch (error) {
      return interaction.editReply(`Something went wrong while fetching profile data. ${error.name}: ${error.message}`);
    }

    // Sway
    console.log("Sway");
    try {
      let currentList = userProfile.sway.length == 0 ? ["(none)"] : [userProfile.sway];
      replyEmbed.addField("Lunar sway", currentList.join("\n"), true);
    } catch (error) {
      return interaction.editReply(`Something went wrong while fetching profile data. ${error.name}: ${error.message}`);
    }

    // Quadrants
    console.log("Quadrants");
    try {
      let currentList = userProfile.quadrants.length == 0 ? ["♥️ (none)", "♦️ (none)", "♠️ (none)", "♣️ (none)"] : CSV.parse(userProfile.quadrants).data[0];
      let finalList = currentList.map((el) => el.replace(/m#/gi, "♥️ ").replace(/l#/gi, "♦️ ").replace(/k#/gi, "♠️ ").replace(/a#/gi, "♣️ "));
      replyEmbed.addField("Quadrants", finalList.join("\n"), true);
    } catch (error) {
      return interaction.editReply(`Something went wrong while fetching profile data. ${error.name}: ${error.message}`);
    }

    // Kins
    console.log("Kins");
    try {
      // Process kinlist
      let kinlist = new Collection();
      let kinCurrentList = commonUserEntry.kins.length == 0 ? [] : CSV.parse(commonUserEntry.kins).data;

      for (const [kin, media] of kinCurrentList) {
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

      if (kinlist.get("Homestuck")) {
        let homestuckKinList = kinlist.get("Homestuck");
        replyEmbed.addField("Kins", homestuckKinList.join("\n"), true);
      }
    } catch (error) {
      return interaction.editReply(`Something went wrong while fetching kin data. ${error.name}: ${error.message}`);
    }

    // Send embed
    return interaction.editReply({ embeds: [replyEmbed] });
  },
};
