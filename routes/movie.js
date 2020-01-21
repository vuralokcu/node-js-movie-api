var express = require('express');
var router = express.Router();

const Movie = require('../app/models/Movie');


// Get All Moview
router.get('/', (req, res, next) => {
   const promise = Movie.aggregate(
       [
           {
               $lookup: {
                   from: 'directors',
                   localField: 'director_id',
                   foreignField: '_id',
                   as: 'director'
               }
           },
           {
               $unwind: '$director'
           }
       ]
   );

    promise.then((data) => {
        console.log(req.decode);
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});


// Top 10 List
router.get('/top10', (req, res, next) => {
    const promise = Movie.find({ })
        .limit(10)
        .sort(
        {
            'imdb_score': -1
        }
    );

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});


// Create a new movie
router.post('/', (req, res, next) => {
    /*
    const { title, imdb_score, category, country, year } = req.body;

    const movie = new Movie({
        title: title,
        imdb_score: imdb_score,
        category: category,
        country: country,
        year: year
    });
    */

    // Kısaca bu şekilde de yapılabilir:
    const movie = new Movie(req.body);

    /*
    movie.save((err, data) => {
        if (err)
            res.json(err);

        res.json(data);
    });
    */

    // Daha temiz kodlama
    const promise = movie.save();
    promise.then((data) => {
        //res.json({ result: true });
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });

});

// Movie detail
router.get('/:movie_id',  (req, res, next) => {
    const movie_id = req.params.movie_id;
    const promise = Movie.findById(movie_id);

    promise.then((movie) => {
        if (! movie)
            return next({ message: 'The movie was not found.', code: 99});
        res.json(movie);
    }).catch((err) => {
        res.json(err);
    });
});


// Update movie
router.put('/:movie_id', (req, res, next) => {
    const movie_id = req.params.movie_id;
    const promise = Movie.findByIdAndUpdate(
        movie_id,
        req.body,
        {
            new: true // Sonuç olarak dönen data eskisi değil, yenisi olsun istiyorsak kullanılır.
        }
    );

    promise.then((movie) => {
        if (! movie)
            return next({ message: 'The movie was not found.', code: 99 });

        res.json(movie);
    }).catch((err) => {
        res.json(err);
    });
});


// Delete movie
router.delete('/:movie_id', (req, res, next) => {
    const movie_id = req.params.movie_id;
    const promise = Movie.findByIdAndRemove(movie_id);

    promise.then((movie) => {
        if (! movie)
            return next({ message: 'The movie was not found.', code: 99 });

        res.json({ result: true });
    }).catch((err) => {
        res.json(err);
    });
});


// Top 10 List
router.get('/between/:start_year/:end_year', (req, res) => {
    const { start_year, end_year } = req.params;
    const promise = Movie.find(
        {
            year: {
                "$gte": parseInt(start_year),
                "$lte": parseInt(end_year)
            }
        }
    );

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});


module.exports = router;
