const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Director model
const Director = require('../app/models/Director');

// GET directors
router.get('/', (req, res, next) => {
    const promise = Director.aggregate(
        [
            {
                $lookup: {
                    from: 'movies',
                    localField: '_id',
                    foreignField: 'director_id',
                    as: 'movie'
                }
            },
            {
                $unwind: {
                    path: '$movie', // yukarıdaki as: 'movie' ifadesinden geliyor bu değişken,
                    preserveNullAndEmptyArrays: true // movie koleksiyonunda datası olmayan direktörleri de listelemek için kullanılıyor.
                }
            },
            {
                $group: { // Yönetmenin filmlerini tek bir datada array olarak almak için kullanıyoruz.
                    _id: {
                        _id: '$_id',
                        name: '$name',
                        surname: '$surname',
                        bio: '$bio'
                    },
                    movies: {
                       $push: '$movie'
                    }
                }
            },
            {
                $project: {
                    _id: '$_id._id',
                    name: '$_id.name',
                    surname: '$_id.surname',
                    bio: '$_id.bio',
                    movies: '$movies'
                }
            }
        ]
    );

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

// Create a director
router.post('/', (req, res, next) => {
    const director = new Director(req.body);
    const promise = director.save();

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

// GET director movies
router.get('/', (req, res, next) => {
    const promise = Director.aggregate(
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movie'
            }
        },
        {
            $unwind: {
                path: '$movie' // yukarıdaki as: 'movie' ifadesinden geliyor bu değişken
            }
        }
    );

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

// GET director detail
router.get('/:director_id', (req, res, next) => {
    const promise = Director.aggregate(
        [
            {
                $match: {
                    '_id': mongoose.Types.ObjectId(req.params.director_id)
                }
            },
            {
                $lookup: {
                    from: 'movies',
                    localField: '_id',
                    foreignField: 'director_id',
                    as: 'movie'
                }
            },
            {
                $unwind: {
                    path: '$movie', // yukarıdaki as: 'movie' ifadesinden geliyor bu değişken,
                    preserveNullAndEmptyArrays: true // movie koleksiyonunda datası olmayan direktörleri de listelemek için kullanılıyor.
                }
            },
            {
                $group: { // Yönetmenin filmlerini tek bir datada array olarak almak için kullanıyoruz.
                    _id: {
                        _id: '$_id',
                        name: '$name',
                        surname: '$surname',
                        bio: '$bio'
                    },
                    movies: {
                        $push: '$movie'
                    }
                }
            },
            {
                $project: {
                    _id: '$_id._id',
                    name: '$_id.name',
                    surname: '$_id.surname',
                    bio: '$_id.bio',
                    movies: '$movies'
                }
            }
        ]
    );

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

module.exports = router;
