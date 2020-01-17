const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb+srv://apiDbUser:2Qz6irNXQdUfkAUa@movie-app-cluster-kqf3r.mongodb.net/movieApi?retryWrites=true&w=majority', { useNewUrlParser: true,  useUnifiedTopology: true  });
    mongoose.connection.on('open', () => {
        console.log("MongoDB: Connected");
    });

    mongoose.connection.on('error', (err) => {
        console.log("MongoDB: Error", err);
    });

    mongoose.Promise = global.Promise;
};