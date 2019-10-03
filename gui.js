function TitleScreen() {
	this.container = new PIXI.Container()
	this.starField = new PIXI.ParticleContainer()
	this.logos = new PIXI.Container()
	this.bg = new PIXI.Sprite(pixelText)
	this.bg.width = window.innerWidth
	this.bg.height = window.innerHeight
	this.bg.tint = 0x000000
	this.cover = new PIXI.Sprite(pixelText)
	this.cover.width = viewWidth
	this.cover.height = window.innerHeight
	this.cover.tint = 0x000000
	if (!screenVertical) {
		this.titleStyle = horizTitleStyle
	} else {
		this.titleStyle = vertTitleStyle
	}
	this.title1 = new PIXI.Text("FROG",this.titleStyle)
	this.title2 = new PIXI.Text("RACER",this.titleStyle)
	this.title3 = new PIXI.Text("2019",this.titleStyle)

	this.gamepadMessage = new PIXI.Text("GAMEPAD DETECTED", this.titleStyle);
	this.gamepadMessage.visible = false;
	this.gamepadMessage.anchor.set(0.5);
	this.gamepadMessage.style.fontSize = pixelSize * 4;
	this.gamepadMessage.style.fill = '#224422';
	this.gamepadMessage.style.stroke = 0;
	this.gamepadMessage.x = viewWidth / 2;

	this.title1.anchor.set(0.5)
	this.title2.anchor.set(0.5)
	this.title3.anchor.set(0.5)
	if (screenVertical) {
		this.title1.y = Math.round(((viewWidth-this.title2.width)/1.7))
		this.title2.y = Math.round(this.title1.y+(this.title2.height*1.3))
		this.title3.y = Math.round(this.title2.y+(this.title2.height*1.3))
		soundButtonSize = pixelSize*20
	} else {
		this.title1.y = this.title1.height*0.7
		this.title2.y = Math.round(this.title1.height*1.8)
		this.title3.y = Math.round(this.title1.height*2.9)
		soundButtonSize = pixelSize*15
	}
	this.title3.y -= this.title3.height*0.1
	this.title3.scale.x *= 0.7
	this.title3.scale.y *= 0.7
	
	this.startButton = new PIXI.Sprite(startButtonText)
	this.startButton.anchor.set(0.5)
	if (screenVertical) {
		this.startButton.width = pixelSize*180
	} else {
		this.startButton.width = window.innerWidth/4
	}
	this.startButton.height = this.startButton.width*(137/366)
	this.startButton.x = Math.round(viewWidth/2)
	this.startButton.y = window.innerHeight-(this.startButton.height*0.75)
	

	this.musicButton = new PIXI.Sprite(musicOffText)
	this.musicButton.anchor.set(0.5)
	this.soundButton = new PIXI.Sprite(soundOffText)
	this.soundButton.anchor.set(0.5)

	this.musicButton.width = this.musicButton.height = this.soundButton.width = this.soundButton.height = soundButtonSize
	this.musicButton.x = (viewWidth/2)-(this.musicButton.width*1.35)
	this.soundButton.x = (viewWidth/2)+(this.musicButton.width*1.35)
	
	this.musicButton.interactive = this.soundButton.interactive = true
	this.musicButton.on('pointerdown',function(){
		if (musicOn) {
			this.texture = musicOffText
			musicOn = false
		} else {
			this.texture = musicOnText
			musicOn = true
		}
	})
	this.soundButton.on('pointerdown',function(){
		if (soundOn) {
			this.texture = soundOffText
			soundOn = false
		} else {
			this.texture = soundOnText
			soundOn = true
		}
	})

	this.speedToggle = undefined

	this.container.addChild(this.bg)
	this.container.addChild(this.starField)
	this.container.addChild(this.logos)
	this.container.addChild(this.title1)
	this.container.addChild(this.title2)
	this.container.addChild(this.title3)
	this.container.addChild(this.gamepadMessage)
	// if (!screenVertical) {
	// 	var toggleStyle = horizMenuStyle
	// } else {
	// 	var toggleStyle = vertMenuStyle
	// }
	this.highScoreButton = preparedSprite(highScoreButtonText)
	if (screenVertical) {
		var menuSpace = (this.startButton.y-(this.startButton.height/2))-gameHeight
	} else {
		this.highScoreButton.scale.x /= 2
		this.highScoreButton.scale.y /= 2
		var menuSpace = (this.startButton.y)-(this.title3.y)
	}
	
	this.highScoreButton.x = viewWidth/2
	this.highScoreButton.y = this.startButton.y-(this.startButton.height)
	if (this.startButton.y-this.highScoreButton.y > this.startButton.height*1.4) {
		this.highScoreButton.y = this.startButton.y-(this.startButton.height*1.4)
	}
	this.musicButton.y = this.soundButton.y = this.highScoreButton.y-this.highScoreButton.height;
	this.gamepadMessage.y = this.musicButton.y - this.highScoreButton.height;
	// this.musicButton.y = this.soundButton.y = this.startButton.y-(pixelSize*64)
	this.highScoreButton.anchor.set(0.5)
	this.highScoreButton.interactive = true
	
	this.container.addChild(this.highScoreButton)
	
	this.highScoreButton.on("pointerdown",function(){
		if (!highScoreScreen.container.visible) {
			updateScoreboard()
			highScoreScreen.container.visible = true
			
			calledScoreMenu = counter
			
		}
	})
	for (var i=0;i<3;i++) {
		var insig = new PIXI.Sprite(redInsigniaText)
		
		insig.anchor.set(0.5)
		if (screenVertical) {
			insig.width = insig.height = viewWidth/3.5
			var offsetX = (viewWidth/3.5)
			var insigSpotY = this.title2.y+(pixelSize*15)
		} else {
			insig.width = insig.height = viewHeight/4
			var offsetX = (viewHeight/4)
			var insigSpotY = this.title2.y+(pixelSize*12)
		}
		insig.origScale = {x:insig.scale.x,y:insig.scale.y}
		if (i===0) {
			insig.x = viewWidth/2
			insig.y = insigSpotY
		} else if (i===1) {
			insig.x = (viewWidth/2)-offsetX
			insig.y = insigSpotY-(offsetX/2)
		} else if (i===2) {
			insig.x = (viewWidth/2)+offsetX
			insig.y = insigSpotY-(offsetX/2)
		}
		insig.alpha = 0.5
		this.logos.addChild(insig)
	}
	this.container.addChild(this.startButton)
	this.container.addChild(this.musicButton)
	this.container.addChild(this.soundButton)
	this.container.addChild(this.cover)
	stage.addChild(this.container)
	this.startButton.interactive = true
	this.startButton.owner = this
	this.killCount = new PIXI.Text("",highScoreStyle)
	this.killCount.anchor.set(0.5)
	this.killCount.x = viewWidth/2
	this.killCount.y = window.innerHeight-(this.killCount.height/2)
	this.killCount.tint = 0x99aa99
	this.container.addChild(this.killCount)
	this.currentCount = new PIXI.Text("",highScoreStyle)
	this.currentCount.anchor.set(0.5)
	this.currentCount.x = viewWidth/2
	this.currentCount.y = this.currentCount.height/2
	this.currentCount.tint = 0x99cc99
	// this.container.addChild(this.currentCount)

	for (var s=0;s<200;s++) {
		var star = new PIXI.Sprite(pixelText)
		star.width = star.height = pixelSize
		star.anchor.set(0.5)
		star.x = randomInt(pixelSize,viewWidth-pixelSize)
		star.y = randomInt(pixelSize,window.innerHeight-pixelSize)
		star.alpha = randomInt(2,10)/10
		star.speed = (star.alpha*star.alpha*pixelSize)*4
		this.starField.addChild(star)
	}

	this.debugButton = new PIXI.Text("[ DEBUG ]",messageHorizStyle)
	this.debugButton.tint = 0xffff00
	this.debugButton.anchor.set(0.5)
	this.debugButton.x = viewWidth/2
	// this.debugButton.interactive = true
	this.debugButton.owner = this
	if (!screenVertical) {
		this.debugButton.scale.x *= 0.4
		this.debugButton.scale.y *= 0.4
	}
	this.debugButton.y = window.innerHeight-(this.debugButton.height/2)
	// this.debugButton.on('pointerdown',function() {
	// 	debugMode = true
	// 	if (counter-playerResetAt > 30) {
	// 		this.owner.container.visible = false
	// 		playerInitiatedAt = counter
	// 		frogCollision = true
	// 		frogGravity = true
	// 		if (musicOn) {
	// 			music.play()
	// 		}
	// 		changeVehicle(playerVehicle)
    //         stage.addChild(debug)
	//         stage.addChild(info)
    //         frogCollision = false
	// 	    frogGravity = false
	// 	}
		
	// 	// progressBar.actualWidth = viewWidth*16
	// })
	this.resetTitles = function() {
		this.title1.x = -(this.title1.width/2)
		this.title2.x =viewWidth+(this.title2.width/2)
		this.title3.x = -(this.title3.width/2)
		this.titlesLanded = 0
	}
	this.resetTitles()
	this.startButton.on('pointerdown',function() {
		if (counter-playerResetAt > 30) {
			this.owner.container.visible = false
			playerInitiatedAt = counter
			frogCollision = true
			frogGravity = true
			if (musicOn) {
				music.play()
			}
            if (stage.children.indexOf(debug) > -1) {
                stage.removeChild(debug)
                stage.removeChild(info)
            }
		}
	})
	this.placeTitle = function() {
		var inc = pixelSize*24
		if (this.titlesLanded===0) {
			if (this.title1.x+inc < viewWidth/2) {
				this.title1.x += inc
			} else {
				this.title1.x = viewWidth/2
				this.titlesLanded++
			}
		} else if (this.titlesLanded===1) {
			if (this.title2.x-inc > viewWidth/2) {
			this.title2.x -= inc
			} else {
				this.title2.x = viewWidth/2
				this.titlesLanded++
			}
		} else if (this.titlesLanded===2) {
			if (this.title3.x+inc < viewWidth/2) {
				this.title3.x += inc
			} else {
				this.title3.x = viewWidth/2
				this.titlesLanded++
			}
		}
		
			
	}
	this.animateStars = function() {
		for (var s=0;s<this.starField.children.length;s++) {
			var star = this.starField.children[s]
			star.y += star.speed
			if (star.y > window.innerHeight) {
				star.y = 0
				star.alpha = randomInt(2,10)/10
				star.speed = (star.alpha*star.alpha*pixelSize)*6
			}
		}
	}
	// this.animateLogos = function() {
	// 	for (var i=0;i<this.logos.children.length;i++) {
	// 		var logo = this.logos.children[i]
	// 		var newSpot = pointAtAngle(logo.home.x,logo.home.y,logo.skewAngle,logo.radius)
	// 		// logo.x = newSpot.x
	// 		logo.y = newSpot.y
	// 		logo.skewAngle += degToRad(5)
	// 	}
	// 	if (randomInt(0,10)===0) {
	// 		this.logos.children[randomInt(0,this.logos.children.length-1)].radius += (randomInt(-1,1))
	// 	}
	// }
	// this.container.addChild(this.debugButton)
}

