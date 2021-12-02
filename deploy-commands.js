// Requires for commands
require('dotenv').config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = {
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    token: process.env.DISCORD_TOKEN
};
// not needed after splitting commands into files
// const { SlashCommandBuilder } = require('@discordjs/builders');

// command .js files to commands json
const commandFiles = fs.readdirSync('./commands')
    .filter(file => file.endsWith('.js'));
const commands = commandFiles.map(file => {
    const command = require(`./commands/${file}`);
    return command.data.toJSON();
});

// set token and routes in REST
const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);