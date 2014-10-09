
    var socket = io();
    
    var rankingp = document.getElementById('rankingp');
    var buttons = document.getElementsByClassName("answer");
    var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    //Emit a submitted answer on the buttons
    function submitAnswer(answer) {
      //time testing
      var submitTime = new Date();
      var submitTimeInMillis = submitTime.getTime();
      console.log(submitTimeInMillis + ' - Time Answer Selected: ');

      socket.emit('submission', document.getElementById(answer).value, submitTimeInMillis);
      //Selected Answer Styling
      document.getElementById(answer).style.color = "lime";
      document.getElementById(answer).style.borderColor = "#744bf9";
      document.getElementById(answer).style.borderBottom = "lime 1px solid";
      for (var i = 0; i < 4; i++) {
        buttons[i].disabled=true;
        if (buttons[i].style.color != "lime") {
          buttons[i].style.color = "gray";
          buttons[i].style.background = "#4f4e4e"; //Gray
          buttons[i].style.borderColor = "#4f4e4e";
        }
      }
    };

    socket.on('adminRegistered', function() {
      document.getElementById('hiddenbutton').style.display = "block";
    });

    //Emit a new name for the Name submit button 



      socket.on('change_header', function(data) {
          //document.getElementById('header').innerHTML = data.header;
          document.getElementById('A').value = data.answerA;
          document.getElementById('B').value = data.answerB;
          document.getElementById('C').value = data.answerC;
          document.getElementById('D').value = data.answerD;
          document.getElementById('thequestionnumber').innerHTML = data.qNum;
          startTyping(data.header, 20, 'header');
          if (!isSafari) {
            document.getElementById('load').play();
          }

          //Reload Timer Bar
          
          document.getElementById('bar1').className = "notransition";
          document.getElementById('bar2').className = "notransition";
          document.getElementById('bar3').className = "notransition";
          document.getElementById('bar4').className = "notransition";
          document.getElementById('bar5').className = "notransition";
          document.getElementById('bar6').className = "notransition";
          document.getElementById('bar7').className = "notransition";
          document.getElementById('bar8').className = "notransition";
          

          document.getElementById('bar1').style.width = "55px";
          document.getElementById('bar2').style.width = "55px";
          document.getElementById('bar3').style.width = "55px";
          document.getElementById('bar4').style.width = "55px";
          document.getElementById('bar5').style.width = "55px";
          document.getElementById('bar6').style.width = "55px";
          document.getElementById('bar7').style.width = "55px";
          document.getElementById('bar8').style.width = "55px";

          //Remove any bonus boxes
          document.getElementById('bonusa').style.visibility = "hidden";
          document.getElementById('bonusb').style.visibility = "hidden";
          document.getElementById('bonusc').style.visibility = "hidden";
          document.getElementById('bonusd').style.visibility = "hidden";
      });


    function setQ(q, id) {
      socket.emit(q);
      document.getElementById(id).disabled=true;
      //AutoPlay "Ranks" button
      setTimeout(function() {
        triggerEvent();
      }, 12000);
    }

    socket.on('disablebuttons', function(rightAnswer) {
      setTimeout(function() {
        var buttonsUnselected = 0;
        for (var i = 0; i < 4; i++) {
          buttons[i].disabled=true;
          if (buttons[i].style.color != "lime") {
            buttons[i].style.color = "gray";
            buttons[i].style.background = "#4f4e4e"; //Gray
            buttons[i].style.borderColor = "#4f4e4e";
          }
          if (buttons[i].style.color != "lime") {
            buttonsUnselected++;
          }
        }
        if (buttonsUnselected === 4) {
          document.getElementById('messageplaceholder').innerHTML = "Answer not placed in time";
          if (!isSafari) {
            document.getElementById('notintime').play();
          }
          socket.emit('resetstreak');
          socket.emit('noanswer');
        }
        // Return scores now
        setTimeout(function() {
          socket.emit('requestscores', rightAnswer);
          //Buttons Style for Returned Correct Answer
          for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].value === rightAnswer) {
              buttons[i].style.background = "#00ff00"; //Bright green
              buttons[i].style.borderColor = "#00ff00";
              buttons[i].style.color = "black";
            }
          }
          //Turn user-selected color to something else
          for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].style.color === "lime") {
              buttons[i].style.color = "white";
              buttons[i].style.borderBottom = "red 1px solid";
            }
          }
          triggerPieChart();
          if (document.getElementById('thequestionnumber').innerHTML.substring(0,3) == "30") {
            setTimeout(function() {
              if (!isSafari) {
                document.getElementById('applause').play();
              }
            }, 3000);
          }
        }, 3000);
      }, 9000);
    });

    socket.on('returnscores', function(rightAnswer, myScore, myStreak, tempRank, myHighStreak, myAvgAnswerTime, myBonus) {
      document.getElementById('correctanswerp').innerHTML = document.getElementById('messageplaceholder').innerHTML;
      if (document.getElementById('correctanswerp').innerHTML.charAt(0) === "C") {
        document.getElementById('correctanswerp').style.color = "lime";
        if (!isSafari) {
          document.getElementById('right').play();
        }
      } else {
        document.getElementById('correctanswerp').style.color = "red";
        if (!isSafari) {
          document.getElementById('wrong').play();
        }
      };
      document.getElementById('myscore').innerHTML = myScore;
      document.getElementById('mystreak').innerHTML = myStreak;
      document.getElementById('myrank').innerHTML = tempRank;
      document.getElementById('mytopstreak').innerHTML = myHighStreak;
      document.getElementById('myavganswertime').innerHTML = myAvgAnswerTime;

      //Find correct answer button by color and add bonus
      if (myBonus === true) {
        for (var i = 0; i < buttons.length; i++) {
          if (buttons[i].style.color === "black") { //Only works with style.color
            buttons[i].parentNode.childNodes[3].style.visibility = "visible";
          }
        }
      }
    });

    socket.on('transferresultmessage', function(resultMessage) {
        document.getElementById('messageplaceholder').innerHTML = resultMessage;
    });

    socket.on('settimer', function() {
      document.getElementById('correctanswerp').innerHTML = "";
      for (var i = 0; i < 4; i++) {
        buttons[i].style.color = "white";
        buttons[i].style.background = "#744bf9";
        buttons[i].style.borderColor = "white";
        buttons[i].disabled=false;
      }

      //timer testing
      var currentTime = new Date();
      var timeInMillis = currentTime.getTime();
      console.log(timeInMillis + ' - Time of question presented');      
      //var timePlus5Seconds = timeInMillis + 50000;
      //console.log('Time plus 5 seconds' + timePlus5Seconds);
      socket.emit('questionpresenttime', timeInMillis);


      var count = 9;
      //var counter = setInterval(timer, 1000);
      function timer() {
        count = count - 1;
        if (count == -1) {
          clearInterval(counter);
          return;
        }
        document.getElementById('timer').innerHTML = count + " seconds left";
      }

      //New Timer
      document.getElementById('bar1').className = "transition";
      document.getElementById('bar2').className = "transition";
      document.getElementById('bar3').className = "transition";
      document.getElementById('bar4').className = "transition";
      document.getElementById('bar5').className = "transition";
      document.getElementById('bar6').className = "transition";
      document.getElementById('bar7').className = "transition";
      document.getElementById('bar8').className = "transition";

      callFuncs();
    });

  var delay=50;
  var currentChar=1;
  var destination="[none]";
  function type()
  {
    //if (document.all)
    {
      var dest=document.getElementById(destination);
      if (dest)// && dest.innerHTML)
      {
        dest.innerHTML=text.substr(0, currentChar)+"";
        currentChar++;
        if (currentChar>text.length)
        {
          currentChar=1;
          "type()";
        } 
        else
        {
          setTimeout("type()", delay);
        }
      }
    }
  }

  function startTyping(textParam, delayParam, destinationParam)
  {
    text=textParam;
    delay=delayParam;
    currentChar=1;
    destination=destinationParam;
    type();
  }

  function playMusic(){
    if (!isSafari) {
      document.getElementById('myTune').play();
    }
  }

  function preGame(){
    socket.emit('getPreGame');
  }

  function endPreGame(){
    socket.emit('getEndPreGame');
  }

  function triggerEvent(){
    socket.emit('getRanks');
  }

  function triggerChart(){
    socket.emit('getChart');
  }

  function triggerChart2(){
    socket.emit('getChart2');
  }

    function triggerChart3(){
    socket.emit('getChart3');
  }

  function triggerPieChart() {
    socket.emit('getPieChart');
  }

  function triggerVideo() {
    socket.emit('getVideo');
  }

  function triggerHideVideo() {
    socket.emit('hideVideo');
  }

  function triggerfinalVideo() {
    socket.emit('finalVideo');
  }

  socket.on('ranksready', function(winnerList2) {
    socket.emit('requestrank', winnerList2);
  });

  socket.on('publishrank', function(myRank, nodeList, winnerList2, usersplaying, leaderList, scoreList){
    document.getElementById('myrank').innerHTML = myRank;
    document.getElementById('usersplaying').innerHTML = usersplaying;
    rankingp.innerHTML = nodeList || ""; //Needed for IE otherwise it says "null"
    //document.getElementById('oldtable').innerHTML = scoreList || ""; //Needed for IE otherwise it says "null"
    document.getElementById('leaders').innerHTML = leaderList || ""; //Needed for IE otherwise it says "null"

    // End Game Stuff
    if (document.getElementById('thequestionnumber').innerHTML.substring(0,3) == "30") {
      setTimeout(function() {
        document.getElementById('correctanswerp').innerHTML = winnerList2;
      }, 3200);
    }
  });

  socket.on('questionchart', function(group1, group2, group3, group4, group5) {
    $(function () { 
        $('#container').highcharts({
            credits: {
              enabled: false
            },
            chart: {
                backgroundColor: '#333333',
                type: 'column',
            },
            title: {
                text: ''
            },
            xAxis: {
                title: {
                  text: 'Correct Answers',
                  style: {
                    color: 'white'
                  }
                },
                categories: ['0-1', '2-3', '4-5', '6-7', '8-10'],
                labels: {
                  style: {
                    color: 'white',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                  }
                },
            },
            yAxis: {
                labels: {
                  style: {
                    color: 'white',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                  }
                },
                title: {
                  style: {
                    color: 'white'
                  },
                  text: 'Players',
                }
            },
            series: [{
                name: "All Players",
                data: [group1, group2, group3, group4, group5],
                showInLegend: false,
            }],
            colors: ['#7640ff'],
        });
    });
  });

  socket.on('questionchart2', function(group1, group2, group3, group4, group5) {
    $(function () { 
        $('#container').highcharts({
            credits: {
              enabled: false
            },
            chart: {
                backgroundColor: '#333333',
                type: 'column',
            },
            title: {
                text: ''
            },
            xAxis: {
                title: {
                  text: 'Correct Answers',
                  style: {
                    color: 'white'
                  }
                },
                categories: ['0-4', '5-8', '9-12', '13-16', '17-20'],
                labels: {
                  style: {
                    color: 'white',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                  }
                },
            },
            yAxis: {
                labels: {
                  style: {
                    color: 'white',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                  }
                },
                title: {
                  style: {
                    color: 'white'
                  },
                  text: 'Players',
                }
            },
            series: [{
                name: "All Players",
                data: [group1, group2, group3, group4, group5],
                showInLegend: false,
            }],
            colors: ['#7640ff'],
        });
    });
  });

  socket.on('questionchart3', function(group1, group2, group3, group4, group5) {
    $(function () { 
        $('#container').highcharts({
            credits: {
              enabled: false
            },
            chart: {
                backgroundColor: '#333333',
                type: 'column',
            },
            title: {
                text: ''
            },
            xAxis: {
                title: {
                  text: 'Correct Answers',
                  style: {
                    color: 'white'
                  }
                },
                categories: ['0-6', '7-12', '13-18', '19-24', '25-30'],
                labels: {
                  style: {
                    color: 'white',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                  }
                },
            },
            yAxis: {
                labels: {
                  style: {
                    color: 'white',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                  }
                },
                title: {
                  style: {
                    color: 'white'
                  },
                  text: 'Players',
                }
            },
            series: [{
                name: "All Players",
                data: [group1, group2, group3, group4, group5],
                showInLegend: false,
            }],
            colors: ['#7640ff'],
        });
    });
  });

  socket.on('piechart', function(myRightAnswers, myWrongAnswers) {
    $(function () {
        $('#container2').highcharts({
            credits: {
              enabled: false
            },
            chart: {
                backgroundColor: '#333333',
                plotBorderWidth: 0,//null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            tooltip: { enabled: false},
            plotOptions: {
                pie: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.percentage:.1f} %',
                        style: {
                            color: '#cfcfcf'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '::',
                colors: ['#00ff00', '#7640ff'],
                data: [
                  ['Correct', myRightAnswers],
                  ['Incorrect', myWrongAnswers]
                ]
            }]
        });
    });
  });

    $(function () {
        $('#container3').highcharts({
            credits: {
              enabled: false
            },
            chart: {
                plotBorderWidth: 0,//null,
                plotShadow: false
            },
            title: {
                text: 'Community Accuracy'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '::',
                data: [
                  ['Correct', 50],
                  ['Incorrect', 50]
                ]
            }]
        });
    });

