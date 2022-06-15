const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const CSV = require("papaparse");
const resizeImage = require('resize-image-buffer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile-edit")
    .setDescription("Edits your profile.")
    .addStringOption((option) => option.setName("gender").setDescription('Adds a gender to your gender list'))
    .addStringOption((option) => option.setName("remove-gender").setDescription('Removes one of your genders'))
    .addStringOption((option) => option.setName("sexuality").setDescription("Adds a sexuality to your list"))
    .addStringOption((option) => option.setName("remove-sexuality").setDescription("Removes one of your sexualities"))
    .addStringOption((option) => option.setName("pronoun").setDescription("Adds a pronoun to your list in the format Pronoun/Pronoun"))
    .addStringOption((option) => option.setName("remove-pronoun").setDescription("Pronouns to remove off the list"))
    .addAttachmentOption((option) => option.setName("flag").setDescription("Adds a flag to your profile"))
    .addIntegerOption((option) => option.setName("remove-flag").setDescription('Number of the flag to remove')),
  async execute(interaction) {
    // fetch all variables
    const gender = interaction.options.getString("gender");
    const remove_gender = interaction.options.getString("remove-gender");
    const sexuality = interaction.options.getString("sexuality");
    const remove_sexuality = interaction.options.getString("remove-sexuality");
    const pronoun = interaction.options.getString("pronoun");
    const remove_pronoun = interaction.options.getString("remove-pronoun");
    const flag = interaction.options.getAttachment("flag");
    const remove_flag = interaction.options.getNumber("remove-flag");
    
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

    // Prepare collection of what was edited.
    let edited = [];

    // Genders
    if (gender != null) {
      edited.push("Genders");
      // fetch current and transform
      const userProfile = await Profiles.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.genders.length == 0 ? [] : CSV.parse(userProfile.genders).data[0];
      currentList.push(gender);
      const finalList = CSV.unparse([currentList]);
      // update
      const affectedRows = await Profiles.update({ genders: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    } else if (remove_gender != null) {
      edited.push("Genders");
      // fetch current and transform
      const userProfile = await Profiles.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.genders.length == 0 ? [] : CSV.parse(userProfile.genders).data[0];
      const finalList = CSV.unparse([currentList.filter((e) => e != remove_gender)]);
      // update
      const affectedRows = await Profiles.update({ genders: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    }

    // Sexualities
    if (sexuality != null) {
      edited.push("Sexualities");
      // fetch current and transform
      const userProfile = await Profiles.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.sexualities.length == 0 ? [] : CSV.parse(userProfile.sexualities).data[0];
      currentList.push(sexuality);
      const finalList = CSV.unparse([currentList]);
      // update
      const affectedRows = await Profiles.update({ sexualities: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    } else if (remove_sexuality != null) {
      edited.push("Sexualities");
      // fetch current and transform
      const userProfile = await Profiles.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.sexualities.length == 0 ? [] : CSV.parse(userProfile.sexualities).data[0];
      const finalList = CSV.unparse([currentList.filter((e) => e != remove_sexuality)]);
      // update
      const affectedRows = await Profiles.update({ sexualities: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    }

    // Pronouns
    if (pronoun != null) {
      edited.push("Pronouns");
      // test format
      const pronounFormat = new RegExp(`[a-zA-Z]+/[a-zA-Z]+`);
      if (!pronounFormat.test(pronoun)) {
        return interaction.editReply("Pronoun is not in the format `Pronoun/Pronoun` or is not a valid pronoun set!");
      }
      // fetch current and transform
      const userProfile = await Profiles.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.pronouns.length == 0 ? [] : CSV.parse(userProfile.pronouns).data[0];
      currentList.push(pronoun);
      const finalList = CSV.unparse([currentList]);
      // update
      const affectedRows = await Profiles.update({ pronouns: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    } else if (remove_pronoun != null) {
      edited.push("Pronouns");
      // test format
      const pronounFormat = new RegExp(`[a-zA-Z]+/[a-zA-Z]+`);
      if (!pronounFormat.test(pronoun)) {
        return interaction.editReply("Pronoun is not in the format `Pronoun/Pronoun` or is not a valid pronoun set!");
      }
      // fetch current and transform
      const userProfile = await Profiles.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.pronouns.length == 0 ? [] : CSV.parse(userProfile.pronouns).data[0];
      const finalList = CSV.unparse([currentList.filter((e) => e != remove_pronouns)]);
      // update
      const affectedRows = await Profiles.update({ pronouns: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    }

    // Flags
    if (flag != null) {
      edited.push("Flags");
      // Get image from attachment
      var request = require('request').defaults({ encoding: null });
      request.get(flag.url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          // Resize image to 64 x 128
          const originalImage = Buffer.from(body);
          resizeImage(originalImage, {width: 128, height: 64})
            .then(image => {
              // Convert to Base64
              const baseImage = "data:" + response.headers["content-type"] + ";base64," + image.toString('base64');
              // Fetch current and transform
              Profiles.findOne({raw: true, where: {user: interaction.user.id}})
                .then(userProfile => {
                  let currentList = userProfile.flags.length == 0 ? [] : CSV.parse(userProfile.flags, {delimiter: "|"}).data[0];
                  currentList.push(pronoun);
                  const finalList = CSV.unparse([currentList], {delimiter: "|"});
                  // Update database
                  Profiles.update({ pronouns: finalList }, { where: { user: interaction.user.id } })
                    .then(affectedRows => {
                      if (affectedRows < 1) {
                        return interaction.editReply("Did not edit any entry!");
                      }
                    });
                })
            })
            .catch(error => {
              console.log(error);
              return interaction.editReply(`Something went wrong sizing down the flag, ${error.message}`);
            });
        } else {
          return interaction.editReply(`Something went wrong downloading the flag. ${error}`);
        }
      });
    } else if (remove_flag != null) {
      edited.push("Flags");
      // Fetch current and transform
      const userProfile = await Profiles.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.flags.length == 0 ? [] : CSV.parse(userProfile.flags, {delimiter: "|"}).data[0];
      const finalList = CSV.unparse([currentList.splice(remove_flag - 1, 1)], {delimiter: "|"});
      // update
      const affectedRows = await Profiles.update({ flags: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    }

    // Return all that has been edited
    let replyMessage = "__**List of edited fields:**__\n";
    for (const field of edited) {
      replyMessage += `- **${field}** have been edited!\n`;
    }
    return interaction.editReply(replyMessage);
  },
};
