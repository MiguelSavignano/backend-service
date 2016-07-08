#BackendService.js
Generate multiple ajaxs function with name!!

##Initialize
```javascript
import MyApi from 'backend-service' // or var MyApi = require('backend-service')
var routes = [
  {"name":"users", "method":"GET", "path":"/users"},
  {"name":"user", "method":"GET", "path":"/users/:id"},
  {"name":"post", "method":"GET", "path":"/posts/:slug"}
]

MyApi.init({
  routes: routes
})
```
##Ajax functions generated
Backend service generate function using your path, method and name defined in the routes.json
```javascript
MyApi.users( (users) => {console.log(users)} )                      //GET /users
MyApi.user( {id:1}, (user) => {console.log(user)} )                 //GET /users/1
MyApi.users( {location:"madrid"}, (users) => {console.log(users)} ) //GET /users?location=madrid
MyApi.post( {slug:"post-title"}, (post) => {console.log(post)} )    //GET /post/post-title
```
Backendservice use [superagent.js](https://github.com/visionmedia/superagent.)
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
"/post/post-title" == MyApi.user_path({slug:"post-title-slug"})
```

##Mock in your Unit test
Use the method responseWith to override the ajax function and response immediately
```javascript
it("when click the heart will be red; in this test the ajax call it's a mock", function(){
  MyApi.reset()
  MyApi.add_to_favorite.responseWith({ok:true, err:false})
  const wrapper = mount(<FavoriteBtn active={false} book={book} />)
  wrapper.find('a').simulate('click');
  expect( wrapper.props().active ).to.equal(true);
  expect( wrapper.find('a').hasClass('heart-red') ).to.equal(true);
})
```
You don't need to change your production code, BackendService call the same callbackSucess but call immediately and the response it's a mock.

##Unauthorized function
BackendService recive a function and called when the response status it's 401
```javascript
MyApi.init({
  routes: routes,
  unauthorizedFnc: function(response_body){
    if ( response_body.error == "You need to sign in or sign up before continuing.")
      openLoginModal()
  }
})
```

##Options
* routes:  array of routes
* routesPath: path contain json file with the routes array
* serverPath: set other server path
* setCsrfToken: add superagent-rails-csrf for Rails Serve

#Arguments Recive
* MyApi.users( query_data, callbackSucess, callBackError )
* MyApi.create_users( send_data, callbackSuccess, callBackError ) Post|PUT

#Arguments contain
* callBackSuccess( response.body, response.status, response  )
