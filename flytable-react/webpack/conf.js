const options = {
	spa: {
		siteName:           'SPA',
		distFolder:         'SPA',
		notifierTitle:      'SPA',
		production:         false,
		showProgress:       false,
		dropConsole:        false, // if production == true
		cutComments:        true,  // if production == true
		zipFolder:          false, // if production == true
		sourceMap:          false,
		version:            1,
		devServerPort:      8081
	}
};

module.exports = function(env) {
	const site = env.site;

	if ( !options[site] ) {
		throw new Error('Отсутствует конфигурация для сайта "' + site + '"');
	}

	return require('./webpack.custom.config.js')(options[site]);
};