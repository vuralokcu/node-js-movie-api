const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../app');

chai.use(chaiHttp);

let token;
const testUser = {
    username: 'test',
    password: '123456'
};

describe('/api/movies tests', () => {
    // testlere başlamadan önce jwt ile sağlanan tokenı almak gerekiyor.
    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send(testUser)
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    describe('/GET movies', () => {
        it('it should get all the movies', (done) => {
            chai.request(server)
                .get('/api/movies')
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
                .post('/api/movies')
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.equal(true);
                    done();
                });
        });
    });

    describe('/GET/:movie_id movie', () => {
        it('it should GET a movie by the given ID', (done) => {
            const movieId = '5e26371d1f26f81154fa9579';
            chai.request(server)
                .get('/api/movies/' + movieId)
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
});