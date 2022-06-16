const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");
const CSV = require("papaparse");
const Canvas = require("@napi-rs/canvas");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Displays someone's profile")
    .addUserOption((option) => option.setName("user").setDescription("User you want the profile of")),
  async execute(interaction) {
    // fetch all variables
    let user = interaction.options.getUser("user");
    let replyAttachment;
    if (!user) {
      user = interaction.user;
    }
    console.log(`Final user: ${user.tag}`);
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
      .setTitle("Profile")
      .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`);

    //// Fetch data progressively ////
    const userProfile = await Profiles.findOne({ raw: true, where: { user: user.id } });
    // Descriptions
    console.log("Description");
    try {
      let currentList = userProfile.description.length == 0 ? "(none)" : userProfile.description;
      replyEmbed.addField("Description", currentList.replace(/\\n/g, "\n"), false);
    } catch (error) {
      return interaction.editReply(`Something went wrong while fetching profile data. ${error.name}: ${error.message}`);
    }

    // Genders
    console.log("Genders");
    try {
      let currentList = userProfile.genders.length == 0 ? ["(none)"] : CSV.parse(userProfile.genders).data[0];
      replyEmbed.addField("Genders", currentList.join("\n"), true);
    } catch (error) {
      return interaction.editReply(`Something went wrong while fetching profile data. ${error.name}: ${error.message}`);
    }

    // Sexualities
    console.log("Sexualities");
    try {
      let currentList = userProfile.sexualities.length == 0 ? ["(none)"] : CSV.parse(userProfile.sexualities).data[0];
      replyEmbed.addField("Sexualities", currentList.join("\n"), true);
    } catch (error) {
      return interaction.editReply(`Something went wrong while fetching profile data. ${error.name}: ${error.message}`);
    }

    // Pronouns
    console.log("Pronouns");
    try {
      let currentList = userProfile.pronouns.length == 0 ? ["(none)"] : CSV.parse(userProfile.pronouns).data[0];
      replyEmbed.addField("Pronouns", currentList.join("\n"), true);
    } catch (error) {
      return interaction.editReply(`Something went wrong while fetching profile data. ${error.name}: ${error.message}`);
    }

    // Flags
    console.log("Flags");
    try {
      let currentList = userProfile.flags.length == 0 ? [] : CSV.parse(userProfile.flags, { delimiter: "|" }).data[0];
      if (currentList.length == 0) {
        replyEmbed.addField("Flags", "(none)", true);
      } else {
        // Create canvas
        const columns = 5;
        const rows = Math.ceil(currentList.length / columns);
        const flagSizeW = 128;
        const flagSizeH = 64;
        const padding = 32;
        const canvasW = flagSizeW * columns + padding * (columns + 2);
        const canvasH = flagSizeH * rows + padding * (rows + 2);
        let replyCanvas = Canvas.createCanvas(canvasW, canvasH);
        let replyCanvasContext = replyCanvas.getContext("2d");
        // Convert Base64 images into Canvas objects
        const imageList = currentList.map((el, i) => {
          let elImg = new Canvas.Image();
          const j = i + 1;
          const hpos = 1 + ((j - 1) % columns); // horizontal grid position of flag
          const vpos = Math.ceil(j / columns); // vertical grid position of flag
          console.log("i/j/rows/cols/hpos/vpos: ", i, j, rows, columns, hpos, vpos);
          const posX = hpos * padding + (hpos - 1) * flagSizeW; // horizontal first pixel position
          const posY = vpos * padding + (vpos - 1) * flagSizeH; // vertical first pixel position
          // convert base64 to buffer then to image
          const asBuffer = Buffer.from(el, "base64");
          const flagPath = `img/cache-${userProfile.id}-${i}.png`;
          fs.writeFileSync(flagPath, asBuffer);
          elImg.src = fs.readFileSync(flagPath);
          // set onload
          elImg.onload = (ctx) => replyCanvasContext.drawImage(elImg, posX, posY);
          return elImg;
        });
        // Load all
        imageList.forEach((elImg) => {
          elImg.onload();
        });
        // Create attachment
        replyAttachment = new MessageAttachment(replyCanvas.toBuffer("image/png"), "profile-flags.png");
        replyEmbed.setImage(`attachment://${replyAttachment.name}`);
      }
    } catch (error) {
      console.log(error);
      return interaction.editReply(`Something went wrong while fetching profile data. ${error.name}: ${error.message}`);
    }

    // Send embed
    return interaction.editReply({ embeds: [replyEmbed], files: replyAttachment ? [replyAttachment] : [] });
  },
};