//Show Video
socket.on('showingPreVideo', function() {
  $("#videobg").show(1200);
  $("#container").show(1200);
  $("#questionnumber").hide(1200);
  $("#qicon").hide(1200);
  $("#questiondiv").hide(1200);
  $("#timergraphic").hide(1200);
  $("#buttons").hide(1200);
  $("#correctanswerdiv").hide(1200);
  $("#messageplaceholder").hide(1200);
  document.getElementById('video').style.display = "block";
  document.getElementById('banner').style.visibility = "visible";
  document.getElementById('banner').innerHTML = "Pre-Game";
});

socket.on('gameIsReady', function() {
  $("#videobg").hide();
  $("#container").hide();
  $("#questionnumber").show(1200);
  $("#qicon").show(1200);
  $("#questiondiv").show(1200);
  $("#timergraphic").show(1200);
  $("#buttons").show(1200);
  $("#correctanswerdiv").show(1200);
  $("#messageplaceholder").show(1200);
  document.getElementById('messageplaceholder').style.display = "none";
  document.getElementById('video').style.display = "none";
  document.getElementById('banner').style.visibility = "hidden";
  //Be aware that the sound is still on at this point
});

socket.on('showingVideo', function() {
  $("#videobg").show(1200);
  $("#container").show(1200);
  $("#questionnumber").hide(1200);
  $("#qicon").hide(1200);
  $("#questiondiv").hide(1200);
  $("#timergraphic").hide(1200);
  $("#buttons").hide(1200);
  $("#correctanswerdiv").hide(1200);
  $("#messageplaceholder").hide(1200);
  document.getElementById('video').style.display = "block";
  document.getElementById('banner').style.visibility = "visible";
  document.getElementById('banner').innerHTML = "Intermission";
});

