// server.js
/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: _Amirhamza Saiyad_ Student ID: _151693223_ Date: _21/01/2025_
*  Vercel Link: 
*
********************************************************************************/ 

// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const MoviesDB = require('./modules/moviesDB'); 

// Initialize environment variables
dotenv.config();

// Create an instance of Express app
const app = express();
const HTTP_PORT = process.env.PORT || 3000;

// Create a new db instance
const db = new MoviesDB();

// Middleware to parse JSON data
app.use(express.json());
app.use(cors()); // Enable CORS for cross-origin requests

// API Routes

// POST /api/movies - Add a new movie to the collection
app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body)
        .then((newMovie) => res.status(201).json(newMovie))
        .catch((err) => res.status(500).json({ message: 'Error adding movie', error: err }));
});

// GET /api/movies - Get a list of movies (with optional pagination and title filtering)
app.get('/api/movies', (req, res) => {
    const { page = 1, perPage = 10, title } = req.query;
    db.getAllMovies(Number(page), Number(perPage), title)
        .then((movies) => res.json(movies))
        .catch((err) => res.status(500).json({ message: 'Error fetching movies', error: err }));
});

// GET /api/movies/:id - Get a specific movie by its ID
app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id)
        .then((movie) => {
            if (movie) {
                res.json(movie);
            } else {
                res.status(404).json({ message: 'Movie not found' });
            }
        })
        .catch((err) => res.status(500).json({ message: 'Error fetching movie', error: err }));
});

// PUT /api/movies/:id - Update a movie by its ID
app.put('/api/movies/:id', (req, res) => {
    db.updateMovieById(req.body, req.params.id)
        .then((updatedMovie) => {
            if (updatedMovie) {
                res.json(updatedMovie);
            } else {
                res.status(404).json({ message: 'Movie not found for update' });
            }
        })
        .catch((err) => res.status(500).json({ message: 'Error updating movie', error: err }));
});

// DELETE /api/movies/:id - Delete a movie by its ID
app.delete('/api/movies/:id', (req, res) => {
    db.deleteMovieById(req.params.id)
        .then(() => res.status(204).send()) // 204 indicates successful deletion with no content in the response
        .catch((err) => res.status(500).json({ message: 'Error deleting movie', error: err }));
});

// Initialize the database connection and start the server
db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on http://localhost:${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });

