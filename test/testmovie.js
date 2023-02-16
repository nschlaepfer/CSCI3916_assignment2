let envPath = __dirname + "/../.env"
require('dotenv').config({path:envPath});
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let db = require('../db')();
chai.should();

chai.use(chaiHttp);

let login_details = {
    name: 'test',
    username: 'email@email.com',
    password: '123@abc'
}

describe('Test Movies Routes', () => {
   beforeEach((done) => { //Before each test initialize the database to empty
       db.userList = [];
       done();
    })

    after((done) => { //after this test suite empty the database
        db.userList = [];
        done();
    })

    //Test the GET route
    describe('GET movies', () => {
        it('it should return GET movies', (done) => {
            chai.request(server)
                .get('/movies')
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.eq('GET movies');
                    done();
                })
        })
    });

    //Test the GET route
    describe('post movies', () => {
        it('it should return movie saved', (done) => {
            chai.request(server)
                .post('/movies')
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.eq('movie saved')
                    done();
                })
        })
    });

    //Test the GET route
    describe('DELETE movies', () => {
        it('it should return movie deleted', (done) => {
            chai.request(server)
                .delete('/movies')
                .auth('cu_user', 'cu_rulez')
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.eq('movie deleted')
                    done();
                })
        })
    });

    //Test the PUT route
    describe('/PUT movies', () => {
        it('it should return movie updated', (done) => {
        chai.request(server)
            .post('/signup')
            .send(login_details)
            .end((err, res) =>{
                res.should.have.status(200);
                res.body.success.should.be.eql(true);
                //follow-up to get the JWT token
                chai.request(server)
                    .post('/signin')
                    .send(login_details)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('token');

                        let token = res.body.token;
                        //console.log('got token ' + token)
                        //lets call a protected API
                        chai.request(server)
                            .put('/movies')
                            .set('Authorization', token)
                            .send({echo: ''})
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.have.property('message');
                                res.body.message.should.eq('movie updated')
                                done();
                            })
                    })
            })
        })
    });
});
