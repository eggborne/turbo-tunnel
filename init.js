
userDevice = new MobileDetect(window.navigator.userAgent)
isMobile = userDevice.mobile()
PIXI.utils.skipHello()
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RESOLUTION = window.devicePixelRatio
renderer = PIXI.autoDetectRenderer({ 
	width:window.innerWidth,
	height:window.innerHeight,
	autoResize: true,
	powerPreference: 'high-performance',
	roundPixels: true,
	backgroundColor:'#0000ff'
});
var music = new Howl({
	src: ['sounds/turbotlow.ogg'],
	loop: true
})
var impactSound = new Howl({
  src: ['sounds/impact.wav']
})
var whooshSound = new Howl({
  src: ['sounds/whoosh.wav']
})
renderer.plugins.interaction.interactionFrequency = 1;
document.body.appendChild(renderer.view);


imagesLoaded = 0
currentPlayers = 0
connectedToDB = true
gameName = 'frogracer'

scoreArray = []
// getScoresFromDatabase(gameName)

var loc = window.location.pathname;
var dir = loc.substring(1, loc.lastIndexOf('/'));

viewWidth = window.innerWidth;
viewHeight = window.innerHeight;
calledScoreMenu = -99
currentNameEntered = ""
if (window.innerWidth > window.innerHeight) {
	landscape = true
} else {
	landscape = false
}
$(document).keypress(
    function(event){
     if (event.which == '13') {
        event.preventDefault();
		if ($('#nameentry').css('display') !== 'none') {
			$('#namesubmitbutton').trigger('click')
		}
   	 }


});
var rankNames = [
	"1st",
	"2nd",
	"3rd",
	"4th",
	"5th",
	"6th",
	"7th",
	"8th",
	"9th",
	"10th"
]
var scoresDisplayed = 10
$('#nameentry').html('<input length="9" maxlength="9" id="nameinput" type="text" autocomplete="off" placeholder="Enter name" name="playername"  /><button id="namesubmitbutton" class="button" type="button" >SUBMIT</button>')
	
$('#namesubmitbutton').on('click',function() {
	currentNameEntered = $('#nameinput').val()
	if (currentNameEntered) {
		saveScoreToDatabase(gameName,currentNameEntered,playerFootScore)
		$('#nameentry').fadeOut()
	}
});

playerFootScore = 0
HWRatio = viewHeight/viewWidth
hasTouch = 'ontouchstart' in document.documentElement;
screenVertical = false
viewHeight = window.innerHeight
viewWidth = window.innerWidth
if (window.innerWidth < window.innerHeight) {
	screenVertical = true
	viewWidth = window.innerWidth
	viewHeight = viewWidth/(300/220) 	
	// cellSize = window.innerWidth/50
	var shorterDimension = "width"
	var longerDimension = "height"
} else {
	var shorterDimension = "height"
	var longerDimension = "width"
}
cellSize = window.innerWidth/50


pixelHeight = 196
pixelSize = Math.floor(viewHeight/196)
gameHeight = pixelSize*pixelHeight
fingerOnScreen = false;
soundOn = true
fullscreen = false
controlPanel = undefined
joystick = undefined
touchingAt = undefined
lastLiftedDirection = undefined
stoppedPressing = -99
touchedAt = -99
pressedQAt = pressedEAt = pressedShiftAt = -99
LMBDown = RMBDown = pressingUp = pressingSpace = pressingShift = pressingDown = pressingLeft = pressingRight = pressingQ = pressingE = false
pressingDirections = []
cursor = {x:0,y:0}
resetMessages1 = ["SHIT","FUCK","BALLS","MOTHERFUCKER","SON OF A BITCH","GODDAMMIT","JESUS H. CHRIST"]
resetMessages2 = ["I AM UNTETHERED AND MY\rRAGE KNOWS NO BOUNDS","FUCK THIS GODDAMNED SHIT\rSTRAIGHT TO HELL","BULL FUCKING SHIT","COCKSUCKER","FUCKIN' BULLSHIT"]
currentGapSize = 0
touches = []
bestDistance = 0
gameInitiated = false
playerInitiatedAt = -99
takeoffDelay = 10
playerResetAt = -99

debugMode = false
counter = 0

specialInterval = viewWidth*(36+randomInt(-10,10))
specialLength = viewWidth*(12+randomInt(-6,10))
specialObstacles = ["rat","mine"]
currentSpecial = specialObstacles[randomInt(0,specialObstacles.length-1)]

gapLikelihood = 3

scoresToDisplay = 30

