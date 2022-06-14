// Sequelize
const Sequelize = require("sequelize");

module.exports = {
  data: {
    name: "HomestuckProfiles",
    schema: {
      user: {
        type: Sequelize.STRING,
        unique: true,
      },
      classpects: Sequelize.STRING,
      species: Sequelize.STRING,
      color: Sequelize.STRING,
      sway: Sequelize.STRING,
      quadrants: Sequelize.STRING,
      lusii: Sequelize.STRING,
    },
  },
};
