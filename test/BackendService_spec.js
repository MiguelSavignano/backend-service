import { expect }     from 'chai';
import nock           from'nock'
import routes         from '../routes.json';
import BackendService from '../BackendService'

BackendService.init({
  routes: routes,
  serverPath: "http://localhost:3000"
})

var mock = nock('http://localhost:3000')

describe("BackendService generate functions using the routes.json", function() {

  describe("Functions request", function(){
    it('.posts', function(done) {
      mock.get('/posts').reply(200, [{name:"foo"}])
      BackendService.posts( (posts) =>{
        expect(posts[0].name ).to.be.a('string')
        expect(posts[0].name ).to.eq('foo')
        done()
      });
    });

    it('.posts', function(done) {
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
