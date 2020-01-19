const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs'); // Parola şifreleme için kullanılıyor.
const jwt = require("jsonwebtoken"); // JSON Web Token ile kullanıcı authenticate jetonu oluşturmak için kullanılıyor.

// User Model
const User = require('../app/models/User');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.post('/register', (req, res, next) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10).then((hash) => {
        const user = new User({
            username, // Hem modeldeki alan adı, hem de değişken adı aynı olduğu için bu şekilde kullanılabilir.
            password: hash
        });

        const promise = user.save();

        promise.then((user) => {
            res.json(user);
        }).catch((err) => {
            res.json(err);
        });
    });
});

router.post('/authenticate', (req, res) => {
    const { username, password } = req.body;

    User.findOne({
        username
    }, (err, user) => {
        if (err)
            throw err;

        if (! user) {
            res.json(
                {
                    status: false,
                    message: "Authenticated failed, user not found."
                }
            );
        } else {
            bcrypt.compare(password, user.password).then((result) => {
                if (! result) {
                    res.json(
                        {
                            status: false,
                            message: "Authenticated failed, wrong password."
                        }
                    );
                } else {
                    const payload = {
                        username
                    }; // token oluşturulurken iletilecek gövde elemanları

                    const token = jwt.sign(payload, req.app.get('API_SECRET_KEY'), {
                        expiresIn: req.app.get('API_TOKEN_LIFETIME')
                    });

                    res.json(
                        {
                            status: true,
                            token
                        }
                    );
                }
            });
        }

    });
});

module.exports = router;
