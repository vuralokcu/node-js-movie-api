const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../app');
const config = require('./config');

chai.use(chaiHttp);

let directorId;
let token;

describe(config.apiUrl + '/directors test', () => {
    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send(config.testUser)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').equal(true);
                res.body.should.have.property('token');
                token = res.body.token;

                done();
            });
    });


    // Get Directors
    describe(config.apiUrl + '/directors GET directors', () => {
        it('it should GET all directors', (done) => {
            chai.request(server)
                .get(config.apiUrl + '/directors')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    /*
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('surname');
                    res.body.should.have.property('bio');
                    res.body.should.have.property('movies').is.a('array');
                    */

                    done();
                });
        });
    });


    // POST Director
    describe(config.apiUrl + '/directors POST director', () => {
        it('it should POST and create a new director.', (done) => {
            const directorData = {
                name: 'Test',
                surname: 'Director',
                bio: 'Test director biography'
            };
            chai.request(server)
                .post(config.apiUrl + '/directors')
                .send(directorData)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name').equal(directorData.name);
                    res.body.should.have.property('surname').equal(directorData.surname);
                    res.body.should.have.property('bio').equal(directorData.bio);
                    res.body.should.have.property('created_at');

                    directorId = res.body._id;
                    done();
                });
        }) ;
    });


    // Get Director Detail
    describe(config.apiUrl + '/directors/:directory_id GET director', () => {
        it('it should be GET director information by given id', (done) => {
            chai.request(server)
                .get(config.apiUrl + '/directors/' + directorId)
                .set('x-access-token', token)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.have.property('_id');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('surname');
                    res.body[0].should.have.property('bio');
                    res.body[0].should.have.property('created_at');
                    res.body[0].should.have.property('movies').be.a('array');

                    done();
                });
        });
    });


    // Update Director Test
    describe(config.apiUrl + '/directors/:director_id PUT director', () => {
        it('it should be PUT and update director that has a given ID', (done) => {
            const directorData = {
                name: 'Test',
                surname: 'Director Updated',
                bio: 'Test director biography updated.'
            };

            chai.request(server)
                .put(config.apiUrl + '/directors/' + directorId)
                .send(directorData)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id').equal(directorId);
                    res.body.should.have.property('name').equal(directorData.name);
                    res.body.should.have.property('surname').equal(directorData.surname);
                    res.body.should.have.property('bio').equal(directorData.bio);
                    res.body.should.have.property('created_at');

                    done();
                });
        });
    });


    // Delete Director Test
    describe(config.apiUrl + '/directors/:director_id DELETE director', () => {
        it('it should be DELETE director that has a given ID', (done) => {
            chai.request(server)
                .delete(config.apiUrl + '/directors/' + directorId)
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