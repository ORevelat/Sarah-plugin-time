var words = require( './time.json' );

exports.init = function() {
	console.log('\x1b[96mTime plugin is initializing ... \x1b[0m');
};

exports.dispose  = function() {
	console.log('\x1b[96mTime plugin is disposed ... \x1b[0m');
};

exports.action = function(data, next) {
	if ( data.mode && (data.mode == "TIME"))
		return actionTime(data, next);

	commandError(next);
};

var commandError = function(next) {
	var toSpeak = '';
	var availableTTS = words["command_error"];
	if (Object.keys(availableTTS).length > 0) {
		var choice = Math.floor(Math.random() * Object.keys(availableTTS).length); 
		toSpeak = availableTTS[choice];
	}

	console.log('command error');
	next({'tts': toSpeak});
};

var actionTime = function (data, next) {
	console.log('\x1b[91mmode=TIME \x1b[0m');

	var pluginProps = Config.modules.time;

	var date = new Date();

	var text = 'il est ' + date.getHours() + ' heure ';
	if (date.getMinutes() > 0) { 
		text += date.getMinutes();
	}

	next({'tts': text});
};
