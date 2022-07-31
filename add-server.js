const fs = require("node:fs");
// create line reader
const readline = require("readline-sync");
// load config
const configLocation = "./config.json";
const config = require(configLocation);

var guildId = readline.question("What is the ID of the guild? ");
var endOfRoles = readline.question("What is the role ID of the role delimiter? ");

config.servers[guildId] = {
  endOfRoles: endOfRoles,
};

fs.writeFile(configLocation, JSON.stringify(config, null, 2), function writeJSON(err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(config));
  console.log("writing to " + configLocation);
});