function setVariables() {
	enemies = []
	gameStarted = -99
	// gameInitiated = false
	pressedSpaceAt = -99
	rightClickedAt = clickedAt = -99
	gravityPower = 180
	gapDropped = 0
	changingSpeedDuration = 0
	speedAdjustment = 0
	counter = 0
	titleCounter = 0
	padding = 10
	scrollSpeed = 0
	pillarsPending = 0
	totalDistance = 0
	playerFootScore = 0
	gapPlanned = false
	sendingMines = false
	sendingRats = false
	minesSent = 0
	alienHeadsAttacking = 0
	lastMine = 0
	lastGap = 0
	nextSpecial = specialInterval/2
}

function resetGame() {
	resets++
	for (var p=0;p<pillars.length;p++) {
		stage.removeChild(pillars[p].sprite)
		if (pillars[p].shadow) {
			stage.removeChild(pillars[p].shadow)
		}
		pillars.splice(p,1)
		p--
	}
	for (var e=0;e<events.length;e++) {
		events.splice(e,1)
		e--
	}
	if (tyson) {
		tyson.reset()
		tyson.dead = false
	}
	// for (var n=0;n<enemies.length;n++) {
	// 	stage.removeChild(enemies[n].sprite)
	// 	stage.removeChild(enemies[n].shadow)
	// 	enemies.splice(n,1)
	// 	n--
	// }
	for (var m=0;m<mines.length;m++) {
		stage.removeChild(mines[m].sprite)
		stage.removeChild(mines[m].shadow)
		mines.splice(m,1)
		m--
	}
	for (var r=0;r<rocketRats.length;r++) {
		stage.removeChild(rocketRats[r].sprite)
		stage.removeChild(rocketRats[r].shadow)
		if (rocketRats[r].cargo) {
			stage.removeChild(rocketRats[r].cargo)
		}
		rocketRats.splice(r,1)
		r--
	}
	// for (var f=0;f<flameWalls.length;f++) {
	// 	stage.removeChild(flameWalls[f].container)
	// 	flameWalls.splice(f,1)
	// 	f--
	// }
	// alienHead.sprite.visible = false
	// wartdsds.sprite.visible = false
	// wart.activated = false

	// sendingMetroids = false
	
	clearFloor()
	background.floorsToRestore = 0
	setVariables()
	currentEventDuration = 0
	frog.knockedAt = 0
	frog.sprite.tint = 0xffffff
	frog.headBumped = false
	frog.dead = false
	frog.fell = false
	frog.offGround = false
	frog.diedAt = -99
	frog.elevation = 0
	frog.diedAt = -99
	frog.landedAt = 0
	frog.ducking = false
	frog.killedBy = undefined
	frog.corpse.visible = false
	frog.flyingCorpse.visible = false
	frog.hasMetroid = false
	
	frog.sprite.texture = neutralFrogText
	frog.bobbed = 45
	frog.sprite.visible = true
	frog.shadow.visible = true
	
	frog.sprite.x = frog.sprite.width*1.5
	frog.sprite.y = highestFloor
	frog.shadow.scale.x = frog.shadow.origScale
	frog.shadow.x = frog.sprite.x-(frog.sprite.width/2)+(frog.shadow.width/4)
	frog.shadow.y = frog.sprite.y+(frog.sprite.height/2.5)
	stage.setChildIndex(frog.sprite,stage.children.indexOf(titleScreen.container)-1)
	
	if (isMobile) {
		controlPanel.jumpLabel.text = "JUMP"
		controlPanel.duckLabel.text = "DUCK"
		controlPanel.jumpArea.alpha = 1
		controlPanel.duckArea.alpha = 1
		controlPanel.instructions.alpha = 0.5
		// controlPanel.bg.tint = 0x222222
		controlPanel.jumpLabel.tint = controlPanel.duckLabel.tint = 0xaaaaaa
		// controlPanel.container.alpha = 0
		if (landscape) {
			controlPanel.container.alpha = 0.9
			controlPanel.bg.alpha = 1
			// controlPanel.duckArea.alpha = controlPanel.duckLabel.alpha = 1
		}
	} else {
		controlPanel.jumpArea.alpha = 0
		controlPanel.duckArea.alpha = 0
		controlPanel.jumpLabel.alpha = 0
		controlPanel.duckLabel.alpha = 0
		controlPanel.instructions.alpha = 0.9
	}
	getTotalKillsFromDatabase(gameName)
	nextGap.min = 0
	nextGap.max = 0
	
	// maxGapLength = Math.floor(startingSpeed/2)
	
	frog.velocity.x = frog.velocity.y = frog.velocity.z = 0
	gameMessage.reset()
	// background.moveLeft(window.innerWidth)

}
function clearFloor() {
	currentGapSize = 0
	for (var f=0;f<background.floors.length;f++) {
		var floor = background.floors[f]
		if (floor.texture !== midGroundText) {
			floor.texture = midGroundText
		}
	}
	if (bubbles.length) {
		for (var b=0;b<bubbles.length;b++) {
			var bub = bubbles[b]
			bubbles.splice(b,1)
			b--
			stage.removeChild(bub.sprite)
			stage.removeChild(bub.shadow)
			if (bub.explosion) {
				stage.removeChild(bub.explosion)
			}
		}
	}
}