socket.on('hidingVideo', function() {
  $("#videobg").hide();
  $("#container").hide();
  $("#questionnumber").show(1200);
  $("#qicon").show(1200);
  $("#questiondiv").show(1200);
  $("#timergraphic").show(1200);
  $("#buttons").show(1200);
  $("#correctanswerdiv").show(1200);
  $("#messageplaceholder").show(1200);
  document.getElementById('messageplaceholder').style.display = "none";
  document.getElementById('video').style.display = "none";
  document.getElementById('banner').style.visibility = "hidden";
  //Be aware that the sound is still on at this point
});

socket.on('endVideo', function() {
  $("#videobg").show(1200);
  $("#container").show(1200);
  $("#questionnumber").hide(1200);
  $("#qicon").hide(1200);
  $("#questiondiv").hide(1200);
  $("#timergraphic").hide(1200);
  $("#buttons").hide(1200);
  $("#correctanswerdiv").hide(1200);
  $("#messageplaceholder").hide(1200);
  document.getElementById('video').style.display = "block";
  document.getElementById('banner').style.visibility = "visible";
  document.getElementById('banner').innerHTML = "Game Completed!";
});


//Timer Script
  function removeBar8() {
    document.getElementById("bar8").style.width = "0px";
  }

  function removeBar7() {
    document.getElementById("bar7").style.width = "0px";
  }

  function removeBar6() {
    document.getElementById("bar6").style.width = "0px";
  }

  function removeBar5() {
    document.getElementById("bar5").style.width = "0px";
  }

  function removeBar4() {
    document.getElementById("bar4").style.width = "0px";
  }

  function removeBar3() {
    document.getElementById("bar3").style.width = "0px";
  }

  function removeBar2() {
    document.getElementById("bar2").style.width = "0px";
  }

  function removeBar1() {
    document.getElementById("bar1").style.width = "0px";
  }

  var funcs = [removeBar8, removeBar7, removeBar6, removeBar5, removeBar4, removeBar3, removeBar2, removeBar1];

  /*var i = 0;
  function callFuncs() {
    funcs[i++]();
    if (i < funcs.length) {
      setTimeout(callFuncs, 1000);
    } 
  }*/


  function callFuncs() {
    setTimeout(function () {
    setTimeout(function () {
    setTimeout(function () {
    setTimeout(function () {
    setTimeout(function () {
    setTimeout(function () {
    setTimeout(function () {
    setTimeout(function () {
      document.getElementById("bar1").style.width = "0px"}, 1000); 
      document.getElementById("bar2").style.width = "0px"}, 1000);
      document.getElementById("bar3").style.width = "0px"}, 1000); 
      document.getElementById("bar4").style.width = "0px"}, 1000);             
      document.getElementById("bar5").style.width = "0px"}, 1000);
      document.getElementById("bar6").style.width = "0px"}, 1000); 
      document.getElementById("bar7").style.width = "0px"}, 1000);             
      document.getElementById("bar8").style.width = "0px"}, 1000);
  }