function Screenmask(thickness,alpha) {
	this.container = new PIXI.Container()
	for (var p=0;p<viewHeight;p++) {
		var line = new PIXI.Sprite(pixelText)
		if (p % 2 === 0) {
			line.tint = 0x000000
		} else {
			line.visible = false
		}
		line.width = viewWidth
		line.height = 1
		line.y = p*1
		this.container.addChild(line)
	}
	this.container.alpha = 0.2
	stage.addChild(this.container)
}

function TransitionScreen() {
	this.container = new PIXI.Container()
	this.bg = new PIXI.Sprite(pixelText)
	this.bg.width = viewWidth
	this.bg.height = gameHeight
	this.bg.tint = 0x000000
	this.insignia = new PIXI.Sprite(redInsigniaText)
	// this.insignia.tint = 0x386c00
	this.insignia.anchor.set(0.5)
	this.insignia.width = this.insignia.height = gameHeight/1000
	this.insignia.maxSize = gameHeight/1.5
	this.insignia.x = viewWidth/2
	this.insignia.y = gameHeight/2
	this.insignia.alpha = 0
	this.container.addChild(this.bg)
	this.container.addChild(this.insignia)
	this.container.visible = false
	stage.addChild(this.container)
	this.exposureTime = 0
	this.summoned = false
	this.resetting = false
	this.summon = function(resetting) {
		this.summoned = true
		this.resetting = resetting
		// progressBar.reached = 0
		// progressBar.marker.x = progressBar.marker.home
		totalDistance = 0
		clearSplashes()
	}
	this.display = function(duration) {
		if (!this.container.visible) {
			this.container.visible = true
			this.exposureTime = duration
		}
		var introTime = Math.ceil(duration/3)
		if (this.exposureTime < introTime) {
			this.insignia.width -= this.insignia.maxSize/introTime
			this.insignia.height -= this.insignia.maxSize/introTime
			this.insignia.alpha -= (1/introTime)
			// this.insignia.rotation -= degToRad(360/(introTime-1))
		} else {
			if (this.insignia.width+(this.insignia.maxSize/introTime) < this.insignia.maxSize) {
				this.insignia.width += this.insignia.maxSize/introTime
				this.insignia.height += this.insignia.maxSize/introTime
				this.insignia.alpha += (1/introTime)
				// this.insignia.rotation += degToRad(360/(introTime-1))
			} else {
				this.insignia.width = this.insignia.height = this.insignia.maxSize
			}
		}
		if (this.resetting) {
			this.exposureTime--
		}
		
		
		if (!this.exposureTime) {
			this.container.visible = false
			this.summoned = false
			this.insignia.alpha = 0
			this.insignia.rotation = 0
			// this.insignia.width = this.insignia.height = gameHeight/1000
			if (this.resetting) {
				resetGame()
			}
		}		
	}
}

