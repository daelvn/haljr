const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("check-role-requests").setDescription("Checks all the roles that have been requested."),
  async execute(interaction) {
    // check permissions
    if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      await interaction.reply("You do not have permissions to execute this command! (Manage Roles)");
      return;
    }

    const RoleRequests = interaction.client.models.get("RoleRequests");
    const currentUser = interaction.guild.client.user;

    let replyButtons;

    let newRoleName = "";
    let newRoleHex = "";
    let requestUsername = "";
    // create role request
    try {
      const roleRequest = await RoleRequests.findOne({
        where: { id: await RoleRequests.max("id") },
      });

      if (roleRequest == null) {
        return interaction.reply("There are no role requests left to check!");
      }

      // create embed
      const replyEmbed = new MessageEmbed()
        .setColor(`#${roleRequest.hex}`)
        .setTitle(roleRequest.name)
        .setDescription(`<@${roleRequest.username}> Requested role ${roleRequest.name} with color #${roleRequest.hex}`);

      // set variables
      newRoleName = roleRequest.name;
      newRoleHex = roleRequest.hex;
      requestUsername = roleRequest.username;

      // create buttons
      replyButtons = new MessageActionRow().addComponents(
        new MessageButton().setCustomId("role-accept").setLabel("Create").setStyle("SUCCESS"),
        new MessageButton().setCustomId("role-deny").setLabel("Deny").setStyle("DANGER")
      );

      await interaction.reply({ embeds: [replyEmbed], components: [replyButtons] });
    } catch (error) {
      return interaction.reply(`Something went wrong with the command. Could not fetch role request. ${error.name}: ${error.message}`);
    }

    // create message collector
    let filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: "BUTTON", time: 15000 });

    collector.on("collect", async function (i) {
      console.log(`Collected ${i}`);
      console.log(i);
      if (i.customId === "role-accept") {
        try {
          // create role
          interaction.guild.roles.create({
            name: newRoleName,
            color: newRoleHex,
            hoist: true,
            reason: "Created by YYHY^3 Admins as a Role Request",
            // position:
            position: interaction.guild.roles.botRoleFor(currentUser).position - 1,
          });
        } catch (error) {
          return interaction.editReply(`Something went wrong with the command. Could not create role. ${error.name}: ${error.message}`);
        }

        try {
          // delete role request
          const rowCount = await RoleRequests.destroy({ where: { name: newRoleName } });

          if (!rowCount) return interaction.editReply("That role request doesn't exist.");

          const replyEmbed = new MessageEmbed()
            .setColor(`#${newRoleHex}`)
            .setTitle("A new role has been created!")
            .setDescription(`Created role ${newRoleName} with color #${newRoleHex}`);
          await interaction.editReply({ embeds: [replyEmbed] });
        } catch (error) {
          return interaction.editReply(`Something went wrong with the command. Could not delete role request. ${error.name}: ${error.message}`);
        }

        try {
          // notify user
          const dmEmbed = new MessageEmbed()
            .setColor(`#${newRoleHex}`)
            .setTitle("The role you requested has been created!")
            .setDescription(`Created role ${newRoleName} with color #${newRoleHex}`);
          let requestMember = interaction.guild.members.resolve(requestUsername);
          await requestMember
            .send({ embeds: [dmEmbed] })
            .then(console.log)
            .catch(console.error);
        } catch (error) {
          return interaction.editReply(`Something went wrong with the command. Could not send DM to user. ${error.name}: ${error.message}`);
        }

        // disable buttons
        replyButtons.components[0].setDisabled(true);
        replyButtons.components[1].setDisabled(true);
      } else if (i.customId == "role-deny") {
        try {
          // delete role request
          const rowCount = await RoleRequests.destroy({ where: { name: newRoleName } });

          if (!rowCount) return interaction.editReply("That role request doesn't exist.");

          const replyEmbed = new MessageEmbed()
            .setColor(`#${newRoleHex}`)
            .setTitle("The role request has been denied!")
            .setDescription(`Did not create role ${newRoleName} with color #${newRoleHex}`);
          await interaction.editReply({ embeds: [replyEmbed] });
        } catch (error) {
          return interaction.editReply(`Something went wrong with the command. Could not delete role request. ${error.name}: ${error.message}`);
        }

        try {
          // notify user
          const dmEmbed = new MessageEmbed()
            .setColor(`#ff0000`)
            .setTitle("The role you requested was not created!")
            .setDescription(`The admins of YYHY denied your request to create a new role.`);
          let requestMember = interaction.guild.members.resolve(requestUsername);
          await requestMember.send({ embeds: [dmEmbed] });
        } catch (error) {
          return interaction.editReply(`Something went wrong with the command. Could not send DM to user. ${error.name}: ${error.message}`);
        }
      } else {
        return interaction.editReply("Unknown custom ID received! " + i.customId);
      }

      // disable buttons
      replyButtons.components[0].setDisabled(true);
      replyButtons.components[1].setDisabled(true);
    });

    collector.on("end", (collected) => {
      console.log(`Collected ${collected.size} items`);
    });
  },
};
