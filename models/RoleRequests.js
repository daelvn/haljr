// Sequelize
const Sequelize = require('sequelize');

module.exports = {
    data: {
        name: "RoleRequests",
        schema: {
            name: Sequelize.STRING,
            username: Sequelize.STRING,
            hex: Sequelize.STRING
        }
    }
}