function ProgressBar() {
	this.container = new PIXI.Container()
	this.bar = new PIXI.Sprite(pixelText)
	this.bar.anchor.set(0.5)
	this.bar.width = viewWidth*0.7
	this.bar.height = pixelSize*4
	this.bar.x = viewWidth/2
	this.bar.y = pixelSize*12
	this.bar.tint = 0xff9999
	this.actualWidth = viewWidth*50
	this.marker = new PIXI.Sprite(pixelText)
	this.marker.anchor.set(0.5)
	this.marker.width = this.bar.height/1.5
	this.marker.height = this.bar.height*4
	this.marker.x = this.marker.home = this.bar.x-(this.bar.width/2)
	this.marker.y = this.bar.y
	this.marker.tint = 0x66aa66
	this.marker.alpha = 0
	this.frogIcon = new PIXI.Sprite(neutralFrogText)
	this.frogIcon.width = frog.sprite.width/3
	this.frogIcon.height = frog.sprite.height/3
	this.frogIcon.anchor.set(0.5)
	this.frogIcon.x = this.marker.x
	this.frogIcon.y = this.marker.y-(this.bar.height/3)
	this.eventMark = new PIXI.Sprite(pixelText)
	this.eventMark.anchor.set(0.5)
	this.eventMark.width = this.bar.height
	this.eventMark.height = this.bar.height*3
	this.eventMark.x = this.bar.x
	this.eventMark.y = this.bar.y
	this.eventMark.active = false
	this.eventMark.tint = 0xaa6666
	this.eventLegend = new PIXI.Text("???",messageHorizStyle)
	// this.eventLegend.ratioHW = this.eventLegend.height/this.eventLegend.width
	// this.eventLegend.height = Math.round(this.bar.height*1.5)
	// this.eventLegend.width = Math.round(this.eventLegend.height/this.eventLegend.ratioHW)
	this.eventLegend.anchor.set(0.5)
	this.eventLegend.x = this.eventMark.x
	this.eventLegend.y = this.eventMark.y
	this.cycles = 0
	this.container.addChild(this.bar)
	this.container.addChild(this.eventMark)
	this.container.addChild(this.eventLegend)
	this.container.addChild(this.marker)
	this.container.addChild(this.frogIcon)
	// stage.addChild(this.container)

	this.reached = 0

	this.marks = []
	this.container.visible = true

	this.triggerEventMark = function() {
		
		if (this.eventMark.width+(pixelSize*12) < this.bar.width) {
			this.eventMark.width += pixelSize*12
		} else {
			this.eventMark.width = this.bar.width
			this.eventMark.active = true
			this.eventMark.alpha = 1
		}
	}
	this.updateEventMark = function() {
		if (counter % 4 === 0) {
			this.eventMark.alpha = 0.6
		} else {
			this.eventMark.alpha = 1
		}
		var sinceTriggered = counter-this.eventTriggeredAt
		if (sinceTriggered < 30) {
			if (this.eventMark.width+(pixelSize*12) < this.bar.width) {
				this.eventMark.width += pixelSize*12
			} else {
				this.eventMark.width = this.bar.width
				this.eventMark.alpha = 1
			}
		} else {
			var increment = (this.bar.width/currentMaxDuration)
			// if (this.eventMark.width-(this.bar.height/12) > this.bar.height) {
			// 	this.eventMark.width -= this.bar.height/12
			// } else {
			// 	this.eventMark.width = this.bar.height

			// }
			if (this.eventMark.width-increment >= this.bar.height) {
				this.eventMark.width -= increment
			} else {
				this.eventMark.width = this.bar.height
				this.reached = 2
				this.eventMark.active = false
			}
		}
		
		
	}

	this.update = function() {		
		if (this.reached === 0 && this.marker.x > this.bar.x) {
			this.reached = 1
			this.eventTriggeredAt = counter
			currentEventDuration = currentMaxDuration
			this.cycles++
		}
		if (this.reached === 1) {
			this.marker.x = this.bar.x
			this.updateEventMark()
            if (!bossMode) {
                currentEventDuration--
            }
		} else {
			var inc = this.bar.width/(this.actualWidth)
			this.marker.x += inc*scrollSpeed
			// var diff = (this.actualWidth*(this.cycles+1))-totalDistance
			// this.marker.x = this.marker.home+this.bar.width-(this.bar.width*(diff/this.actualWidth))
			// var inc = this.bar.width/this.actualWidth*12
			// this.marker.x += inc
			if (this.marker.x > this.bar.x+(this.bar.width/2)) {
				this.marker.x -= this.bar.width
				this.reached = 0
			}
		}
		this.frogIcon.x = this.marker.x
	}
}

