const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token; // header parametresi || post ile gönderilen token parametresi || urldeki parametre

    if (token) {
        jwt.verify(token, req.app.get('API_SECRET_KEY'), (err, decoded) => {
            if (err) {
                res.json(
                    {
                        status: false,
                        message: 'Failed to authenticate token.'
                    }
                );
            } else {
                req.decodedToken = decoded; // Bu değeri isteğe veri olarak ekliyoruz. Kullanıcıya özel veriyi çekmek için bu kullanılacak.
                next();
            }
        });
    } else {
        res.json(
            {
                status: false,
                message: 'Please send a valid token'
            }
        );
    }
};