// Requires
const { SlashCommandBuilder } = require('@discordjs/builders');
const { movielist } = require('./movielist.json');

// build the 'hello' command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Provides the movie list.'),
    async execute(interaction) {
        const replylist = () => 
        await interaction.reply('')
    },
};