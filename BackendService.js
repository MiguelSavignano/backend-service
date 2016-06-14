var _ = require('lodash')
var request = require('superagent');
require('superagent-rails-csrf')(request);

var BackendService = {}
var $serverPath
var $options
var $routes
var $routesPath

BackendService.build = function(options){
  const {serverPath, routes, routesPath} = options
  $options = options
  $routes = routes
  $serverPath = serverPath || ""
}

BackendService._generatePathWithParams = (path, params) =>{
  return path.replace(/:id/, params.id)
}

BackendService._gererateFunctionPath = function(json_route){
  const{ name, method, path } = json_route
  return (params) => /:id/.test(path) ? BackendService._generatePathWithParams(path, params) : path
}

BackendService._generateXhrFunction_ = function(method, path, callback, callbackError, data){
  var BackendService = this
  var _request = request(method,`${$serverPath}${path}`).set('Accept', 'application/json')
  if(method == "GET" && data) {
    _request.query(data)
  }
  if(method!="GET" && data)  {
    _request.send(data)
    if($serverPath === ""){_request.setCsrfToken()}
  }
  _request.end(function(err, res){
    if(err  && callbackError){callbackError(res.body, res.status, res)}
    if(!err && callback)     {callback(res.body, res.status, res)}
  })
  return _request
}

BackendService._gererateFunctionRequest = function(json_route){
  var BackendService = this
  var{ name, method, path } = json_route
  return (argument1, argument2, argument3) => {
    if( _.isFunction(argument1) ){
      var callback = argument1
      return BackendService._generateXhrFunction_(method, path, callback, callbackError )
    }else{
      var callback = argument2
      var callbackError = argument3
      var query = argument1
      path = BackendService._generatePathWithParams(path, query)
      return BackendService._generateXhrFunction_(method, path, callback, callbackError, query)
    }
  }
}

BackendService._gererateFunctionStub_ = function(name){
  var BackendService = this
  return (response) =>{
    BackendService[name] = (argument1, argument2, argument3) => {
      var callback = _.isFunction(argument1) ? argument1 : argument2
      return callback(response)
    }
  }
}
//create other function in the function
// var fnc = () => "Hola"
// fnc.hola = () => "Hola again"
// mutate function
// var fnc = () => "Hola"
// fnc.mutate = () => { fnc = () => "aloH" }

var getRoutes = () => {
  if($routesPath){return require($routesPath)}
  if($routes){return $routes}
  return []
}

// options
// routes or routesPath is requiered
// serverPath
BackendService.init = function(options={}) {
  var BackendService = this
  BackendService.build(options)
  var all_routes = getRoutes()
  all_routes.forEach( function(json_route) {
    var {name, method, path} = json_route
    BackendService[`${name}_path`] =  BackendService._gererateFunctionPath(json_route)
    BackendService[name] = BackendService._gererateFunctionRequest(json_route)
    BackendService[name].responseWith = BackendService._gererateFunctionStub_(name)
  })
  return BackendService
}

BackendService.stub = (response) => {
  return (argument1, argument2) => {
    var callback = _.isFunction(argument1) ? argument1 : argument2
    return callback(response)
  }
}
BackendService.reset = () => BackendService.init($options)

export default BackendService
