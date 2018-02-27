var connect     = require('connect');
var serveStatic = require('serve-static');
var execfolder  = __dirname + "/" + process.env.SERVER_PATH;
console.log('Node exec path: ' + execfolder);
connect().use(serveStatic(execfolder)).listen(8080, function(){
    console.log('Server running on 8080...');
});
