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

  describe('/staking-platforms/:staking_platform_id/payouts', () => {
    it('it should GET ERC20 staking config', (done) => {
      chai.request(server)
        .get('/web/staking-platforms/96b7f440-1a3b-11ea-978f-2e728ce88125/payouts')
        .end((err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it.only('it should PUT ERC20 staking config', (done) => {
      chai.request(server)
        .put('/web/staking-platforms/96b7f440-1a3b-11ea-978f-2e728ce88125/payouts')
        .send([{
          id: 1,
          max_payout: 20
        }])
        .end((err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
})
