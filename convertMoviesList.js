const fs = require('fs');
const path = require('path');

// Define the input text file and output JSON file
const inputFilePath = path.join(__dirname, 'movies.txt');
const outputFilePath = path.join(__dirname, 'movies.json');

// Read the text file
const movieTextData = fs.readFileSync(inputFilePath, 'utf8');

// Split the text data into lines
const movieLines = movieTextData.split('\n').filter(line => line.trim() !== '');

// Function to convert a line of text to a movie object with placeholders
const convertLineToMovie = (line) => {
    return {
        title: line.trim(),
        pain_score: null,
        specialty_categories: [],
        quote: null,
        voice_line: null,
        info: {
            release_date: null,
            budget: null,
            directors: [],
            actors: [],
            rottenTomatoesRating: null,
            image_url: null,
        }
    };
};

// Convert each line to a movie object
const newMovies = movieLines.map(convertLineToMovie);

// Read the existing JSON file
let existingMovies = [];
if (fs.existsSync(outputFilePath)) {
    existingMovies = JSON.parse(fs.readFileSync(outputFilePath, 'utf8'));
}

// Combine the existing movies with the new movies
const allMovies = existingMovies.concat(newMovies);

// Write the combined movies to the JSON file
fs.writeFileSync(outputFilePath, JSON.stringify(allMovies, null, 2));

console.log('Movies have been successfully added to the JSON file.');