// Requires
const { SlashCommandBuilder, hyperlink } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const watchedjson = require('../movielist.json')['watched'];
const unwatchedjson = require('../movielist.json')['unwatched'];


// build the 'hello' command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('The Watched and Unwatched movie lists.'),
    
    async execute(interaction) {
        // Build the embed
        const replyembed = new MessageEmbed()
            .setColor('#391f43')
            .setTitle('Podcast Movie List')
            .setDescription('This is the list of movies we will/have watched');
        
        // build the watched and unwatched arrays
        const watchedArr = buildMovieArray(watchedjson);
        const unwatchedArr = buildMovieArray(unwatchedjson);

        // take the movie arrays and make hyperlink strings for the field values
        const watchedlinkstring = buildEmbedFieldValue(watchedArr);
        const unwatchedlinkstring = buildEmbedFieldValue(unwatchedArr);
        
        // fill the watched and unwatched embed fields
        replyembed.addField('Watched Movies', watchedlinkstring);
        replyembed.addField('Unwatched Movies', unwatchedlinkstring);
        
        await interaction.reply({ embeds: [replyembed] });
    },
};

// Create movie arrays with array of moviename, year, and URL from the movielist json
function buildMovieArray(jsonObj) {
    const arr = [];
    jsonObj.forEach(movie => {
        arr.push([movie.name, movie.year, movie.URL])
    });
    return arr;
};

// Store the embed field value as a list of hyperlinks
function buildEmbedFieldValue(arr) {
    let str = '';
    arr.forEach(item => {
        str += hyperlink(item[0] + ' ' + item[1], item[2]);
        str += '\n';
    });
    return str;
};