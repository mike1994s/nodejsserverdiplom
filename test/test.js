var supertest = require("supertest");
var should = require("should");
 
// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:8090");

// UNIT test begin
var boundary = Math.random();
var filename = "test.png";
describe("SAMPLE unit test",function(){


  it("correct request",function(done){
    server
    .post('/enter')
    .send({idphone : "testMOcha", fsm : 20, id :"21423", friendsId: ["first", "sec", "third" ], type : "vk"})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
 //	console.dir(res.body.data[0].user.vk);
        res.body.code.should.equal('1');
	res.status.should.equal(200);
      done();
    });
  });

  it("correct request", function(done){
    server
    .post('/enter')
    .send({idphone : "testMOcha", fsm : 20, id :"21423", friendsId: ["first", "sec", "third" ], type : "vk"})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
 //	console.dir(res.body.data[0].user.vk);
        res.body.code.should.equal('1');
	res.status.should.equal(200);
      done();
    });
  });


  it("START_GAME ",function(done){
   
    server
    .post('/startgame')
   .field('user[name]', 'Tobi')
   .field('user[email]', 'tobi@learnboost.com')
   .attach('image', 'test.png')
    .end(function(err,res){
 //	console.dir(res.body.data[0].user.vk);
        res.body.code.should.equal('0');
	res.status.should.equal(200);
      done();
    });
  });
}); 
