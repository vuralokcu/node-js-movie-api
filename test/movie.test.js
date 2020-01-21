const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../app');
const config = require('./config');

chai.use(chaiHttp);

let token;
let movieId;

describe(config.apiUrl + '/movies tests', () => {
    // testlere başlamadan önce jwt ile sağlanan tokenı almak gerekiyor.
    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send(config.testUser)
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    describe('/GET movies', () => {
        it('it should get all the movies', (done) => {
            chai.request(server)
                .get(config.apiUrl + '/movies')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe('/POST movie', () => {
        it('it should POST a movie', (done) => {
            const movie = {
                title: 'Test Movie',
                director_id: '5e22499af0cb6920e03639ff',
                category: 'Test',
                country: 'Türkiye',
                year: 1950,
                imdb_score: 8
            };

            chai.request(server)
                .post(config.apiUrl + '/movies')
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    //res.body.should.have.property('result');
                    //res.body.result.should.be.equal(true);

                    movieId = res.body._id;
                    done();
                });
        });
    });

    describe('/GET/:movie_id movie', () => {
        it('it should GET a movie by the given ID', (done) => {
            chai.request(server)
                .get(config.apiUrl + '/movies/' + movieId)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    res.body.should.have.property('_id').equal(movieId);
                });

                done();
        });
    });

    describe('/PUT/:movie_id movie', () => {
        it('it should update the movie', (done) => {

            const movie = {
                title: 'Test Movie Updated Title',
                director_id: '5e22499af0cb6920e03639ff',
                category: 'Test',
                country: 'Türkiye',
                year: 1950,
                imdb_score: 8
            };

            chai.request(server)
                .put(config.apiUrl + '/movies/' + movieId)
                .set('x-access-token', token)
                .send(movie)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title').equal(movie.title);
                    res.body.should.have.property('director_id').equal(movie.director_id);
                    res.body.should.have.property('category').equal(movie.category);
                    res.body.should.have.property('country').equal(movie.country);
                    res.body.should.have.property('year').equal(movie.year);
                    res.body.should.have.property('imdb_score').equal(movie.imdb_score);
                    res.body.should.have.property('_id').equal(movieId);

                    done();
                });
        });
    });

    // Delete the movie
    describe('/DELETE/:movie_id movie', () => {
        it('it should DELETE a movie given by id', (done) => {

            chai.request(server)
                .delete(config.apiUrl + '/movies/' + movieId)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result').equal(true);
                });

                done();
        });
    });
});