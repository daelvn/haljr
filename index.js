// Node libraries
const fs = require("node:fs");
const path = require("node:path");

// Sequelize
const Sequelize = require("sequelize");

// Dates
const dayjs = require("dayjs");

// Node scheduler
const schedule = require("node-schedule");

// Setup segfault handler
const SegfaultHandler = require("segfault-handler");
SegfaultHandler.registerHandler("crash.log");

// Require the necessary discord.js classes
const { Client, Intents, Collection } = require("discord.js");
const { token, guildId } = require("./config.json");

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});

// Connect a database
const sql = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "yyhy.sqlite",
});

// Instantiate all models
client.models = new Collection();
const modelsPath = path.join(__dirname, "models");
const modelFiles = fs.readdirSync(modelsPath).filter((file) => file.endsWith(".js"));

for (const file of modelFiles) {
  const filePath = path.join(modelsPath, file);
  const model = require(filePath);

  let sqldef = sql.define(model.data.name.toLowerCase(), model.data.schema);
  console.log(`Adding model: ${model.data.name} -> ${typeof sqldef} (${typeof sql})`);
  client.models.set(model.data.name, sqldef);
  console.log(`Set: ${model.data.name} = ${client.models.get(model.data.name)}`);
}

// Globalize scheduler
client.schedule = schedule;
client.scheduled = new Collection();

// Add a commands collection
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// Load events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Login to Discord with your client's token
client.login(token);
