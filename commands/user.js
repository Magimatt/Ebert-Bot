// Requires
const { SlashCommandBuilder } = require('@discordjs/builders');

// build the 'user' command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies with user info.'),
    async execute(interaction) {
        await interaction.reply(`User tag: ${interaction.user.tag}
        User ID: ${interaction.user.id}`)
    },
};