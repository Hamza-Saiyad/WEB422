const mongoose = require('mongoose');

class MoviesDB {
    constructor() {
        this.Movie = null;
    }

    initialize(connectionString) {
        return new Promise((resolve, reject) => {
            mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
                .then(() => {
                    this.Movie = mongoose.model('Movie', new mongoose.Schema({
                        title: String,
                        year: Number,
                        // Add other necessary fields based on your dataset
                    }, { collection: 'movies' }));
                    resolve();
                })
                .catch(err => reject(err));
        });
    }

    addNewMovie(data) {
        return new this.Movie(data).save();
    }

    getAllMovies(page, perPage, title) {
        let query = this.Movie.find();
        if (title) {
            query = query.where('title').equals(title);
        }
        return query.sort({ year: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();
    }

    getMovieById(id) {
        return this.Movie.findById(id).exec();
    }

    updateMovieById(data, id) {
        return this.Movie.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    deleteMovieById(id) {
        return this.Movie.findByIdAndDelete(id).exec();
    }
}

module.exports = MoviesDB;
