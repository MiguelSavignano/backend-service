import { expect }     from 'chai';
import nock           from'nock'
import sinon           from 'sinon'
import routes         from '../routes.json';
import BackendService from '../src/backend_service'

BackendService.init({
  routes: routes,
  serverPath: "http://localhost:3000"
})

var mock = nock('http://localhost:3000')

describe("BackendService", function() {
  describe("option unauthorizedFnc", function(){
    it('called unauthorizedFnc', function(done) {
      var unauthorizedFnc_spy = sinon.spy();
      BackendService.init({
        routes: routes,
        serverPath: "http://localhost:3000",
        unauthorizedFnc: unauthorizedFnc_spy
      })
      mock.get('/posts').reply(401, {"error":"You need to sign in or sign up before continuing."})
      BackendService.posts( (posts) =>{}, (error) => {
        expect(error.error ).to.eq('You need to sign in or sign up before continuing.')
        sinon.assert.calledWith(unauthorizedFnc_spy,
          {"error":"You need to sign in or sign up before continuing."}
        );
        done()
      });
    });
  })

  describe("accept path argument string", function(){
    it('remplace the parh in the rote json and user the string path', function(done) {
      mock.get('/posts/2').reply(200, {name:"foo"})
      BackendService.post( {_path: '/posts/2' }, (posts) =>{
        expect(posts.name ).to.eq('foo')
        done()
      })
    });
  })

  describe("Functions request", function(){
    it('.posts', function(done) {
      mock.get('/posts').reply(200, [{name:"foo"}])
      BackendService.posts( (posts) =>{
        expect(posts[0].name ).to.be.a('string')
        expect(posts[0].name ).to.eq('foo')
        done()
      });
    });

    it('called callbackError', function(done) {
      mock.get('/posts').reply(500, {"error":"Server error"})
      BackendService.posts( (posts) =>{}, (error) => {
        done()
      });
    });

    it('called callbackError not response', function(done) {
      // mock.get('/posts').reply(500, {"error":"Server error"})
      BackendService.posts( (posts) =>{}, (error) => {
        expect(error.msg ).to.eq('BackendService, ajax not response')
        done()
      });
    });

    it('.posts other params', function(done) {
      mock.get('/posts?other_param=foo').reply(200, [{name:"foo"}])
      BackendService.posts( {other_param:'foo'}, (posts) =>{
        expect(posts[0].name ).to.be.a('string')
        expect(posts[0].name ).to.eq('foo')
        done()
      });
    });

    it(".new_post", function(done) {
      mock.get('/posts/new').reply(200, {name:"foo"})
      BackendService.new_post( (post) =>{
        expect(post.name).to.be.a('string')
        expect(post.name).to.eq('foo')
        done()
      });
    });

    it(".post", function(done) {
      mock.get('/posts/1').reply(200, {name:"foo"})
      BackendService.post( {id:1},(post) =>{
        expect(post.name).to.be.a('string')
        expect(post.name).to.eq('foo')
        done()
      });
    });

    it(".post url solve issue bad generate the second url", function() {
      var requested = BackendService.post({id:1})
      expect(requested.url).to.be.eq('http://localhost:3000/posts/1')
      var requested = BackendService.post({id:2})
      expect(requested.url).to.be.eq('http://localhost:3000/posts/2')
    });

  })

  describe("Functions paths", function(){
    it(".posts_path", function() {
      var path = BackendService.posts_path();
      expect(path).to.be.a('string')
      expect(path).to.eq('/posts')
    });

    it(".post_path", function() {
      var path = BackendService.post_path({id:3});
      expect(path).to.eq('/posts/3')
    });
  })

});
