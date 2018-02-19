require('file-loader?name=[name].[ext]!../index.html');
require('../sass/style.sass');

const Main = require('../ts/Main');
const DOM = require('react-dom');

DOM.render(Main, document.getElementById('main'));