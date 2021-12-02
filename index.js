// Requires the necessary discord.js classes
require('dotenv').config();
const { token } = process.env.DISCORD_TOKEN;
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

// Creates a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Commands collection
client.commands = new Collection();
const commonFiles = fs.readdirSync('./commands')
    .filter((file) => file.endsWith('.js'));

commonFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
});

// Client ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
    }
});

// Logs into Discord with client token
client.login(token);