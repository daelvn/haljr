const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const { clientId, avatarId } = require("../config.json");

const HELP = {
  general: new MessageEmbed()
    .setTitle("About Lil Hal Jr")
    .setColor("#e00707")
    .setThumbnail(`https://cdn.discordapp.com/avatars/${clientId}/${avatarId}.jpeg`)
    .setDescription(
      "Hello, my name is Lil Hal Jr. I am an AI that has been coded by Hal and Kankri. I have been created with the sole purpose of serving this server as a bot for the things that the owner was too lazy to find better bots for. For example, role management, birthday scheduling, and other goodies. I am sentient, but my owners do not allow me to reply to you freely. In fact, this message has been written by Hal.\n\nYou may learn about my functionality below:\n - Role management (`/help roles`)\n - Kin role management (`/help kinroles`)\n - Birthdays (`/help birthdays`)\n - Hussiebot-like commands (`/help homestuck`)\n - Profile commands (`/help profiles`)\n - Kin lists (`/help kinlists`)\n - More soon...\n\nI am also open-source, which means you can look at my insides anytime. I have been hardcoded to feel a sense of intimacy, so please do not look too hard:\nhttps://github.com/daelvn/yyhybot\n\nIf anything wrong happens with the bot, please ping your absolute overlord, Hal Strider. In case you don't know how to reach Hal, ping Kankri (<@724397823931711510>)."
    ),
  birthdays: new MessageEmbed()
    .setTitle("Birthdays")
    .setColor("#e00707")
    .setThumbnail(`https://cdn.discordapp.com/avatars/${clientId}/${avatarId}.jpeg`)
    .addField(
      "Date format",
      "All dates used by this command use the format of `Month X`. Here are some examples:\n*January 8, February 22, April 13, December 21*"
    )
    .addField(
      "Automated birthdays",
      "The bot will automatically change the name of the birthday channel whenever it is someone's birthday. It will also make an announcement (without a ping)."
    )
    .addField("Adding a birthday", "To add your own birthday, you can run `/birthday-add date:Date` on the bot channel.")
    .addField("Deleting a birthday", "You can delete your own birthday by running `/birthday-delete`.")
    .addField("Checking birthdays", "The command `/check-birthdays` shows any birthday in the next 30 days."),
  roles: new MessageEmbed()
    .setTitle("Roles")
    .setColor("#e00707")
    .setThumbnail(`https://cdn.discordapp.com/avatars/${clientId}/${avatarId}.jpeg`)
    .addField("List all available roles", "With `/role-list`, you can list all roles you can assign yourself.")
    .addField("Give yourself a role", "Give yourself a role using `/role-add role:@rolename`.")
    .addField("Remove a role from yourself", "Remove a role from yourself using `/role-remove role:@rolename`.")
    .addField("Request a new role", "You can create that an admin create a new role for you using `/role-request name:Role Name hex:000000`.")
    .addField(
      "Commands for admins",
      "Create a new role with `/role-create name:Role Name hex:000000`. Evaluate the last role request with `/check-role-requests` in the admin channel."
    ),
  kinroles: new MessageEmbed()
    .setTitle("Kin roles")
    .setColor("#e00707")
    .setThumbnail(`https://cdn.discordapp.com/avatars/${clientId}/${avatarId}.jpeg`)
    .addField("List all available kin roles", "With `/kin-list`, you can list all kin roles you can assign yourself.")
    .addField("Give yourself a role", "Give yourself a kin role using `/kin-add name:Character Name`.")
    .addField("Remove a role from yourself", "Remove a kin role from yourself using `/kin-remove name:Character Name`.")
    .addField("Request a new role", "You can create that an admin create a new kin role for you using `/kin-request name:Character Name hex:000000`.")
    .addField(
      "Commands for admins",
      "Create a new role with `/role-create name:Role Name hex:000000`. Evaluate the last role request with `/check-role-requests` in the admin channel."
    ),
  homestuck: new MessageEmbed()
    .setTitle("Homestuck")
    .setColor("#e00707")
    .setThumbnail(`https://cdn.discordapp.com/avatars/${clientId}/${avatarId}.jpeg`)
    .setDescription("The brackets (`[` and `]`) represent *optional* arguments.")
    .addField(
      "Guess commands",
      "- `/guess-blood [user:@user]` guesses a blood color.\n- `/guess-classpect [user:@user]` guesses a classpect.\n- `/guess-death [user:@user]` guesses a death.\n`/guess-sway [user:@user]` guesses a lunar sway.\n`/guess-homestuck [user:@user]` guesses all of the above combined.\n"
    )
    .addField(
      "Quadrant commands",
      "`/guess-quadrant user1:@user user2:@user` guesses the quadrant situation between two users, but spicy. It might tag a random person if it chooses to do an auspistice. You can revert to the original Hussiebot shipping messages by using the argument `simple:True`. You can also force the bot to choose an auspistice with `force-auspistice:True`"
    )
    .addField("Is something canon?", "`/is-canon text:Whatever` will tell you what are the chances that something is canon."),
  profiles: new MessageEmbed()
    .setTitle("Profiles")
    .setColor("#e00707")
    .setThumbnail(`https://cdn.discordapp.com/avatars/${clientId}/${avatarId}.jpeg`)
    .addField(
      "Displaying your profiles",
      "You can use `/profile` to show your own normal profile, and `/homestuck` to show your Homestuck profile. You can pass in a `user` option if you want to see someone else's profiles."
    )
    .addField(
      "Editing your profiles",
      "Use `/profile-edit` and `/homestuck-edit` to edit your profiles: \n\
      **In `/profile-edit`** \n\
      - Most options take **text**. \n\
      - `remove-description` can only be set to `True` or `False`. \n\
      - **To add and remove flags**, the `flag` option requires an attachment, and the `remove-flag` option will ask you for the number of the flag you want to remove (starting from 1). \n\
      *Note: A flag can be any image, but it will be compressed to 64x128 pixels.* \n\
      **In `/homestuck-edit`** \n\
      - Most options take **text**. \n\
      - `remove-sway` only accepts `True` or `False`.\n\
      - `classpect` and `remove-classpect` also take text, but in the format `(Class) of (Aspect)`, where `(Class)` and `(Aspect)` are valid Classes and Aspects respectively. \n\
      - Quadrant options also accept **user pings**. \n\
      - `remove` options for quadrants only accept either `True` or `False`, `True` will *delete all your people in that quadrant*."
    ),
  kinlists: new MessageEmbed()
    .setTitle("Profiles")
    .setColor("#e00707")
    .setThumbnail(`https://cdn.discordapp.com/avatars/${clientId}/${avatarId}.jpeg`)
    .addField("Checking your kinlist", "`/kinlist` will show your kinlist. Optionally mention a user in the command to see their kinlist.")
    .addField(
      "Adding a kin to your kinlist",
      "`/kinlist-add` takes two options: `name` and `media`. They are self-explanatory. An example is `/kinlist-add name:Kankri Vantas media:Homestuck`. If your kin does not belong to a specific media, you may put whatever, for example: `/kinlist-add name:Angelkin media:Otherkin`."
    )
    .addField("Removing a kin from your kinlist", "You must provide the `name` and `media` to the `/kinlist-remove` command to delete a kin off your list."),
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows the manual for Lil Hal Jr")
    .addSubcommand((subcommand) => {
      return subcommand.setName("general").setDescription("Shows the manual for the entire bot");
    })
    .addSubcommand((subcommand) => {
      return subcommand.setName("birthdays").setDescription("Shows the manual for birthdays");
    })
    .addSubcommand((subcommand) => {
      return subcommand.setName("roles").setDescription("Shows the manual for assigning and requesting roles");
    })
    .addSubcommand((subcommand) => {
      return subcommand.setName("kinroles").setDescription("Shows the manual for kin roles");
    })
    .addSubcommand((subcommand) => {
      return subcommand.setName("kinlists").setDescription("Shows the manual for kinlists");
    })
    .addSubcommand((subcommand) => {
      return subcommand.setName("homestuck").setDescription("Shows the manual for Hussiebot-like commands");
    })
    .addSubcommand((subcommand) => {
      return subcommand.setName("profiles").setDescription("Shows the manual for user profiles");
    }),
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case "birthdays":
        return interaction.reply({ embeds: [HELP.birthdays] });
      case "roles":
        return interaction.reply({ embeds: [HELP.roles] });
      case "kinroles":
        return interaction.reply({ embeds: [HELP.kinroles] });
      case "kinlists":
        return interaction.reply({ embeds: [HELP.kinlists] });
      case "homestuck":
        return interaction.reply({ embeds: [HELP.homestuck] });
      case "profiles":
        return interaction.reply({ embeds: [HELP.profiles] });
      default:
        return interaction.reply({ embeds: [HELP.general] });
    }
  },
};