function rankify(num) {
	var lastNum = num.toString()[num.toString().length-1]
	var penultNum = num.toString()[num.toString().length-2]
	var suffix = "th"
	if (lastNum == 1) {
		if (penultNum == 1) { // 11th
			suffix = "th"
		} else {
			suffix = "st" //
		}
	} else if (lastNum == 2) {
		if (penultNum == 1) { // 12th
			suffix = "th"
		} else {
			suffix = "nd"
		}
	} else if (lastNum == 3) {
		if (penultNum == 1) { // 13th
			suffix = "th"
		} else {
			suffix = "rd"
		}
	}
	return num + suffix
}

function checkIfScorePlaces() {
	playerFootScore = scoreInFeet(totalDistance)
	if (scoreArray.length < scoresToDisplay || playerFootScore > scoreArray[scoreArray.length-1][1]) {
		return true
	} else {
		return false
	}
}

function updateScoreboard() {
	for (var e=0;e<scoreArray.length;e++) {
		// if (highScoreScreen.scores[e].rankField.text === "") {
		highScoreScreen.scores[e].rankField.text = rankify(e + 1);
		// }
		var entry = scoreArray[e]
		var row = e
		var nameString = entry[0].toUpperCase()
		var scoreString = entry[1]
		highScoreScreen.scores[e].nameField.text = nameString
		highScoreScreen.scores[e].scoreField.text = scoreString
		if (nameString === currentNameEntered.toUpperCase() && scoreString.toString() === playerFootScore.toString()) {
			
			var place = e+1
			highScoreScreen.scores[e].rankField.tint = 0x00ff00
			highScoreScreen.scores[e].nameField.tint = 0x00ff00
			highScoreScreen.scores[e].scoreField.tint = 0x00ff00
			var visibleScoreArea = (highScoreScreen.bg.height-(highScoreScreen.header.height+highScoreScreen.footer.height))
			var lowestVisible = Math.round(visibleScoreArea/(highScoreScreen.bg.height*0.05))
			console.log('lowest visible is ' + lowestVisible)
			if (e >= lowestVisible) {
				var overage = e-lowestVisible
				if (place < lowestVisible) {
					// console.log("keeping at top")
					highScoreScreen.listContainer.y = highScoreScreen.listContainer.origY
				} else if (place < (scoreArray.length-lowestVisible)) {
					// console.log("moving to mid level")
					highScoreScreen.listContainer.y = highScoreScreen.listContainer.origY-(overage*highScoreScreen.bg.height*0.05)-(Math.ceil(lowestVisible/2)*highScoreScreen.bg.height*0.05)
				} else {
					// console.log("moving to end")
					highScoreScreen.listContainer.y = highScoreScreen.listContainer.yLimit
				}
			}
		} else {
			highScoreScreen.scores[e].rankField.tint = 0xffffff
			highScoreScreen.scores[e].nameField.tint = 0xffffff
			highScoreScreen.scores[e].scoreField.tint = 0xffffff
		}
	}
}
function HighScoreDisplay() {
	this.container = new PIXI.Container()
	this.bg = new PIXI.Sprite(pixelText)
	this.bg.anchor.x = 0.5
	if (!screenVertical) {
		this.bg.width = viewWidth*0.45
		this.bg.height = viewHeight*0.95
		this.bg.y = window.innerHeight*0.025
		var headStyle = exitStyle
		var footStyle = exitStyle2
	} else {
		this.bg.width = window.innerWidth*0.85
		this.bg.height = window.innerHeight*0.9
		this.bg.y = window.innerHeight*0.05
		var headStyle = exitStyle
		var footStyle = exitStyle
	}
	this.bg.x = viewWidth/2
	
	this.bg.tint = 0xff0000
	
	this.header = new PIXI.Sprite(headerBackText)
	this.header.anchor.x = 0.5
	this.header.width = this.bg.width
	this.header.height = window.innerHeight*0.1
	this.header.x = viewWidth/2
	this.header.y = this.bg.y
	this.footer = new PIXI.Sprite(headerBackText)
	this.footer.anchor.x = 0.5
	this.footer.width = this.bg.width
	this.footer.height = this.header.height
	this.footer.x = viewWidth/2
	this.footer.y = this.bg.y+this.bg.height-this.footer.height
	this.header.legend = new PIXI.Text("HIGH SCORES",headStyle)
	this.header.legend.anchor.x = 0.5
	this.header.legend.x = this.header.x
	this.header.legend.y = this.header.y+(this.header.height/2)-(this.header.legend.height/2)
	this.footer.legend = new PIXI.Text("BACK",footStyle)
	this.footer.legend.anchor.x = 0.5
	this.footer.legend.x = this.footer.x
	this.footer.legend.y = this.footer.y+(this.footer.height/2)-(this.footer.legend.height/2)
	
	this.scores = []
	this.listContainer = new PIXI.Container()
	// this.container.addChild(this.bg)
	
	stage.addChild(this.container)
	for (var e=0;e<scoresToDisplay;e++) {
		var entry = new ScoreEntry(this)
		if (e%2 === 0) {
			entry.bg.tint = 0x060906
		}
		this.scores.push(entry)
		entry.container.y = this.header.y+this.header.height+(entry.bg.height/2)+(entry.bg.height*e)
		if ((e+1)<scoreArray.length) {
			entry.rankField.text = rankify(e+1)
		}
		this.listContainer.addChild(entry.container)
	}
	this.listContainer.origY = this.listContainer.y
	this.listContainer.grabbedAt = undefined
	this.listContainer.owner = this
	this.listContainer.movedLast = 0
	this.listContainer.velocity = 0
	// this.footer.alpha = 0.4
	// this.header.alpha = 0.6
	this.listContainer.mask = new PIXI.Sprite(pixelText)
	this.listContainer.mask.width = this.bg.width
	this.listContainer.mask.height = this.bg.height-this.header.height-this.footer.height
	this.listContainer.mask.anchor.x = 0.5
	this.listContainer.mask.x = this.bg.x
	this.listContainer.mask.y = this.bg.y+this.header.height
	this.listContainer.interactive = true
	this.listContainer.yLimit = -(this.listContainer.height-this.bg.height+this.footer.height+this.header.height)
	this.listContainer.lastY = this.listContainer.y
	this.listContainer.on("touchstart",function(event){
		this.grabbedAt = event.data.global.y
		this.initialY = this.y
		this.velocity = 0
	})
	this.listContainer.on("touchmove",function(event){
		if (scoreArray.length > 12) {
			var movedY = event.data.global.y-this.grabbedAt
			var target = this.initialY+movedY
			if (target >= this.yLimit && target <= this.origY) {
				this.y = this.initialY+movedY
			} else {
				if (target>this.origY) {
					this.y = this.origY
				}
				if (target<this.yLimit) {
					this.y = this.yLimit
				}
			}
		}
		
	})
	this.listContainer.on("touchend",function(){
		this.grabbedAt = false
		// this.velocity = (this.lastY-this.y)*2
	})
	this.footer.interactive = true
	this.footer.on('pointerdown',function(){
		highScoreScreen.container.visible = false
		highScoreScreen.listContainer.y = highScoreScreen.listContainer.origY
		playerResetAt = counter
	})
	
	
	this.container.addChild(this.listContainer)
	this.container.addChild(this.listContainer.mask)
	this.container.addChild(this.header)
	this.container.addChild(this.header.legend)
	this.container.addChild(this.footer)
	this.container.addChild(this.footer.legend)

	stage.addChild(this.container)
	this.container.visible = false

}
function ScoreEntry(parent) {
	this.container = new PIXI.Container()
	this.bg = new PIXI.Sprite(pixelText)
	this.bg.width = parent.bg.width
	this.bg.height = parent.bg.height*0.05
	this.bg.anchor.set(0.5)
	this.bg.x = viewWidth/2
	this.bg.tint = 0x000000
	this.rankField = new PIXI.Text('',highScoreStyle)
	this.nameField = new PIXI.Text('',highScoreStyle)
	this.scoreField = new PIXI.Text('',highScoreStyleRight)
	this.scoreField.anchor.x = 1
	this.rankField.anchor.y = this.nameField.anchor.y = this.scoreField.anchor.y = 0.5
	this.rankField.y = this.nameField.y = this.scoreField.y = this.bg.y+(this.bg.height*0.1)
	this.rankField.x = this.bg.x-(this.bg.width/2.2)
	this.nameField.x = this.bg.x-(this.bg.width*0.19)
	this.scoreField.x = this.bg.x+(this.bg.width/2.2)
	this.container.addChild(this.bg)
	this.container.addChild(this.rankField)
	this.container.addChild(this.nameField)
	this.container.addChild(this.scoreField)
	

}

