const mongoose = require('mongoose');

class MoviesDB {
  constructor() {
    this.Movie = null;
  }

  async initialize(connectionString) {
    try {
      await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      this.Movie = mongoose.model('Movie', new mongoose.Schema({
        title: String,
        year: Number,
        genre: String,
        // Other movie fields...
      }));
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  async addNewMovie(data) {
    const movie = new this.Movie(data);
    return movie.save();
  }

  async getAllMovies(page, perPage, title) {
    const query = title ? { title: { $regex: title, $options: 'i' } } : {};
    return this.Movie.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ year: 1 });
  }

  async getMovieById(id) {
    return this.Movie.findById(id);
  }

  async updateMovieById(data, id) {
    return this.Movie.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteMovieById(id) {
    return this.Movie.findByIdAndDelete(id);
  }
}

module.exports = MoviesDB;
