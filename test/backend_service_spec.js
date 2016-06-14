import { expect }     from 'chai';
import nock           from'nock'
import routes         from '../routes.json';
import BackendService from '../src/backend_service'

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

  describe("._generatePathWithParams match any params in the path with the object", function(){
    it("id", function() {
      let params = {id:1}
      let path = BackendService._generatePathWithParams("/posts/:id",params)
      expect(path).to.eq('/posts/1')
      expect(params.id).to.be.an('undefined')
    });

    it("slug", function() {
      let params = {slug:"foo"}
      let path = BackendService._generatePathWithParams("/posts/:slug",params)
      expect(path).to.eq('/posts/foo')
      expect(params.slug).to.be.an('undefined')
    });

    it("multiple params", function() {
      let params = {other_param:12, slug:"foo"}
      let path = BackendService._generatePathWithParams("/posts/:slug",params)
      expect(path).to.eq('/posts/foo')
      expect(params.other_param).to.eq(12)
    });
  })
});
