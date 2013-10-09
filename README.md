ngHttpPool
==========

An [Angularjs](http://angularjs.org/) module that is able to limit requests at the same time.

##Dependency

* angularjs

##Usage

###Require ngHttpPool and inject the services

```
angular.module( "app", [
	"ngHttpPool"
]).controller('ctrl',function( httpPool ){

});
```

###Create a instance

Limit max request amounts by contructor:


```
var pool = httpPool.create( 2 );
```

###Send a request

Set a http [config](http://docs.angularjs.org/api/ng.$http#parameters) by 'map' function:

```
pool.map({method:"get",url:"/"});
```

> Optionally, specify success and fail callbacks:
```
pool.map({method:"get",url:"/"}, success, error);
```

###Send some requests and get all of the callbacks.

Create a 'defer'.
```
pool.listen()
```

Add and run requests to pool.
```

for( var index = 0; index<10 ; index++ ){

  pool.map({method:"get",url:"/",params:{id:index}});
}
```

Get a promise of callbacks.
```
var promise = pool.Promise();

promise.then(function(){
  console.log( "all of the callbacks." );
});
```

##Demo

Clone this project.

```
git clone http://github.com/SparrowJang/angularjs-http-pool.git

cd angularjs-http-pool
```

Install the express framework.
```
npm install express
```

run a server:
```
node index.js
```

Finally,open your brower,enter [http://localhost:3000/demo/index.html](http://localhost:3000/demo/index.html).



