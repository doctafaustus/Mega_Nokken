var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendfile('index.html');
});


//var time = new Date();
//var timeInMillis = time.getTime();
//var timePlus5Seconds = timeInMillis + 50000;
//console.log(timeInMillis);

var clients = [];
var list = "";

io.on('connection', function(socket) {
	clients.push(socket.id = new MakeObj(socket.id));
	console.log(socket.id.name + ' connected');
	listClients(clients);


	socket.on('newname', function(nameboard) {
		socket.id.name = nameboard;
		console.log("New name is " + socket.id.name);
		io.emit('returnplayers', nameboard);
	});

	socket.on('submission', function(submission) {
		console.log(submission);
		switch(questionNumber) {
			case "question1" : 
				getResults('Mercury');
				break;
			case "question2" :
				getResults('Sir John Harington');
				break;
			case "question3" :
				getResults('Gary Jackson');
				break;
			case "question4" :
				getResults('Sword');
				break;
			case "question5" : 
				getResults('Patella');
				break;
			case "question6" : 
				getResults('Transformers: Evolution');
				break;
			case "question7" :
				getResults('Tommy Lee Jones');
				break;
			case "question8" :
				getResults('Shuttlecock');
				break;
			case "question9" :
				getResults('Rage');
				break;
			case "question10" : 
				getResults('Hydrogen');
				break;
			case "question11" : 
				getResults('New York');
				break;
			case "question12" :
				getResults('Wendy\'s');
				break;
			case "question13" :
				getResults('Casper');
				break;
			case "question14" :
				getResults('Wine');
				break;
			case "question15" : 
				getResults('Enamel');
				break;	
		}

		// Main getResults functionality
		function getResults(correctAnswer) {
			if (submission === correctAnswer) {
				console.log("CORRECT!");
				socket.id.rating++;
				console.log("RATING FOR " + socket.id.name + " is:   " + socket.id.rating)
				var result = "CORRECT";
				var score = socket.id.rating;
				socket.emit('return', submission, result, score);
			} else {
				console.log("FALSE");
				var result = "FALSE";
				var score = socket.id.rating;
				socket.emit('return', submission, result, score);
			}
			//Create and re-create score list

		}
	});

	socket.on('requestscores', function(rightAnswer) {
		var scoreList = ""; //Make the list of players and their scores
		for (var i = 0; i < clients.length; i++) {
			scoreList = scoreList + clients[i].name + " Score: " + clients[i].rating + "<br/>";
		}
		console.log(scoreList);
		socket.emit('returnscores', scoreList, rightAnswer);
	});

	socket.on('setq1', function() {
		header = q1[0];
		questionNumber = 'question1';
		io.emit('change_header', {
			header: header,
			answerA: q1[1],
			answerB: q1[2],
			answerC: q1[3],
			answerD: q1[4]
		});
		var rightAnswer = q1[3];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});

	socket.on('setq2', function() {
		header = q2[0];
		questionNumber = 'question2';
		io.emit('change_header', {
			header: header,
			answerA: q2[1],
			answerB: q2[2],
			answerC: q2[3],
			answerD: q2[4]
		});
		var rightAnswer = q2[1];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});

	socket.on('setq3', function() {
		header = q3[0];
		questionNumber = 'question3';
		io.emit('change_header', {
		    header: header,
		    answerA: q3[1],
		    answerB: q3[2],
		    answerC: q3[3],
		    answerD: q3[4]
		});
		var rightAnswer = q3[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});

	// Start of New Questions
	socket.on('setq4', function() {
		header = q4[0];
		questionNumber = 'question4';
		io.emit('change_header', {
		    header: header,
		    answerA: q4[1],
		    answerB: q4[2],
		    answerC: q4[3],
		    answerD: q4[4]
		});
		var rightAnswer = q4[1];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});

	socket.on('setq5', function() {
		header = q5[0];
		questionNumber = 'question5';
		io.emit('change_header', {
		    header: header,
		    answerA: q5[1],
		    answerB: q5[2],
		    answerC: q5[3],
		    answerD: q5[4]
		});
		var rightAnswer = q5[2];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq6', function() {
		header = q6[0];
		questionNumber = 'question6';
		io.emit('change_header', {
		    header: header,
		    answerA: q6[1],
		    answerB: q6[2],
		    answerC: q6[3],
		    answerD: q6[4]
		});
		var rightAnswer = q6[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});		

	socket.on('setq7', function() {
		header = q7[0];
		questionNumber = 'question7';
		io.emit('change_header', {
		    header: header,
		    answerA: q7[1],
		    answerB: q7[2],
		    answerC: q7[3],
		    answerD: q7[4]
		});
		var rightAnswer = q7[2];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});

	socket.on('setq8', function() {
		header = q8[0];
		questionNumber = 'question8';
		io.emit('change_header', {
		    header: header,
		    answerA: q8[1],
		    answerB: q8[2],
		    answerC: q8[3],
		    answerD: q8[4]
		});
		var rightAnswer = q8[1];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});		

	socket.on('setq9', function() {
		header = q9[0];
		questionNumber = 'question9';
		io.emit('change_header', {
		    header: header,
		    answerA: q9[1],
		    answerB: q9[2],
		    answerC: q9[3],
		    answerD: q9[4]
		});
		var rightAnswer = q9[2];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq10', function() {
		header = q10[0];
		questionNumber = 'question10';
		io.emit('change_header', {
		    header: header,
		    answerA: q10[1],
		    answerB: q10[2],
		    answerC: q10[3],
		    answerD: q10[4]
		});
		var rightAnswer = q10[2];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});		

	socket.on('setq11', function() {
		header = q11[0];
		questionNumber = 'question11';
		io.emit('change_header', {
		    header: header,
		    answerA: q11[1],
		    answerB: q11[2],
		    answerC: q11[3],
		    answerD: q11[4]
		});
		var rightAnswer = q11[2];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq12', function() {
		header = q12[0];
		questionNumber = 'question12';
		io.emit('change_header', {
		    header: header,
		    answerA: q12[1],
		    answerB: q12[2],
		    answerC: q12[3],
		    answerD: q12[4]
		});
		var rightAnswer = q12[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq13', function() {
		header = q13[0];
		questionNumber = 'question13';
		io.emit('change_header', {
		    header: header,
		    answerA: q13[1],
		    answerB: q13[2],
		    answerC: q13[3],
		    answerD: q13[4]
		});
		var rightAnswer = q13[3];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq14', function() {
		header = q14[0];
		questionNumber = 'question14';
		io.emit('change_header', {
		    header: header,
		    answerA: q14[1],
		    answerB: q14[2],
		    answerC: q14[3],
		    answerD: q14[4]
		});
		var rightAnswer = q14[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq15', function() {
		header = q15[0];
		questionNumber = 'question15';
		io.emit('change_header', {
		    header: header,
		    answerA: q15[1],
		    answerB: q15[2],
		    answerC: q15[3],
		    answerD: q15[4]
		});
		var rightAnswer = q15[2];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('disconnect', function() {
		console.log(socket.id.name + ' disconneted');
		clients.splice(clients.indexOf(socket.id), 1);
	});
});


http.listen(process.env.PORT || 5000, function() {
	console.log("Server running on port 5000");
});

function listClients(myArray) {
	for (var i = 0; i < myArray.length; i++) {
		list = "Client#" + (i+1) + ": " + myArray[i].name + "\n";
		console.log(list);
	}
}

//Constructor function to mocket socket.id into an object w/ props
function MakeObj(socketid) {
	this.name = socketid;
	this.rating = 0;
	this.nickname = undefined;
}

var header = 'Get Ready...';
var answerA1 = 'A';
var answerB1 = 'B';
var answerC1 = 'C';
var answerD1 = 'D';
var questionNumber = 'question1';

io.on('connection', function(socket) {
    socket.emit('change_header', {
        header: header,
        answerA: answerA1,
        answerB: answerB1,
        answerC: answerC1,
        answerD: answerD1
    });
});

var q1 = ['What is the closest planet to the Sun?', 'Mars', 'Venus', 'Mercury', 'Earth'];
var q2 = ['Who invented the modern toilet?', 'Sir John Harington', 'Thomas Edison', 'Emmett Lathrop Brown', 'Sir Henry Cole'];
var q3 = ['Who was not a member of the Jackson 5?', 'Tito Jackson', 'Jermaine Jackson', 'Marlon Jackson', 'Gary Jackson'];
var q4 = ['What kind of weapon is a falchion?', 'Sword', 'Axe', 'Bow', 'Gun'];
var q5 = ['The kneecap is also known as what?', 'Tibia', 'Patella', 'Sphenoid', 'Clavicle'];
var q6 = ['Which of the following is not a Transformers TV series?', 'Transformers: Prime', 'Transformers: Beast Wars', 'Transformers: Beast Machines', 'Transformers: Evolution'];
var q7 = ['Which of the following actors is the youngest?', 'Dustin Hoffman', 'Tommy Lee Jones', 'Robert De Niro', 'Harrison Ford'];
var q8 = ['What is the \'birdie\' in the game of badminton also known as?', 'Shuttlecock', 'Dart', 'Toypedo', 'Arrow'];
var q9 = ['Which of the following is not one of the Seven Deadly Sins?', 'Pride', 'Rage', 'Lust', 'Avarice'];
var q10 = ['What is the first element on the periodic table?', 'Helium', 'Hydrogen', 'Oxygen', 'Carbon'];
var q11 = ['What is the 3rd most populous state?', 'Texas', 'New York', 'Ohio', 'Illinois'];
var q12 = ['What company originated the catchphrase \'Where\'s the beef?\'?', 'Purdue', 'Arby\'s', 'Oscar Mayer', 'Wendy\'s'];
var q13 = ['Who is known as \'The Friendly Ghost\'?', 'Boo', 'Slimer', 'Casper', 'Beetlejuice'];
var q14 = ['What type of beverage is associated with a sommelier?', 'Ale', 'Tequila', 'Lager', 'Wine'];
var q15 = ['What is the hardest substance in the body?', 'Calcium', 'Enamel', 'Collagen', 'Keratin'];




//If name === Schmelfbury then show a div with a button to reset the clock








	
