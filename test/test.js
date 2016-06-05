var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:8090");

// UNIT test begin

describe("SAMPLE unit test",function(){

  // #1 should return home page

  it("correct request",function(done){

    // calling home page api
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

  it("in correct request",function(done){

    // calling home page api
    server
    .post('/enter')
    .send({ fsm : 20, id :"21423", friendsId: ["first", "sec", "third" ], type : "dsad"})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
 //	console.dir(res.body.data[0].user.vk);
        res.body.code.should.equal('0');
	res.status.should.equal(200);
      done();
    });
  });
});