lastCursor = {x:0,y:0}
snes = false

currentMessage = ""
messageDisplayDuration = 60

currentEventDuration = 0
currentMaxDuration = 600



if (window.innerWidth < window.innerHeight) {
	// $('#nameentry').css({
	// 	width: viewWidth*0.8,
	// 	height: viewWidth*0.5,
	// 	top: gameHeight/1.5,
	// 	left: viewWidth*0.1
	// });
	// $('#nameinput').css({
	// 	width: viewWidth*0.7,
	// 	height: viewHeight/8,
	// 	fontSize: viewHeight/14
	// });
	// $('#namesubmitbutton').css({
	// 	width: viewWidth*0.45,
	// 	height: gameHeight/4.5,
	// 	fontSize: gameHeight/14
	// });
}

lastScrollSpeed = undefined
pillars = []
flameWalls = []
gaps = []
splashes = []
impacts = []
powerups = []
bullets = []
bubbles = []
fireballs = []
mines = []
rocketRats = []
controlPanel = undefined

nextGap = {min:100000,max:-100000}
gapBlocking = false

deadSprites = []
sprites = 0

events = []
guestIndex = 0

marks = []
joystickKilledAt = -99
hitJumpAt = -99
hitDuckAt = -99
resets = 0
speedUpIncrement = viewWidth*30
nextSpeedUp = speedUpIncrement

wallFrequency = 60

guests = ["wart","tyson","alienHead","metroids","alienHeads","wart"]
sendingMetroids = false

musicOn = false
soundOn = false

generalFrequency = 55

bossMode = true


playerVehicle = "bike"

function scrollRate() {
	return scrollSpeed/scrollUnit
}

function createBackground() {
	if (background) {
		background.destruct()
	}
	background = new Background()
	for (var b=0;b<background.brainsPerWidth;b++) {
		
		background.createMiddle(background.midBrains.length*background.midBrainWidth)
		background.createMiddleRear(background.middleRearEggs.length*background.midBrainWidth)
		background.createForeground(background.frontEggs.length*background.midBrainWidth)
		background.createTop(background.topBrains.length*background.topBrainWidth)
	}
	for (var f=0;f<background.floorsPerWidth;f++) {
		background.createMidGround(background.floors.length*background.floorWidth)
		background.createRear(background.rearEggs.length*background.floorWidth)
	}
}

stage = new PIXI.Container();
tysonSheet = PIXI.Texture.fromImage("assets/tysonsheet.png");
function init() {
	// console.log(userDevice)
	// renderer.view.width = window.innerWidth*window.devicePixelRatio
	// renderer.view.height = window.innerHeight*window.devicePixelRatio
	pillarTexts = [highWidePillarText,shortWidePillarText,pillarText,shortPillarText]
	background = undefined
	createBackground()
	
	setInputs()
	setStyles()

	PIXI.utils.correctBlendMode()
	setVariables()
	debug = new PIXI.Text("",debugStyle)
	debug.x = Math.round(viewWidth/100)
	debug.y = Math.round(viewWidth/200)
	info = new PIXI.Text("cock",debugStyle)
	info.x = Math.round(viewWidth*0.8)
	info.y = Math.round(gameHeight/10)
	// stage.addChild(debug)
	// stage.addChild(info)
	titleScreen = new TitleScreen()
	// if (performance.navigation.type == 1) {
	// 	console.log( "PAGE WAS RELOADED!still adding user!" );
	// 	addCurrentUser(gameName)
	// } else {
	// 	console.log( "This page is not reloaded! adding user!");
	// 	addCurrentUser(gameName)

	// }
	
	if (isMobile || landscape) {
		controlPanel = new ControlPanel()
		console.log("creating control pabel")
	}
	frog = new Frog("bike")
	gameMessage = new GameMessage()
	exclamationMark = new ExclamationMark()
	transitionScreen = new TransitionScreen()
	scrollUnit = Math.round(background.topBrainHeight/15)
	maxSpeed = scrollUnit*20
	startingSpeed = scrollUnit*3.5
	rampUpSpeed = 160
	scrollSpeed = 0
	rampBoost = 1.3
	maxGapLength = 6

	tyson = new Tyson
	
	if (stage.children.indexOf(titleScreen.container) !== stage.children.length-1) {
		stage.setChildIndex(titleScreen.container,stage.children.length-1)
	}
	highScoreScreen = new HighScoreDisplay()
	console.log(gameName)
	getTotalKillsFromDatabase(gameName)
	getScoresFromDatabase(gameName,true)
	PIXI.ticker.shared.add(function(time) {
		renderer.render(stage);
		update();
	});
    // requestAnimationFrame(update);
};