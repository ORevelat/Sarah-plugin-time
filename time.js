var moment     = require('moment');

var words = require( './time.json' );

moment.locale('fr')

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

	next({'tts': toSpeak});
};

var actionTime = function (data, next) {
	console.log('\x1b[91mmode=TIME \x1b[0m');

	var pluginProps = Config.modules.time;

	var text = '';
	if (data.cmd == "time")
		text = getTimeMessage();
	else if (data.cmd == "date")
		text = getDateMessage();
	else if ((data.cmd == "week_today") || (data.cmd == "week_tomorrow"))
		text = getWeekMessage(data.cmd == "week_today")

	next({'tts': text});
};

function weekNumber() {
	var date = new Date();
	date.setHours(0, 0, 0, 0);
  
  	// Thursday in current week decides the year.
  	date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  
	// January 4 is always in week 1.
	var week1 = new Date(date.getFullYear(), 0, 4);

	// Adjust to Thursday in week 1 and count number of weeks from date to week1.
	return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

function getTimeMessage() {
	var date = new Date();

	var text = 'il est ';
	if (date.getHours() == 0)
		text += 'minuit';
	else
		text +=  date.getHours() + ' heure ';
	if (date.getMinutes() > 0)
		text += date.getMinutes();

	return text;
};

function getDateMessage() {
	var text = 'nous sommes le ' + moment().format('dddd, DD MMMM YYYY');
	text += ' , et ';
	text += getTimeMessage();

	return text;
};

function getWeekMessage(forToday) {
	var weeknumber = weekNumber();
	
	var text = 'nous sommes ';
	if (forToday === false) {
		text = 'nous serons ';
		weeknumber += 1;
	}

	text = text + ' en semaine ' + weeknumber + ', semaine ' + ((weeknumber%2 == 0) ? 'A' : 'B') + ' pour théa.';

	return text;
};
