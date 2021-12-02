// Requires
const { SlashCommandBuilder } = require('@discordjs/builders');

// build the 'hello' command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Replies with two thumbs up!'),
    async execute(interaction) {
        await interaction.reply(':thumbsup::thumbsup:')
    },
};