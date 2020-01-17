const express = require('express');
const router = express.Router();

// Director model
const Director = require('../app/models/Director');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({return: true});
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

module.exports = router;
