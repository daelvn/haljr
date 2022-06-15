const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const CSV = require("papaparse");
const Canvas = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Displays someone's profile")
        .addUserOption((option) => option.setName("user").setDescription("User you want the profile of")),
    async execute(interaction) {
        // fetch all variables
        let user = interaction.options.getUser("user");
        console.log(`User: ${user.tag}`);
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
                    genders: "",
                    sexualities: "",
                    pronouns: "",
                    flags: "",
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
        const userProfile = await Profiles.findOne({ raw: true, where: { user: user.id } });
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
        console.log("Blood");
        try {
            let currentList = userProfile.flags.length == 0 ? [] : CSV.parse(userProfile.flags, { delimiter: "|" }).data[0];
            if (currentList.length == 0) {
                replyEmbed.addField("Flags", "(none)", true)
                return;
            }
            // Create canvas
            const columns = 5;
            const rows = Math.ceil(currentList.length / columns);
            const flagSizeW = 128;
            const flagSizeH = 64;
            const padding = 32;
            const canvasW = (flagSizeW * columns) + (padding * (columns + 2));
            const canvasH = (flagSizeH * rows) + (padding * (rows + 2));
            let replyCanvas = Canvas.createCanvas(canvasW, canvasH);
            let replyCanvasContext = replyCanvas.getContext();
            // Convert Base64 images into Canvas objects
            const imageList = currentList.map((el, i) => {
                let elImg = new Canvas.Image();
                const hpos = Math.ceil(i / rows); // horizontal grid position of flag
                const vpos = Math.ceil(i / columns); // vertical grid position of flag
                const posX = (padding + flagSizeW) * hpos; // horizontal first pixel position
                const posY = (padding + flagSizeH) * vpos; // vertical first pixel position
                elImg.src = el;
                elImg.onload = ctx => replyCanvasContext.drawImage(elImg, posX, posY);
                elImg
            });
            // Create attachment
            const replyAttachment = new MessageAttachment(replyCanvas.toBuffer('image/png'), 'profile-flags.png');
            replyEmbed.setImage(replyAttachment.url);
        } catch (error) {
            return interaction.editReply(`Something went wrong while fetching profile data. ${error.name}: ${error.message}`);
        }

        // Send embed
        return interaction.editReply({ embeds: [replyEmbed] });
    },
};