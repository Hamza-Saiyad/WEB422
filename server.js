/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Amihamza Saiyad Student ID: ______________ Date: ________________
*  Vercel Link: _______________________________________________________________
*
********************************************************************************/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const MoviesDB = require('./modules/moviesDB');

const app = express();
const HTTP_PORT = process.env.PORT || 3000;
const db = new MoviesDB();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the database and start server after connection
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server is running on http://localhost:${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
    process.exit(1); // Exit if the database connection fails
  });

// API Endpoints

// POST /api/movies - Add a new movie
app.post('/api/movies', async (req, res) => {
  const { title, year, genre } = req.body;
  if (!title || !year) {
    return res.status(400).json({ message: 'Title and Year are required' });
  }
  try {
    const newMovie = await db.addNewMovie(req.body);
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ message: 'Error adding movie', error });
  }
});

// GET /api/movies - Get a list of movies (with optional pagination and title filtering)
app.get('/api/movies', async (req, res) => {
  try {
    const { page = 1, perPage = 10, title } = req.query;
    const movies = await db.getAllMovies(Number(page), Number(perPage), title);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error });
  }
});

// GET /api/movies/:id - Get a specific movie by its ID
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await db.getMovieById(req.params.id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie', error });
  }
});

// PUT /api/movies/:id - Update a movie by its ID
app.put('/api/movies/:id', async (req, res) => {
  try {
    const updatedMovie = await db.updateMovieById(req.body, req.params.id);
    if (updatedMovie) {
      res.json(updatedMovie);
    } else {
      res.status(404).json({ message: 'Movie not found for update' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating movie', error });
  }
});

// DELETE /api/movies/:id - Delete a movie by its ID
app.delete('/api/movies/:id', async (req, res) => {
  try {
    await db.deleteMovieById(req.params.id);
    res.status(204).send(); // No content response
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movie', error });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});
