// Sequelize
const Sequelize = require("sequelize");

module.exports = {
  data: {
    name: "Profiles",
    schema: {
      user: {
        type: Sequelize.STRING,
        unique: true,
      },
      description: Sequelize.TEXT,
      genders: Sequelize.STRING,
      sexualities: Sequelize.STRING,
      pronouns: Sequelize.STRING,
      flags: Sequelize.TEXT,
      kins: Sequelize.TEXT,
    },
  },
};
