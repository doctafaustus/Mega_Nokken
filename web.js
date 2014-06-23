var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res) {
	res.sendfile('index.html');
});
app.use(express.static(__dirname + '/public'));

//var time = new Date();
//var timeInMillis = time.getTime();
//var timePlus5Seconds = timeInMillis + 50000;
//console.log(timeInMillis);

var clients = [];
var list = "";
var scoreList;

//Needed for Heroku to have client's connection working properly
io.onopen = function()  { 
      console.log('websocket opened');
      setInterval(function() {
        if (ws.bufferedAmount == 0)
          ws.send("Keep alive from client"  );
        }, 5000 );
};

                    
io.on('connection', function(socket) {
	clients.push(socket.id = new MakeObj(socket.id));
	console.log(socket.id.name + ' connected');
	listClients(clients);

	socket.on('newname', function(nameboard) {
		socket.id.name = nameboard;
		if (socket.id.name === "a") {
			var adminPosition = clients.indexOf(socket.id);
			if (adminPosition > -1) {
				clients.splice(adminPosition, 1);
				listClients(clients);
				console.log("wacky weasel"); //Just to see if it works
			}
		}
		console.log("New name is " + socket.id.name);
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
				socket.id.rating += 100;
				console.log("RATING FOR " + socket.id.name + " is:   " + socket.id.rating)
				var result = "CORRECT";
				var score = socket.id.rating;
				var resultMessage = "Correct! +100 pts.";
				socket.emit('transferresultmessage', resultMessage);
				socket.id.streak++;
				socket.id.streakReset = false;
				if (socket.id.streakReset !== true && socket.id.streak > socket.id.highStreak) {
					socket.id.highStreak++;
					console.log('High streak for ' + socket.id.name + ' is: ' + socket.id.highStreak);
				}
			} else {
				console.log("FALSE");
				var result = "FALSE";
				var score = socket.id.rating;
				var resultMessage = "Incorrect (" + correctAnswer + ")";
				socket.emit('transferresultmessage', resultMessage);
				socket.id.streak = 0;
			}
		}
	});
	
	socket.on('resetstreak', function() {
		socket.id.streak = 0;
		socket.id.streakReset = true;
	});



	socket.on('requestscores', function(rightAnswer) {
		var myScore = socket.id.rating;
		var myStreak = socket.id.streak;
		var myHighStreak = socket.id.highStreak;
		var tempRank = "..."
		socket.emit('returnscores', rightAnswer, myScore, myStreak, tempRank, myHighStreak);
	});

	socket.on('setq1', function() {
		header = q1[0];
		questionNumber = 'question1';
		io.emit('change_header', {
			header: header,
			qNum: 1,
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
			qNum: 2,
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
			qNum: 3,		    
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
			qNum: 4,
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
			qNum: 5,
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
			qNum: 6,
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
			qNum: 7,
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
			qNum: 8,
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
			qNum: 9,
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
			qNum: 10,
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
			qNum: 11,
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
			qNum: 12,
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
			qNum: 13,
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
			qNum: 14,
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
			qNum: 15,
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
	this.streak = 0;
	this.highStreak = 0;
	this.streakReset = false;
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
        qNum: 0,
        answerA: answerA1,
        answerB: answerB1,
        answerC: answerC1,
        answerD: answerD1
    });
    socket.on('getRanks', function(socket) {
		//Rank code
    	var sorted = [];
    	for (var u = 0; u < clients.length; u++) {
    		clients[u].rank = 0;
    		clients[u].tie = false;
    		console.log("rank cleared to: " + clients[u].rank + " And rating is " + clients[u].rating);
    	}
		for (var i = 0; i < clients.length; i++) {
			sorted.push(clients[i]);
		}
		sorted.sort(function(a, b) {
			return b.rating-a.rating;
		});
		for(var i = 0; i < sorted.length; i++) {
			// original ranking
			sorted[i].rank = i + 1;   
		}
		function sortRanking() {
			for (var k = 0; k < sorted.length; k++) {
				for (var h = 1; h < sorted.length + 1; h++) {
					if (sorted[k+h] !== undefined) {
					    if (sorted[k+h].tie !== true) {
					        if (sorted[k].rating === sorted[h + k].rating) {
					            sorted[k].rank = k + 1;
					            sorted[h + k].rank = k + 1;
					            sorted[k].tie = true;
					            sorted[h + k].tie = true;
					        }
					    }
					}    
				}
			}
		}
		sortRanking();
		for (var r = 0; r < clients.length; r++){
			console.log("Rank for " + clients[r].name + " is: " + clients[r].rank);
		}
		//End of Rank code
		scoreList = ""; //Make the list of players and their scores 
		var newSorted = [];
		for (var i = 0; i < clients.length; i++) {
			newSorted.push(clients[i]);
		}
		newSorted.sort(function(a, b) {
			return b.rating-a.rating;
		});
		var tableheading = '<table>' +
   							'<tr>' +
						      '<th class="place">Place</th>' +
						      '<th class="player">Player</th>' +
						      '<th class="score">Score</th>' +
						      '<th class="hstreak">High Streak</th>' +
						   '</tr>';
		for (var i = 0; i < newSorted.length; i++) { 
		  scoreList = scoreList + "<tr>" + "<td>" + newSorted[i].rank + "</td>" + "<td align='left'>" + newSorted[i].name + "</td>" + "<td>" + newSorted[i].rating + "</td>" + "<td>" + newSorted[i].highStreak + "</td>" + "<tr/>"; 
		} 
		scoreList = tableheading + scoreList + "</table>";
		console.log(scoreList); 

		var winners = [];
		for (var i = 0; i < clients.length; i++) {
			if (clients[i].rank === 1) {
				winners.push(clients[i]);
			}
		}
		console.log('Num winners: ' + winners.length);
		winnerList = "";
		for (var j = 0; j < winners.length; j++) {
			winnerList = winnerList + winners[j].name + " ";
		}
		var winnerList2 = "Congratulations, " + winnerList;
		console.log(winnerList2);
		io.emit('ranksready', winnerList2);
	});
	socket.on('requestrank', function(winnerList2){
		var myRank = socket.id.rank;
		socket.emit('publishrank', myRank, scoreList, winnerList2);
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



//Before Ranks are published, you could add '[Processing]' to the Rank div




	
