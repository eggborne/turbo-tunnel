function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function pointAtAngle(x, y, angle, distance) {
  return {
    x: x + distance * Math.cos(angle),
    y: y + distance * Math.sin(angle)
  };
}
function angleOfPointABFromXY(a, b, x, y) {
  return Math.atan2(b - y, a - x);
}
function distanceFromABToXY(a, b, x, y) {
  var distanceX = x - a;
  var distanceY = y - b;
  return Math.round(Math.sqrt(distanceX * distanceX + distanceY * distanceY));
}
degToRad = function(radians) {
  return radians * (Math.PI / 180);
};
radToDeg = function(radians) {
  deg = radians * (180 / Math.PI);
  if (deg < 0) {
    deg += 360;
  } else if (deg > 359) {
    deg -= 360;
  }
  return radians * (180 / Math.PI);
};
function fullscreen() {
  // fullscreen = true
  var el = document.body;
  if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else {
    el.mozRequestFullScreen();
  }
}
function exitFullscreen() {
  // fullscreen = false
  if (document.exitFullScreen) {
    document.exitFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
function playSound(sound) {
  if (soundOn) {
    sound.play();
  }
}
function scoreInFeet(score) {
  return Math.round(score / (frog.sprite.height / 3));
}
function getTotalKillsFromDatabase(gameName) {
  axios({
    method: "get",
    url: `https://api.eggborne.com/${gameName}/getdeadfrogs.php`,
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    },
    params: {
      game: gameName
    }
  }).then(response => {
		console.warn('resp! -------------------------------', response)
		if (response.data) {
			titleScreen.killCount.text = "total frogs killed: " + response.data;			
		}
	});
}

function sendDeadFrogToDatabase(gameName) {
  axios({
    method: "post",
    url: `https://api.eggborne.com/${gameName}/senddeadfrog.php`,
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
  })
}

function getScoresFromDatabase(gameName, populate, display) {
  axios({
    method: "get",
    url: `https://api.eggborne.com/${gameName}/gethighscores.php`,
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    },
    params: {
      game: gameName
    }
  }).then(response => {
    if (response.data) {
      scoreArray.length = 0;
      pairArray = response.data.split(" - ");
      for (item in pairArray) {
        var scoreEntry = pairArray[item].split(" ");
        var literalName = scoreEntry[0];
        if (scoreEntry.length > 2) {
          var fixedEntry = [];
          fixedEntry[1] = scoreEntry.pop();
          fixedEntry[0] = scoreEntry.join(" ");
          scoreArray.push(fixedEntry);
        } else if (scoreEntry.length === 2) {
          scoreArray.push(scoreEntry);
        }
      }
      if (!populate) {
        console.log("!populate");
        return scoreArray;
      } else {
        console.log("calling updateScoreboard");
        updateScoreboard();
        if (display) {
					highScoreScreen.container.visible = true;
					gameMessage.activated = false;
        }
      }
    } else {
      console.log("Could not connect to get!");
      scoreArray = [["void", 1212]];
    }
  });
}
function saveScoreToDatabase(gameName, playerName, playerScore) {
  axios({
    method: "post",
    url: `https://api.eggborne.com/${gameName}/savehighscores.php`,
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    },
    data: {
      game: gameName,
      name: playerName,
      score: playerScore,
    }
  }).then(response => {
    if (response.data) {
      getScoresFromDatabase(gameName, true, true);
    } else {
      console.error("Could not connect to post score!");
    }
  });
}
