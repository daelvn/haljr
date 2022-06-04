// Sequelize
const Sequelize = require('sequelize');

module.exports = {
    data: {
        name: "Birthdays",
        schema: {
            user: {
                type: Sequelize.STRING,
                unique: true
            },
            date: Sequelize.STRING,
        }
    }
}