var _ = require('lodash')
var request = require('superagent');
require('superagent-rails-csrf')(request);

var BackendService = {}
var $serverPath
var $options
var $routes
var $routesPath
var $unauthorizedFnc

BackendService.build = function(options){
  const {serverPath, routes, routesPath, unauthorizedFnc} = options
  $options = options
  $routes = routes
  $serverPath = serverPath || ""
  $routesPath = routesPath
  $unauthorizedFnc = unauthorizedFnc
}

BackendService._generatePathWithParams = (path, params) =>{
  if(!params){ return path }
  _.keys(params).forEach( (key) => {
    var regexp_key = new RegExp(`:${key}`)
    if( regexp_key.test(path) ){
      path = path.replace(regexp_key, params[key])
      delete params[key]
    }
  })
  return path
}

BackendService._gererateFunctionPath = function(json_route){
  const{ name, method, path } = json_route
  return (params) => BackendService._generatePathWithParams(path, params)
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
    if($unauthorizedFnc && (res && res.status) == "401" ){ $unauthorizedFnc(res.body, res, err) }
    if(err  && callbackError){
      res ? callbackError( res.body, res.status, res) : callbackError( {msg:"BackendService, ajax not response"}, 0, undefined)
    }
    if(!err && callback) {callback(res.body, res.status, res)}
  })
  return _request
}

BackendService._gererateFunctionRequest = function(json_route){
  var BackendService = this
  var{ method, path } = json_route
  return (argument1, argument2, argument3) => {
    if( _.isFunction(argument1) ){
      var callback = argument1
      var callbackError = argument2
      return BackendService._generateXhrFunction_(method, path, callback, callbackError )
    }else{
      var callback = argument2
      var callbackError = argument3
      var query = argument1
      var _path = argument1._path || BackendService._generatePathWithParams(path, query)
      if(query['_path']) delete query['_path']
      return BackendService._generateXhrFunction_(method, _path, callback, callbackError, query)
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

BackendService._gererateFunctionStub_ = function(name){
  var BackendService = this
  return (response) =>{
    BackendService[name] = (argument1, argument2, argument3) => {
      var callback = _.isFunction(argument1) ? argument1 : argument2
      return callback(response)
    }
  }
}

var getRoutes = () => {
  if($routesPath){return require($routesPath)}
  if($routes){return $routes}
  return []
}

BackendService.init = function(options={}){
  var BackendService = this
  BackendService.build(options)
  var all_routes = getRoutes()
  var default_routes_names = [
    {name:"_get","method": "GET", "path": ""},
    {name:"_post","method": "POST", "path": ""},
    {name:"_put","method": "PUT", "path": ""},
    {name:"_delete","method": "DELETE", "path": ""}
  ]
  var _all_routes_ = [...all_routes, ...default_routes_names]
  _all_routes_.forEach( function(json_route){
    var {name, method, path} = json_route
    BackendService[`${name}_path`] = BackendService._gererateFunctionPath(json_route)
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
