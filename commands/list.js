// Requires
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const movielist = require('../movielist.json')['movies'];

// build the 'hello' command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Provides the movie list.'),
    async execute(interaction) {
        // Create then fill movieArr with array of moviename, year, and URL from the movielist json
        const movieArr = [];
        movielist.forEach(movie => {
            movieArr.push([ movie.moviename, movie.year, movie.URL ])
        });

        // Build the embed
        const replyembed = new MessageEmbed()
            .setColor('#391f43')
            .setTitle('Podcast Movie List')
            .setDescription('This is the list of movies we will/have watched');
        
        // fill the embed
        movieArr.forEach(movie => {
            replyembed.addField(movie[0] + ' ' + movie[1], movie[2]);
        });

        await interaction.reply({ embeds: [replyembed] });
    },
};