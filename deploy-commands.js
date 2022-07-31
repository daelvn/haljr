const fs = require("node:fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guilds, token } = require("./config.json");

// Create collection of commands from folder

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

// Register the commands

const rest = new REST({ version: "9" }).setToken(token);

for (let [guildId, guild] of Object.entries(guilds)) {
  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log(`Successfully registered application commands for ${guild.name}.`))
    .catch(console.error);
}
