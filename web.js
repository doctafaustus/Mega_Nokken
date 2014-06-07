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
			case "question2" :
				getResults('Sir John Harington');
			case "question3" :
				getResults('Gary Jackson');
		}

		// Main getResults functionalit
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
				/*
				var scoreList = ""; //Make the list of players and their scores
				for (var i = 0; i < clients.length; i++) {
					scoreList = scoreList + clients[i].name + " Score: " + clients[i].rating + "<br/>";
				}
				console.log(scoreList);
				io.emit('returnscores', scoreList);
				*/
			}
		}
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
		io.emit('settimer');
		setTimeout(function() {
			io.emit('disablebuttons');
			var scoreList = ""; //Make the list of players and their scores
			for (var i = 0; i < clients.length; i++) {
				scoreList = scoreList + clients[i].name + " Score: " + clients[i].rating + "<br/>";
			}
			console.log(scoreList);
			var rightAnswer = q1[3];
			io.emit('returnscores', scoreList, rightAnswer);
		}, 10000);
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
		io.emit('settimer');
		setTimeout(function() {
			io.emit('disablebuttons');
			var scoreList = ""; //Make the list of players and their scores
			for (var i = 0; i < clients.length; i++) {
				scoreList = scoreList + clients[i].name + " Score: " + clients[i].rating + "<br/>";
			}
			console.log(scoreList);
			var rightAnswer = q2[1];
			io.emit('returnscores', scoreList, rightAnswer);
		}, 10000);
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
		io.emit('settimer');
		setTimeout(function() {
			io.emit('disablebuttons');
			var scoreList = ""; //Make the list of players and their scores
			for (var i = 0; i < clients.length; i++) {
				scoreList = scoreList + clients[i].name + " Score: " + clients[i].rating + "<br/>";
			}
			console.log(scoreList);
			io.emit('returnscores', scoreList);
		}, 10000);
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



//If name === Schmelfbury then show a div with a button to reset the clock








	
