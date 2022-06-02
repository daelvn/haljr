module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.models.forEach((model, name) => model.sync());
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};