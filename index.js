
var express = require('express');
var app = express();

//app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){

  setTimeout(function(){

    res.send( req.query.id + '  hello world');
  },1000);
});

//app.listen(3000);

module.exports = app;

