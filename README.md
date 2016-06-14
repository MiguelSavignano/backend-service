#BackenService.js
Generate multiple ajaxs function with name!!

##Initialize
```javascript
import MyApi from 'backend-service' // or var MyApi = require('backend-service')
var routes=[{"name":"users","method":"GET","path":"/users"},{"name":"user","method":"GET","path":"/users/:id"}

MyApi.init({
  routes: routes // or routesPath: './routes.json'
})
```
##Ajax functions generated
Backend service generate function with the path, method and the name i'ts the function name
```javascript
MyApi.users( (users) => {console.log(users)} )// GET /users
MyApi.users( {location:madrid}, (users) => {console.log(users)} ) //GET /users?location=madrid
MyApi.user( {id:1}, (user) => {console.log(user)} ) // GET /users/1 
```
Backendservice use superagent.js https://github.com/visionmedia/superagent.
The generate function i'ts the same with this
```javascript
request(method, path)
  .set('Accept', 'application/json')
  .query(data)
  .end( (err, res) => {} )
```
##Path functions generated
BackendService generate path functions like this
```javascript
"/users/"  == MyApi.users_path() 
"/users/3" == MyApi.user_path({id:3}) 
```

##Mock in your Unit test
For testing; FavoriteBtn will be to call a ajax function when success the ajax change the css class.
```javascript
it("simulate click and the heart will be red; in this test the ajax call it's a mock", function(){
  BackendService.reset()
  BackendService.add_to_favorite.responseWith({ok:true, err:false})
  const wrapper = mount(<FavoriteBtn active={false} book={book} />)
  wrapper.find('a').simulate('click');
  expect( wrapper.props().active ).to.equal(true);
  expect( wrapper.find('a').hasClass('heart-red') ).to.equal(true);
})
```
You don't need to change your production code, BackendService call the same callbackSucess but call immediately and the response it's a mock.

##Options
* routes //array of routes
* routesPath //path contain json file with the routes array
* serverPath //set other server path 
* setCsrfToken // add superagent-rails-csrf for Rails Serve

#More
* MyApi.users( query_data, callbackSucess, callBackError )
* MyApi.create_users( send_data, callbackSuccess, callBackError ) Post|PUT
* callBackSuccess( response.body, response.status, response  ) Arguments in the callbackSuccess using superagent





