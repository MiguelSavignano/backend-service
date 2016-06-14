import { expect } from 'chai';
import sinon from 'sinon';
import routes from '../../../db/routes.json';
import BackendService from '../../lib/BackendService'

BackendService.init({
  routes: routes,
  serverPath: "http://localhost:3000"
})
var request = require('superagent');
var nock = require('nock');

var mock = nock('http://localhost:3000')

mock.get('/show_rooms').reply(200, [{name:"foo"}])
mock.get('/show_room/1').reply(200, {name:"foo"})
mock.get('/show_rooms?other_param=foo').reply(200, [{name:"foo"}])


describe("BackendService", function() {

  // it("requiere json", function() {
  //   expect(BackendService._allRoutes()[0].name).to.equal("root");
  // });

  // it("test request with super agent", function(done) {
  //   request
  //   .get('http://localhost:3000/show_rooms')
  //   .set('Accept', 'application/json')
  //   .end(function(err, res){
  //     expect(res.body[0].name ).to.be.a('string')
  //     done()
  //   });
  // });

  describe("functions request", function(){
    it("show_rooms", function(done) {
      BackendService.show_rooms( (show_rooms) =>{
        expect(show_rooms[0].name ).to.be.a('string')
        expect(show_rooms[0].name ).to.eq('foo')
        done()
      });
    });

    it("show_rooms with query params", function(done) {
      BackendService.show_rooms( {other_param:"foo"}, (show_rooms) =>{
        expect(show_rooms[0].name ).to.be.a('string')
        done()
      });
    });

    // it("show_rooms with query params", function(done) {
    //   BackendService.toggle_favorite_users( {publication_id:"1234"}, (res) =>{
    //     expect(res.is).to.eq()
    //     done()
    //   });
    // });

    // it("show_room with id", function(done) {
    //   BackendService.show_room( {id:"1"}, (show_room) =>{
    //     expect(show_room.name ).to.be.a('string')
    //     done()
    //   });
    // });
  })

  describe("function paths", function(){
    it("collection path", function() {
      var path = BackendService.show_rooms_path();
      expect(path).to.be.a('string')
      expect(path).to.eq('/show_rooms')
    });

    it("path functions show", function() {
      var path = BackendService.show_room_path({id:3});
      expect(path).to.eq('/show_rooms/3')
    });
  })

});
