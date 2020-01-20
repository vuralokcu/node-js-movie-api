const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../app');

chai.use(chaiHttp); // node node_modules/mocha/bin/mocha komutu ile çalıştırılacak. ya da package json dosyasının scripts kısmına "test": "mocha" yazdıktan sonra "npm run test" denerek ilgili script ile test'ler çalıştırılabilir. Test aşamasında console'daki MongoDB connection'ının önüne geçmek için "mocha --exit" olarak ilgili script güncellenir. "mocha --recursive" parametresi ile test klasörü içerisindeki tüm klasörlere test işlemi uygulanır.

// test açıklaması
describe('Node Server', () => {
    it('(GET /) anasayfayı döndürür', (done) => { // Herhangi bir unit test elemanıdır.
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200); //  "/" urline yapılacak isteğin response'u "200" status'üne sahip olmalı.
                done();
            });
    });
});