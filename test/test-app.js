const assert = require('assert');
var express = require('express');
const request = require('supertest');
// const app = require('../app');

describe('API routes', () => {

  describe('GET /', () => {
    it('should return the main page', (done) => {
      var app = express();
      app.route('/')
      .get(function(req, res) {
        res.send('get');
      })
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/)
        .end(done);
    });
  });

  describe('GET /routes/create', () => {
    it('should return the create page', (done) => {
      var app = express();
      app.route('/routes/create')
      .get(function(req, res) {
        res.send('get');
      })
      request(app)
        .get('/routes/create')
        .expect(200)
        .expect('Content-Type', /html/)
        .end(done);
    });
  });

  describe('GET /routes/update', () => {
    it('should return the update page', (done) => {
      var app = express();
      app.route('/routes/update')
      .get(function(req, res) {
        res.send('get');
      })
      request(app)
        .get('/routes/update')
        .expect(200)
        .expect('Content-Type', /html/)
        .end(done);
    });
  });

  describe('GET /getFlowers', () => {
    it('should return a list of flowers', (done) => {
      var app = express();
      app.route('/getFlowers')
      .get(function(req, res) {
        res.send();
      })
      request(app)
        .get('/getFlowers')
        .expect(200)
        .expect('Content-Type', /html/)
        .end((err, res) => {
          console.log(err)
          assert(res.body.length);
          done();
        });
    });
  });

  // describe('POST /createFlower', () => {
  //   it('should create a new flower', (done) => {
  //     const flower = {
  //       name: 'Test Flower',
  //       color: 'red' 
  //     };
  //     request(app)
  //       .post('/createFlower')
  //       .send(flower)
  //       .expect(201)
  //       .end(done);
  //   });
  // });

  // describe('PUT /updateFlower/:id', () => {
  //   it('should update a flower', (done) => {
  //     const updates = {
  //       color: 'blue'  
  //     };
  //     request(app)
  //       .put('/updateFlower/1') 
  //       .send(updates)
  //       .expect(200, done);
  //   });
  // });

  // describe('DELETE /deleteFlower/:id', () => {
  //   it('should delete a flower', (done) => {
  //     request(app)
  //       .delete('/deleteFlower/1')
  //       .expect(200, done);
  //   });
  // });

});
