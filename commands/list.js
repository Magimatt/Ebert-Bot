/*
 MAJOR ISSUE NEEDS TO BE RESOLVED!!!!!!
 EMBED REPLIES CAN ONLY BE 10 FIELDS LONG!
 NEED TO SPLIT EMBED REPLIES INTO MULTIPLE IF INPUT ARRAY IS LONGER THAN 10.
*/

// Requires
const { SlashCommandBuilder, hyperlink } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const watchedjson = require('../movielist.json')['watched'];
const unwatchedjson = require('../movielist.json')['unwatched'];


// build the 'hello' command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('The watched/unwatched movie lists.')

        // Sub command to search through the watched/unwatched movie list
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("Returns a list of movie titles matching the search query")
                .addStringOption(option => option.setName("query".setDescription("The search query")))),
    
    async execute(interaction) {
        if (interaction.options.getSubCommand() === "search") {
            // Seach the name fields in the watched/unwatched arrays and builds the new arrays with the results
            const queryStr = interaction.options.getString("query");
            const watchedArr = searchJSON(watchedjson, queryStr);
            const unwatchedArr = searchJSON(unwatchedjson, queryStr);

            // If subcommand 'search' is used then build embed with following params
            const embedColor = '#487987';
            const embedTitle = 'Search Movie Lists';
            const embedDescription = `Results for query: "${interaction.options.getString("query")}"`;
        } else {
            // build the watched and unwatched arrays
            const watchedArr = buildMovieArray(watchedjson);
            const unwatchedArr = buildMovieArray(unwatchedjson);            
            
            // if 'list' command is used then build the embed with the following params
            const embedColor = '#391f43';
            const embedTitle = 'Podcast Movie List';
            const embedDescription = 'This is the list of all watched/unwatched movies';
        }
        
        // take the movie arrays and make hyperlink strings for the field values
        const watchedlinkstring = buildEmbedFieldValue(watchedArr);
        const unwatchedlinkstring = buildEmbedFieldValue(unwatchedArr);
        
        // Build the embed
        const replyembed = buildMessageEmbed(embedColor, embedTitle, embedDescription);
        
        // fill the watched and unwatched embed fields
        replyembed.addField('Watched Movies', watchedlinkstring);
        replyembed.addField('Unwatched Movies', unwatchedlinkstring);
        
        await interaction.reply({ embeds: [replyembed] });
    },
};

// searchJSON helper func. returns boolean instead of .search()'s integers
function containsString(str, condition) {
    const result = str.search(condition);
    return result != -1 ? true : false;
}

// search the json for string match
function searchJSON(jsonObj, queryString) {
    const resultArr = [];
    for (obj of jsonObj) {
        if (containsString(obj.name, queryString) || containsString(obj.year, queryString)) {
            resultArr.push( { name:jsonObj.name, year:jsonObj.year, URL:jsonObj.URL } );
        }
    }
    // if the result array is empty then push an object that will show up as no reults in the embed
    return resultArr.length == 0 ? resultArr.push( { name:'Search returned 0 results', year:'', URL:'' } ) : resultArr
}

// build the message embed
function buildMessageEmbed(color, title, description) {
    const embed = new MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(description);
    return embed;
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