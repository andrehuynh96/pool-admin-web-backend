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

  describe('/payouts', () => {
    it('it should GET ERC20 staking config', (done) => {
      chai.request(server)
        .get('/web/payouts')
        .end((err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it.only('it should PUT ERC20 staking config', (done) => {
      chai.request(server)
        .put('/web/payouts/3')
        .send([{ 
                token_name: "Infinito",
                token_symbol: "INFT",
                actived_flg: true
              }])
        .end((err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    it.only('it should PUT ERC20 staking config', (done) => {
      chai.request(server)
        .post('/web/payouts')
        .send([{
              platform: "ETH",
              token_name: "Infinito",
              token_symbol: "INFT",
              token_address: "0x1716a6f9D3917966d934Ce7837113A30dFFda9F4",
              actived_flg: true
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
