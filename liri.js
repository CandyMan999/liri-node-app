require("dotenv").config();

const keys = require("./keys");
const inquirer = require('inquirer');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');

console.log(keys);
console.log(keys.twitter);

inquirer.prompt([
    {
      type: "list",
      name: "userInput",
      message: "pick a command",
      choices: ["My Tweets","Spotify This Song", "Movie This", "Do What It Says"]
    }
  ]).then(({userInput}) => {
    console.log(userInput);
    determineAction(userInput);
     
  });

 function getTweets() {
    
    const client = new Twitter(keys.twitter);
    const params = {screen_name: 'JohnCITTG'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            tweets.forEach(tweet => console.log(tweet.text));
        
        } else {
            console.log(error);
        }
    });

 }

 function getSong(randomTxt) {
     if(randomTxt) {
        console.log("you searched this  **  " + randomTxt + "  **  and spotify returned all these songs");
        console.log("************************");

        const spotify = new Spotify(keys.spotify);
    
        spotify.search({ type: 'track', query: randomTxt})
            .then(function(response) {
                let results = response.tracks.items
                results.forEach(result => {
                    console.log("Artist Name: " + result.artists[0].name);
                    console.log("Here is a link to their song: " + result.album.external_urls.spotify);
                    console.log("The album for this track is: " + result.album.name);
                    console.log("**********************");
                    console.log("**********************");

                })
            })
            .catch(function(err) {
            console.log(err);
        });
         
     } else {
        inquirer.prompt([
        // Here we create a basic text prompt.
        {
            type: "input",
            message: "What song would you like to Spotify?",
            name: "song"
        },

        ]).then(({song})=>{
            if(song === ""){
                console.log("Oh no, you didn't pick a song, so we picked one for you!");
                song = "bailando";
            }
            console.log("you searched this  **  " + song + "  **  and spotify returned all these songs");
            console.log("************************");

            const spotify = new Spotify(keys.spotify);      
            spotify.search({ type: 'track', query: song})
                .then(function(response) {
                    let results = response.tracks.items
                    results.forEach(result => {
                        console.log("Artist Name: " + result.artists[0].name);
                        console.log("Here is a link to their song: " + result.album.external_urls.spotify);
                        console.log("The album for this track is: " + result.album.name);
                        console.log("**********************");
                        console.log("**********************");
                    })
                })
                .catch(function(err) {
                console.log(err);
            });
        });
    }
}

function getMovie(randomTxt) {
    if(randomTxt) {
        let queryURL = `http://www.omdbapi.com/?apikey=${keys.omdb.apikey}&t=${randomTxt}`;
        request(queryURL, function(err, res, body) {
            if(err) {
                return console.error(err);
            }
            let results = JSON.parse(body);
                      
            console.log("The title for this film is: " + results.Title); 
            console.log("The year this film was released: " + results.Year);
            console.log("The IMDB rating for this film is: " + results.Ratings[0].Value);
            console.log("Rotten Tomatoes gives it a: " + results.Ratings[1].Value);
            console.log("Counrty origin: " + results.Country);
            console.log("Language: " + results.Language);
            console.log("The Plot thickens: " + results.Plot);
            console.log("Who were the actors?: " + results.Actors);

    })

    } else {
        inquirer.prompt([
            // Here we create a basic text prompt.
            {
                type: "input",
                message: "What movie would you like to see?",
                name: "movie"
            },
    
            ]).then(({movie})=>{
                if(movie === ""){
                    console.log("Oh no, you didn't pick a movie, so we picked one for you!");
                    movie = "Mr. Nobody";
                }
                let queryURL = `http://www.omdbapi.com/?apikey=${keys.omdb.apikey}&t=${movie}`;

                request(queryURL, function(err, res, body) {
                    if(err) {
                        return console.error(err);
                    }
                    let results = JSON.parse(body);
                      
                    console.log("The title for this film is: " + results.Title); 
                    console.log("The year this film was released: " + results.Year);
                    console.log("The IMDB rating for this film is: " + results.Ratings[0].Value);
                    console.log("Rotten Tomatoes gives it a: " + results.Ratings[1].Value);
                    console.log("Counrty origin: " + results.Country);
                    console.log("Language: " + results.Language);
                    console.log("The Plot thickens: " + results.Plot);
                    console.log("Who were the actors?: " + results.Actors);

                    
                })
            })
    }   
 
}

function doIt() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        let caseArgRan = data.split(',');
        console.log(caseArgRan);
        let ranNum = Math.floor(Math.random() * 2);
        console.log(ranNum);
        if (ranNum === 0){
            determineAction(caseArgRan[0],caseArgRan[1]);
        }else{
            determineAction(caseArgRan[2],caseArgRan[3]);
        }
        if(error){
            console.log(error);
        }
    });
}

function determineAction(userInput, randomTxt){
    switch (userInput){
        case 'My Tweets':
            getTweets();
            break;
        case 'Spotify This Song':
            getSong(randomTxt);
            break;
        case 'Movie This':
            getMovie(randomTxt);
            break;
        case 'Do What It Says':
            doIt();
            break;   
        default: 
            console.log('whoops');     
    }
}