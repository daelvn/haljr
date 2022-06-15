const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const CSV = require("papaparse");

const CLASSES = ["Thief", "Rogue", "Bard", "Prince", "Heir", "Page", "Seer", "Maid", "Sylph", "Knight", "Witch", "Mage", "Muse", "Lord"];
const ASPECTS = ["Space", "Time", "Mind", "Heart", "Hope", "Rage", "Breath", "Blood", "Life", "Doom", "Life", "Doom", "Light", "Void"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("homestuck-edit")
    .setDescription("Edits your homestuck profile.")
    .addStringOption((option) => option.setName("classpect").setDescription('Adds a classpect in the format "(Class) of (Aspect)"'))
    .addStringOption((option) => option.setName("remove-classpect").setDescription('Removes a classpect in the format "(Class) of (Aspect)"'))
    .addStringOption((option) => option.setName("species").setDescription("Adds a species"))
    .addStringOption((option) => option.setName("remove-species").setDescription("Species to remove off the list"))
    .addStringOption((option) => option.setName("blood").setDescription("Adds a blood color"))
    .addStringOption((option) => option.setName("remove-blood").setDescription("Blood color to remove off the list"))
    .addStringOption((option) => option.setName("sway").setDescription("Adds your lunar sway"))
    .addBooleanOption((option) => option.setName("remove-sway").setDescription('If set to "True", will remove the lunar sway'))
    .addStringOption((option) => option.setName("lusus").setDescription("Adds a lusus"))
    .addStringOption((option) => option.setName("remove-lusus").setDescription("Lusus to remove off the list"))
    .addStringOption((option) => option.setName("matesprit").setDescription("Changes your matesprit(s)"))
    .addBooleanOption((option) => option.setName("remove-matesprits").setDescription('If set to "True", will remove all your matesprits'))
    .addStringOption((option) => option.setName("kismesis").setDescription("Changes your kismesis/es"))
    .addBooleanOption((option) => option.setName("remove-kismeses").setDescription('If set to "True", will remove all your kismeses'))
    .addStringOption((option) => option.setName("moirail").setDescription("Changes your moirail(s)"))
    .addBooleanOption((option) => option.setName("remove-moirails").setDescription('If set to "True", will remove all your moirails'))
    .addStringOption((option) => option.setName("auspistice").setDescription("Changes your auspistice(s)"))
    .addBooleanOption((option) => option.setName("remove-auspistices").setDescription('If set to "True", will remove all your auspistices')),
  async execute(interaction) {
    // fetch all variables
    const classpect = interaction.options.getString("classpect");
    const remove_classpect = interaction.options.getString("remove-classpect");
    const species = interaction.options.getString("species");
    const remove_species = interaction.options.getString("remove-species");
    const blood = interaction.options.getString("blood");
    const remove_blood = interaction.options.getString("remove-blood");
    const sway = interaction.options.getString("sway");
    const remove_sway = interaction.options.getBoolean("remove-sway");
    const lusus = interaction.options.getString("lusus");
    const remove_lusus = interaction.options.getString("remove-lusus");
    const matesprit = interaction.options.getString("matesprit");
    const remove_matesprits = interaction.options.getBoolean("remove-matesprits");
    const kismesis = interaction.options.getString("kismesis");
    const remove_kismeses = interaction.options.getBoolean("remove-kismeses");
    const moirail = interaction.options.getString("moirail");
    const remove_moirails = interaction.options.getBoolean("remove-moirails");
    const auspistice = interaction.options.getString("auspistice");
    const remove_auspistices = interaction.options.getBoolean("remove-auspistices");

    // Prepare model
    const HomestuckProfile = interaction.client.models.get("HomestuckProfiles");

    // Defer reply
    await interaction.deferReply();

    // Create entry for user if it does not exist
    const userEntry = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
    console.log(userEntry);
    if (!userEntry) {
      try {
        HomestuckProfile.create({
          user: interaction.user.id,
          classpects: "",
          species: "",
          color: "",
          sway: "",
          lusii: "",
          quadrants: "",
        });
      } catch (error) {
        return interaction.editReply(`Something went wrong while creating a profile. ${error.name}: ${error.message}`);
      }
    }

    // Prepare collection of what was edited.
    let edited = [];

    // Classpects
    if (classpect != null) {
      edited.push("Classpects");
      // test format
      const classpectFormat = new RegExp(`(${CLASSES.join("|")}) of (${ASPECTS.join("|")})`);
      if (!classpectFormat.test(classpect)) {
        return interaction.editReply("Classpect is not in the format `Class of Aspect` or is not a valid classpect!");
      }
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.classpects.length == 0 ? [] : CSV.parse(userProfile.classpects).data[0];
      currentList.push(classpect);
      const finalList = CSV.unparse([currentList]);
      // update
      const affectedRows = await HomestuckProfile.update({ classpects: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    } else if (remove_classpect != null) {
      edited.push("Classpects");
      // test format
      const classpectFormat = new RegExp(`(${CLASSES.join("|")}) of (${ASPECTS.join("|")})`);
      if (!classpectFormat.test(remove_classpect)) {
        return interaction.editReply("Classpect is not in the format `Class of Aspect` or is not a valid classpect!");
      }
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.classpects.length == 0 ? [] : CSV.parse(userProfile.classpects).data[0];
      const finalList = CSV.unparse([currentList.filter((e) => e != remove_classpect)]);
      // update
      const affectedRows = await HomestuckProfile.update({ classpects: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    }

    // Species
    if (species != null) {
      edited.push("Species");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.species.length == 0 ? [] : CSV.parse(userProfile.species).data[0];
      currentList.push(species);
      const finalList = CSV.unparse([currentList]);
      // update
      const affectedRows = await HomestuckProfile.update({ species: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    } else if (remove_species != null) {
      edited.push("Species");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.species.length == 0 ? [] : CSV.parse(userProfile.species).data[0];
      const finalList = CSV.unparse([currentList.filter((e) => e != remove_species)]);
      // update
      const affectedRows = await HomestuckProfile.update({ species: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    }

    // Blood
    if (blood != null) {
      edited.push("Blood colors");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.color.length == 0 ? [] : CSV.parse(userProfile.color).data[0];
      currentList.push(blood);
      const finalList = CSV.unparse([currentList]);
      // update
      const affectedRows = await HomestuckProfile.update({ color: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    } else if (remove_blood != null) {
      edited.push("Blood colors");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.color.length == 0 ? [] : CSV.parse(userProfile.color).data[0];
      const finalList = CSV.unparse([currentList.filter((e) => e != remove_blood)]);
      // update
      const affectedRows = await HomestuckProfile.update({ color: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    }

    // Sway
    if (sway != null) {
      edited.push("Lunar sways");
      // update
      const affectedRows = await HomestuckProfile.update({ sway: sway }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    } else if (remove_sway) {
      edited.push("Lunar sways");
      // update
      const affectedRows = await HomestuckProfile.update({ sway: "" }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    }

    // Lusii
    if (lusus != null) {
      edited.push("Lusii");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.lusii.length == 0 ? [] : CSV.parse(userProfile.lusii).data[0];
      currentList.push(lusus);
      const finalList = CSV.unparse([currentList]);
      // update
      const affectedRows = await HomestuckProfile.update({ lusii: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    } else if (remove_lusus != null) {
      edited.push("Lusii");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.lusii.length == 0 ? [] : CSV.parse(userProfile.lusii).data[0];
      const finalList = CSV.unparse([currentList.filter((e) => e != remove_lusus)]);
      // update
      const affectedRows = await HomestuckProfile.update({ lusii: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    }

    // Matesprit
    if (matesprit != null) {
      edited.push("Matesprits");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.quadrants.length == 0 ? [] : CSV.parse(userProfile.quadrants).data[0];
      currentList.push(`m#${matesprit}`);
      const finalList = CSV.unparse([currentList]);
      // update
      const affectedRows = await HomestuckProfile.update({ quadrants: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    } else if (remove_matesprits) {
      edited.push("Matesprits");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.quadrants.length == 0 ? [] : CSV.parse(userProfile.quadrants).data[0];
      const finalList = CSV.unparse([currentList.filter((e) => !/^m#/gi.test(e))]);
      // update
      const affectedRows = await HomestuckProfile.update({ quadrants: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    }

    // Kismesis
    if (kismesis != null) {
      edited.push("Kismeses");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.quadrants.length == 0 ? [] : CSV.parse(userProfile.quadrants).data[0];
      currentList.push(`k#${kismesis}`);
      const finalList = CSV.unparse([currentList]);
      // update
      const affectedRows = await HomestuckProfile.update({ quadrants: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    } else if (remove_kismeses) {
      edited.push("Kismeses");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.quadrants.length == 0 ? [] : CSV.parse(userProfile.quadrants).data[0];
      const finalList = CSV.unparse([currentList.filter((e) => !/^k#/gi.test(e))]);
      // update
      const affectedRows = await HomestuckProfile.update({ quadrants: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    }

    // Moirail
    if (moirail != null) {
      edited.push("Moirails");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.quadrants.length == 0 ? [] : CSV.parse(userProfile.quadrants).data[0];
      currentList.push(`l#${moirail}`);
      const finalList = CSV.unparse([currentList]);
      // update
      const affectedRows = await HomestuckProfile.update({ quadrants: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    } else if (remove_moirails) {
      edited.push("Moirails");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.quadrants.length == 0 ? [] : CSV.parse(userProfile.quadrants).data[0];
      const finalList = CSV.unparse([currentList.filter((e) => !/^l#/gi.test(e))]);
      // update
      const affectedRows = await HomestuckProfile.update({ quadrants: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    }

    // Auspistice
    if (auspistice != null) {
      edited.push("Auspistices");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.quadrants.length == 0 ? [] : CSV.parse(userProfile.quadrants).data[0];
      currentList.push(`a#${auspistice}`);
      const finalList = CSV.unparse([currentList]);
      // update
      const affectedRows = await HomestuckProfile.update({ quadrants: finalList }, { where: { user: interaction.user.id } });
      if (affectedRows < 1) {
        return interaction.editReply("Did not edit any entry!");
      }
    } else if (remove_auspistices) {
      edited.push("Auspistices");
      // fetch current and transform
      const userProfile = await HomestuckProfile.findOne({ raw: true, where: { user: interaction.user.id } });
      let currentList = userProfile.quadrants.length == 0 ? [] : CSV.parse(userProfile.quadrants).data[0];
      const finalList = CSV.unparse([currentList.filter((e) => !/^a#/gi.test(e))]);
      // update
      const affectedRows = await HomestuckProfile.update({ quadrants: finalList }, { where: { user: interaction.user.id } });
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