function createSprites() {
	
	// var spritesheet = new PIXI.Spritesheet()
	id = PIXI.loader.resources["assets/spritesheet.json"].textures
	// tysonSheet = id["tysonsheet.png"]
	pixelText =  id["pixel.bmp"] 
	headerBackText = id["foothead.png"]
	startButtonText =  id["startbutton.png"] 
	highScoreButtonText =  id["highscoresbutton.png"] 
	soundOnText =  id["soundon.png"] 
	soundOffText =  id["soundoff.png"] 
	musicOnText =  id["musicon.png"] 
	musicOffText =  id["musicoff.png"] 
	redInsigniaText =  id["redinsignia.png"] 
	$('.sk-fading-circle').fadeOut()
	neutralFrogText = id['frogneutral.png']
	duckingFrogText =  id["frogducking.png"]
	frogJumpingUpText =  id["frogjumpingup.png"] 
	frogJumpingDownText =  id["frogjumpingdown.png"] 
	crashedFrogText =  id["crashedfrog.png"] 
	flungFrogText =  id["flungfrog.png"] 
	bikeText =  id["bike.png"] 
	crashedBikeText =  id["crashedbike.png"] 
	titleHighlightText =  id["titlehighlight.png"] 
	
	
	starText =  id["star.png"] 
	bombExplosionText =  id["bombexplosion.png"] 
	topBrainsText =  id["topbrains1.png"] 
	midBrainsText =  id["midbrains1.png"] 
	midGroundText =  id["midground.png"] 
	midEggsText =  id["mideggs.png"] 
	midEggs2Text =  id["mideggs2.png"] 
	rearEggsText =  id["reareggs.png"] 
	frontEggsText =  id["fronteggs.png"] 
	midGroundLeftEndText =  id["midgroundleftend.png"] 
	midGroundRightEndText =  id["midgroundrightend.png"] 
	frogCaughtText =  id["frogcaught.png"] 
	sphereText =  id["sphere.png"] 
	arrowText =  id["arrow.png"] 
	shadowText =  id["shadow.png"] 
	pillarText =  id["pillar.png"] 
	shortPillarText =  id["shortpillar.png"] 
	shortWidePillarText =  id["shortwidepillar.png"] 
	rampText =  id["ramp.png"] 
	highRampText =  id["highramp.png"] 
	highWidePillarText =  id["highpillar.png"] 
	exclamationPointText =  id["exclamationpoint.png"] 
	mineText =  id["mine.png"] 
	rocketRatText =  id["rocketrat.png"] 
	slantShadowText =  id["slantshadow.png"] 
	slantShadowLongText =  id["slantshadowlong.png"] 
	knobText = id["joystickhead.png"] 
	
}
function loadSpriteSheet() {
	PIXI.loader
	.add("assets/spritesheet.json")

	PIXI.loader.load((loader, resources) => {
		createSprites()
		init()
		
	});
}