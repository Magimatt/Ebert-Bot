/*
 MAJOR ISSUE NEEDS TO BE RESOLVED!!!!!!
 EMBED REPLIES CAN ONLY BE 25 FIELDS LONG!

 NEED TO SPLIT EMBED REPLIES INTO MULTIPLE IF INPUT ARRAY
 CONTAINS MORE THAT 1024 CHARACTERS IN THE FIELD[VALUE]
 (OR 6000 MAX CHARACTERS IN THE EMBED).
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

        // Subcommand to just list all entries in the movie list
        .addSubcommand(subcommand => 
            subcommand
                .setName('all')
                .setDescription('Display all entries in the watched/unwatched lists'))

        // Subcommand to search through the watched/unwatched movie list
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("Returns a list of movie titles matching the search query")
                .addStringOption(option => option.setName("query").setDescription("The search query"))),
    
    async execute(interaction) {
        // reserve the variables that will be set in the conditional
        var watchedArr;
        var unwatchedArr;
        var embedColor;
        var embedTitle;
        var embedDescription;

        // subcommand execution conditional
        if (interaction.options.getSubcommand() === "search") {
            // Seach the name fields in the watched/unwatched arrays and builds the new arrays with the results
            const queryStr = interaction.options.getString("query");
            watchedArr = searchJSON(watchedjson, queryStr);
            unwatchedArr = searchJSON(unwatchedjson, queryStr);

            // If subcommand 'search' is used then build embed with following params
            embedColor = '#487987';
            embedTitle = 'Search Movie Lists';
            embedDescription = `Results for query: "${interaction.options.getString("query")}"`;
        } else if (interaction.options.getSubcommand() === "all") {
            // build the watched and unwatched arrays
            watchedArr = buildMovieArray(watchedjson);
            unwatchedArr = buildMovieArray(unwatchedjson);            
            
            // if 'list' command is used then build the embed with the following params
            embedColor = '#391f43';
            embedTitle = 'Podcast Movie List';
            embedDescription = 'This is the list of all watched/unwatched movies';
        }

        // take the movie arrays and make hyperlink strings for the field values
        const watchedlinkstring = buildEmbedFieldValue(watchedArr);
        const unwatchedlinkstring = buildEmbedFieldValue(unwatchedArr);
        
        // Build the embed and fill the watched and unwatched embed fields
        const replyembed = buildMessageEmbed(embedColor, embedTitle, embedDescription);
        replyembed.addField('Watched Movies', watchedlinkstring);
        replyembed.addField('Unwatched Movies', unwatchedlinkstring);
        
        // send embed reply
        await interaction.reply({ embeds: [replyembed] });
    },
};

// searchJSON helper func. returns boolean instead of .search()'s integers
function containsString(str, condition) {
    const result = str.toLowerCase().search(condition.toLowerCase());
    return result != -1 ? true : false;
}

// search the json for string match
function searchJSON(jsonObj, queryString) {
    const resultArr = [];
    jsonObj.forEach(obj => {
        if (containsString(obj.name, queryString) || containsString(obj.year, queryString)) {
            resultArr.push([obj.name, obj.year, obj.URL ]);
        }
    });
    // if the result array is empty then push an object that will show up as no reults in the embed
    if (resultArr.length == 0) {
        resultArr.push(['Search returned 0 results', '', '']);
    }
    return resultArr
};

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