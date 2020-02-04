let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../server');
let should = chai.should();

chai.use(chaiHttp);

describe('staking plan', function () {
  this.timeout(5000);
  beforeEach((done) => {
    setTimeout(done, 3000)
  });

  describe('/staking-platforms/:staking_platform_id/plans', () => {
    it('it should GET ERC20 staking plan', (done) => {
      chai.request(server)
        .get('/web/staking-platforms/96b7f440-1a3b-11ea-978f-2e728ce88125/plans')
        .end((err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('it should GET detail ERC20 staking plan', (done) => {
      chai.request(server)
        .get('/web/staking-platforms/96b7f440-1a3b-11ea-978f-2e728ce88125/plans/0e37df36-f698-11e6-8dd4-cb9ced3df978')
        .end((err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it.only('it should UPDATE ERC20 staking plan', (done) => {
      chai.request(server)
        .put('/web/staking-platforms/96b7f440-1a3b-11ea-978f-2e728ce88125/plans/0e37df36-f698-11e6-8dd4-cb9ced3df978')
        .send({
          staking_plan_code: "plan-032",
          duration: 21,
          duration_type: "MONTH",
          reward_per_year: 3.500
        })
        .end((err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
})
