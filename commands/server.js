// Requires
const { SlashCommandBuilder } = require('@discordjs/builders');

// build the 'server' command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Replies with server name.'),
    async execute(interaction) {
        await interaction.reply(`Server name: ${interaction.guild.name}
        Total members: ${interaction.guild.memberCount}`)
    },
};