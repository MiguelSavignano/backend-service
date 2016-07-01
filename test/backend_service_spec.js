import { expect }     from 'chai';
import nock           from'nock'
import routes         from '../routes.json';
import BackendService from '../src/backend_service'

BackendService.init({
  routes: routes,
  serverPath: "http://localhost:3000"
})

var mock = nock('http://localhost:3000')

describe("BackendService", function() {

  it("._gererateFunctionPath", function() {
    var path_fnc = BackendService._gererateFunctionPath({
      "name": "update_posts",
      "method": "PUT",
      "path": "/posts/:id"
    })
    expect(path_fnc).to.be.a('function')
    expect( path_fnc({id:4}) ).to.be.eq('/posts/4')
  });

  it("._gererateFunctionRequest", function() {
    var request_fnc = BackendService._gererateFunctionRequest({
      "name": "update_posts",
      "method": "PUT",
      "path": "/posts/:id"
    })
    expect(request_fnc).to.be.a('function')
    expect(request_fnc({id:4}).url).to.eq('http://localhost:3000/posts/4')
    expect(request_fnc({id:4}).method).to.eq('PUT')
    expect(request_fnc({id:4}).header['User-Agent']).to.eq('node-superagent/2.0.0')
    expect(request_fnc({id:4}).header['Accept']).to.eq('application/json')
  });

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
