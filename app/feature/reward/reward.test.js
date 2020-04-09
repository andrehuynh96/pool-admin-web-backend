let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../server');
let should = chai.should();

chai.use(chaiHttp);

describe('commission', function () {
  this.timeout(5000);
  beforeEach((done) => {
    setTimeout(done, 3000)
  });

  describe('/settings/rewards', () => {
    it.only('it should GET all rewards configs', (done) => {
      chai.request(server)
        .get('/web/settings/rewards')
        .end((err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('it should GET all rewards config history', (done) => {
      chai.request(server)
        .get('/web/settings/rewards/histories')
        .end((err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
})
