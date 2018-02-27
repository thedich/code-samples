var connect     = require('connect');
var serveStatic = require('serve-static');
var execfolder  = __dirname + "/build/";
connect().use(serveStatic(execfolder)).listen(8080, function(){
    console.log('Server running on 8080...');
});
