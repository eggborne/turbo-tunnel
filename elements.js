function Background() {
	this.shifted = 0
	this.bg3 = new PIXI.Container()
	this.bg15 = new PIXI.Container()
	this.bg2 = new PIXI.Container()
	this.bg1 = new PIXI.Container()
	this.bgTopBrains = new PIXI.Container()
	this.bgZero = new PIXI.Container()
	this.bg1.scrolled = this.bgTopBrains.scrolled = this.bg15.scrolled = this.bg2.scrolled = this.bg3.scrolled = this.bgZero.scrolled = 0
	this.topBrains = []
	this.midBrains = []
	this.middleRearEggs = []
	this.rearEggs = []
	this.floors = []
	this.frontEggs = []
	this.floorContainer = new PIXI.Container()
	var upper = new PIXI.Sprite(topBrainsText)
	var mid = new PIXI.Sprite(midBrainsText)
	var floor = new PIXI.Sprite(midGroundText)
	this.topBrainHW = upper.height/upper.width
	this.topBrainHeight = viewHeight*(upper.height/pixelHeight)
	this.topBrainWidth = this.topBrainHeight/this.topBrainHW
	this.midBrainHW = mid.height/mid.width
	this.midBrainHeight = viewHeight*(mid.height/pixelHeight)
	this.midBrainWidth = this.midBrainHeight/this.midBrainHW
	this.floorHW = floor.height/floor.width
	this.floorHeight = viewHeight*(floor.height/pixelHeight)
	this.floorWidth = this.floorHeight/this.floorHW
	this.brainsPerWidth = 1+Math.ceil(window.innerWidth/this.topBrainWidth)
	this.floorsPerWidth = 1+Math.ceil(window.innerWidth/(this.floorWidth))
	this.floorHeight = viewHeight-(this.topBrainHeight+this.midBrainHeight)
	this.floorBreadth = viewHeight*(28/pixelHeight)	
	this.finishedGap = -99
	this.producingFloor = true
	stage.addChild(this.bgTopBrains)
	stage.addChild(this.bg3)
	stage.addChild(this.bg2)
	stage.addChild(this.bg15)
	stage.addChild(this.bg1)	
		
	stage.addChild(this.bgZero)	
	
	highestFloor = viewHeight*(118/pixelHeight)
	lowestFloor =  viewHeight*(152/pixelHeight)
	this.floorsToRestore = 0

	this.destruct = function() {
		this.bgTopBrains.destroy()
		this.bg3.destroy()
		this.bg2.destroy()
		this.bg15.destroy()
		this.bg1.destroy()	
		this.bgZero.destroy()

	}

	this.shiftTopContents = function() {
		var leftMost = this.topBrains[0]
		this.topBrains.splice(0,1)
		this.topBrains.push(leftMost)
		leftMost.x += (this.brainsPerWidth*this.topBrainWidth)
	}
	this.shiftMidContents = function() {
		var leftMost = this.midBrains[0]
		this.midBrains.splice(0,1)
		this.midBrains.push(leftMost)
		leftMost.x += (this.brainsPerWidth*this.midBrainWidth)
	}
	this.shiftRearMidContents = function() {
		var leftMost = this.middleRearEggs[0]
		this.middleRearEggs.splice(0,1)
		this.middleRearEggs.push(leftMost)
		leftMost.x += (this.brainsPerWidth*this.midBrainWidth)
	}
	this.shiftRearContents = function() {
		var leftMost = this.rearEggs[0]
		this.rearEggs.splice(0,1)
		this.rearEggs.push(leftMost)
		leftMost.x += (this.brainsPerWidth*this.midBrainWidth)
	}
	this.shiftFloor = function() {
		this.shifted++
		var leftMost = this.floors[0]
		this.floors.splice(0,1)
		this.floors.push(leftMost)
		// leftMost.x += (this.floorsPerWidth*this.floorWidth)
		leftMost.x += (this.floorsPerWidth*this.floorWidth)
		if (frog.vehicle === "rocketPlane") {
			currentGapSize++
		}
		if (currentGapSize) {
			currentGapSize--
			if (currentGapSize > 0) {
				leftMost.texture = midEggsText
			} else {
				leftMost.texture = midGroundLeftEndText
				this.gapBlocking = false
				this.finishedGap = counter
			}
			
		} else {
			if (this.floorsToRestore && leftMost.texture !== midGroundText) {
				if (this.makingGap) {
					this.makingGap = false
				}
				leftMost.texture = midGroundText
				this.floorsToRestore--
				if (this.floorsToRestore === 0) {
					nextGap.min = 0
					nextGap.max = 0
				}
			}
		}
	}
	this.shiftForeground = function() {
		var leftMost = this.frontEggs[0]
		this.frontEggs.splice(0,1)
		this.frontEggs.push(leftMost)
		leftMost.x += (this.brainsPerWidth*this.midBrainWidth)
	}
	this.createTop = function(posX) {
		var topBrain = new PIXI.Sprite(topBrainsText)
		topBrain.width = this.topBrainWidth
		topBrain.height = this.topBrainHeight
		topBrain.x = posX
		topBrain.y = 0
		this.topBrains.push(topBrain)
		this.bgTopBrains.addChild(topBrain)
	}
	this.createMiddle = function(posX) {
		var midBrain = preparedSprite(midBrainsText)
		midBrain.anchor.y = 0
		midBrain.x = posX
		midBrain.y = this.topBrainHeight
		// midBrain.alpha = 0
		this.midBrains.push(midBrain)
		this.bg3.addChild(midBrain)
	}
	
	this.createMidGround = function(posX) {
		var ground = preparedSprite(midGroundText)
		ground.anchor.y = 0
		ground.x = posX
		ground.y = this.topBrainHeight+(ground.height)
		this.floors.push(ground)
		this.bg1.addChild(ground)
	}	
	this.createRear = function(posX) {
		var rearEgg = preparedSprite(rearEggsText)
		rearEgg.anchor.y = 0
		rearEgg.x = posX
		rearEgg.y = this.topBrainHeight+(rearEgg.height)
		this.rearEggs.push(rearEgg)
		this.bg2.addChild(rearEgg)
	}
	this.createMiddleRear = function(posX) {
		var middleRearEgg = preparedSprite(midEggs2Text)
		middleRearEgg.anchor.y = 0
		middleRearEgg.x = posX
		middleRearEgg.y = this.topBrainHeight+(middleRearEgg.height)
		this.middleRearEggs.push(middleRearEgg)
		this.bg15.addChild(middleRearEgg)
	}
	this.createForeground = function(posX) {
		var frontEgg = preparedSprite(frontEggsText)
		frontEgg.anchor.y = 0
		frontEgg.x = posX
		frontEgg.y = this.topBrainHeight+(frontEgg.height)
		this.frontEggs.push(frontEgg)
		this.bgZero.addChild(frontEgg)
	}
	this.moveLeft = function(amount) {	
		this.bgZero.x -= amount*1.12
		this.bgZero.scrolled += amount*1.12
		this.bg1.x -= amount
		this.bg1.scrolled += amount
		this.bgTopBrains.x -= amount
		this.bgTopBrains.scrolled += amount
		
		totalDistance += amount		
		// if (nextGap.max > 0 || counter < this.finishedGap+400) {		
			this.bg2.x -= amount*0.75
			this.bg2.scrolled += amount*0.75
			this.bg15.x -= amount*0.9
			this.bg15.scrolled += amount*0.9			
		// }
		this.bg3.x -= amount*0.6
		this.bg3.scrolled += amount*0.6
		if (this.bgZero.scrolled > this.floorWidth) {
			this.shiftForeground()
			this.bgZero.scrolled = this.bgZero.scrolled-this.floorWidth
		}
		if (this.bgTopBrains.scrolled > this.topBrainWidth) {
			this.shiftTopContents()
			this.bgTopBrains.scrolled = this.bgTopBrains.scrolled-this.topBrainWidth
		}
				
		if (this.bg1.scrolled > this.floorWidth) {
			this.shiftFloor()
			this.bg1.scrolled = this.bg1.scrolled-this.floorWidth
			
		}
		if (this.bg15.scrolled > this.floorWidth) {
			this.shiftRearMidContents()
			this.bg15.scrolled = this.bg15.scrolled-this.midBrainWidth
		}
		if (this.bg2.scrolled >= this.midBrainWidth) {
			this.shiftRearContents()
			this.bg2.scrolled = this.bg2.scrolled-this.midBrainWidth
		}
		if (this.bg3.scrolled >= this.midBrainWidth) {
			this.shiftMidContents()
			this.bg3.scrolled = this.bg3.scrolled-this.midBrainWidth
		}
	}
	this.makingGap = false
	this.startGap = function(size) {
		this.makingGap = true
		this.gapBlocking = true
		currentGapSize = size
		this.floorsToRestore = (size-1)+2
		var rightMost = rightMostInArray(this.floors)
		rightMost.texture = midGroundRightEndText
		nextGap.min = Math.round(rightMost.x+rightMost.width*0.72)
		nextGap.max = nextGap.min+Math.round(((this.floorsToRestore-1)*rightMost.width)-(rightMost.width*0.72))	
	}
	gameHeight = this.topBrainHeight+this.midBrainHeight+this.floorHeight	
}
function preparedSprite(texture) {
	var sprite = new PIXI.Sprite(texture)
	sprites++
	sprite.anchor.y = 1
	spriteHW = sprite.height/sprite.width
	sprite.height = viewHeight*(sprite.height/pixelHeight)
	sprite.width = sprite.height/spriteHW	
	return sprite
}
function tiledSprite(texture) {
	var sprite = new PIXI.extras.TilingSprite(texture,texture.width,texture.height)
	sprites++
	sprite.anchor.y = 1
	spriteHW = sprite.height/sprite.width
	sprite.height = viewHeight*(sprite.height/pixelHeight)
	sprite.width = sprite.height/spriteHW	
	return sprite
}
function usedSpriteAvailable(texture) {
	usedSprite = undefined
	for (var s=0;s<deadSprites.length;s++) {
		var sprite = deadSprites[s]
		if (!usedSprite && sprite.texture === texture) {
			usedSprite = sprite
			deadSprites.splice(s,1)
		}
	}
	return usedSprite
}

function Pillar(argArray) {
	var texture = argArray[0]
	var posY = argArray[1]
	var warningTime = argArray[2]
	// var spriteSource = usedSpriteAvailable(texture)
	// if (spriteSource) {
	// 	this.sprite = spriteSource
	// 	this.sprite.visible = true
	// } else {
		this.sprite = preparedSprite(texture)
	// }	
	this.sprite.x = (viewWidth/stage.scale.x)-this.sprite.width
	this.sprite.y = this.homeY = lowestFloor-(posY*(background.floorBreadth/3))	
	this.warningTime = warningTime
	this.flashSpeed = Math.ceil(warningTime/8)
	this.spawnedAt = counter
	this.droppedAt = 0
	this.whooshed = false
	var dropDistance = scrollSpeed*this.warningTime
	this.dropX = Math.round((-background.bg1.x)+this.sprite.x+dropDistance)		
	if (texture === pillarText) {		
		this.baseDetectionArea = this.sprite.height/2
	} else if (texture === shortPillarText) {
		this.baseDetectionArea = this.sprite.height/1.5
	} else if (texture === shortWidePillarText) {
		this.baseDetectionArea = this.sprite.height
	} else if (texture === rampText) {
		this.baseDetectionArea = this.sprite.height/1.5		
	} else if (texture === highWidePillarText) {
		this.baseDetectionArea = this.sprite.height
		this.shadow = new preparedSprite(slantShadowLongText)
		this.shadow.x = this.sprite.x
		this.shadow.y = this.sprite.y
		
	} else if (texture === highRampText) {
		this.baseDetectionArea = this.sprite.height/1.5		
		this.shadow = new preparedSprite(slantShadowText)
		this.shadow.x = this.sprite.x
		this.shadow.y = this.sprite.y
		
	}
}
Pillar.prototype.finalize = function() {
	pillars.push(this)
	stage.addChildAt(this.sprite,stage.children.indexOf(background.bg1)+1)
	if (this.shadow) {
		stage.addChildAt(this.shadow,stage.children.indexOf(background.bg1)+1)
	}	
	pillarsPending++
}
Pillar.prototype.screenPosition = function() {
	return {x:this.sprite.x,y:this.sprite.y}
}
Pillar.prototype.advance = function() {
	this.sprite.x -= Math.round(scrollSpeed)
	if (this.shadow) {
		this.shadow.x -= Math.round(scrollSpeed)
	}
	if (!this.whooshed && this.sprite.x < frog.sprite.x-frog.sprite.width) {
		if (Math.abs(this.sprite.y-frog.shadow.y) < frog.sprite.height*1.5) {
			if (soundOn) {
				whooshSound.play()
			}
		}
		this.whooshed = true
	}
}
Pillar.prototype.checkForFrog = function() {
	if (this.screenPosition().x <= frog.sprite.x && this.screenPosition().x > (frog.sprite.x-(frog.sprite.width)) 
		&& frog.shadow.y <= this.sprite.y && frog.shadow.y >= this.sprite.y-(this.baseDetectionArea)) {
		 
		if (this.sprite.texture === pillarText && frog.elevation < this.sprite.height*0.9) {
			frog.sprite.x -= frog.velocity.x
			frog.die(this.sprite.texture)
			if ((this.sprite.height-frog.elevation) > frog.sprite.height) {
				frog.corpse.visible = true
				frog.corpse.x = frog.sprite.x
				frog.corpse.y = frog.sprite.y-frog.sprite.height/4
			} else {
				frog.flyingCorpse.visible = true
				frog.flyingCorpse.x = frog.sprite.x
				frog.flyingCorpse.y = frog.sprite.y-frog.sprite.height/3
			}
		}
		if (this.sprite.texture === shortWidePillarText || this.sprite.texture === shortPillarText) {
			if (!frog.offGround) {
				frog.sprite.x -= frog.velocity.x
				frog.die(this.sprite.texture)
				frog.flyingCorpse.visible = true
				frog.flyingCorpse.x = frog.sprite.x
				frog.flyingCorpse.y = frog.sprite.y-frog.sprite.height/3
			}
		}
		if (this.sprite.texture === highWidePillarText) {
			var pillarTop = this.sprite.height*0.53
			if ((!frog.offGround && !frog.ducking) || (frog.offGround && frog.elevation < pillarTop)) {
				frog.sprite.x -= frog.velocity.x
				frog.die(this.sprite.texture)
				if (frog.elevation < pillarTop*0.5) {
					frog.deathImpact = "high"
					frog.corpse.visible = true
					frog.corpse.x = frog.sprite.x
					frog.corpse.y = frog.sprite.y-frog.sprite.height/4
				} else {
					frog.sprite.texture = crashedBikeText
					frog.deathImpact = "low"
					frog.flyingCorpse.visible = true
					frog.flyingCorpse.x = frog.sprite.x
					frog.flyingCorpse.y = frog.sprite.y-frog.sprite.height/4
				}
				
			}	
		}
		if (this.sprite.texture === rampText) {
			
			if (!frog.offGround) {
				frog.jump(rampBoost+((scrollRate()/10)))
			}
		}
		if (this.sprite.texture === highRampText) {
			
			if (frog.offGround && frog.elevation < this.sprite.y-this.sprite.height/2) {
				frog.jump(rampBoost+((scrollRate()/10)))
			}
		}
	}
}
Pillar.prototype.correctZLevel = function() {
	if ((this.sprite.texture === highRampText && !frog.offGround) || (this.sprite.texture === highWidePillarText && frog.ducking) || frog.shadow.y < this.sprite.y-(this.baseDetectionArea)) {
		if (stage.children.indexOf(this.sprite) < stage.children.indexOf(frog.sprite)) {
			stage.removeChild(this.sprite)
			stage.addChildAt(this.sprite,stage.children.indexOf(frog.sprite)+1)
		}
	} else {
		if (stage.children.indexOf(this.sprite) > stage.children.indexOf(frog.sprite)) {
			stage.removeChild(this.sprite)
			stage.addChildAt(this.sprite,stage.children.indexOf(frog.sprite)-1)
		}
	}
}
Pillar.prototype.flash = function() {
	var sinceDropped = counter-this.spawnedAt
	if (sinceDropped < this.warningTime) {
		if (sinceDropped > 0 && sinceDropped % this.flashSpeed === 0) {
			if (this.sprite.alpha === 1) {
				this.sprite.alpha = 0.1
				if (this.shadow) {
					this.shadow.alpha = 0.1
				}
			} else {
				this.sprite.alpha = 1
				if (this.shadow) {
					this.shadow.alpha = 1
				}
			}
		}
	} else {
		this.sprite.alpha = 1
		if (this.shadow) {
			this.shadow.alpha = 1
		}
		this.droppedAt = counter
		if (this.sprite.texture === rampText) {
			background.startGap(randomInt(2,maxGapLength))
			gapPlanned = false
			lastGap = counter
		}
		if (this.sprite.texture === highRampText) {
			background.startGap(3,maxGapLength+1)
			gapPlanned = false
			lastGap = counter
		}
		pillarsPending--
	}
}

function Splash(posX,posY,size,speed,texture,particles,alphaFactor) {
	this.container = new PIXI.Container()
	this.speed = speed
	
	for (var p=0;p<particles;p++) {
		var part = new PIXI.Sprite(texture)
		part.anchor.set = 0.5
		part.x = posX
		part.y = posY
		part.flyAngle = degToRad(360/particles)*p
		part.width = part.height = size
		part.alphaFactor = 0.04
		// var startSpot = pointAtAngle(part.x,part.y,part.flyAngle,frog.sprite.height/56)
		// part.x = startSpot.x
		// part.y = startSpot.y
		
		this.container.addChild(part)
		part.fly = function() {
			var flySpeed = speed
			if (this.texture === starText) {
				flySpeed = speed+(randomInt(-2,2)*(frog.sprite.height/100))
			}
			var newSpot = pointAtAngle(this.x,this.y,this.flyAngle,flySpeed)
			this.x = newSpot.x
			this.y = newSpot.y
			if (this.texture === starText) {
				this.rotation += degToRad(6)
			}
			this.alpha -= this.alphaFactor
			if (this.alpha < 0) {
				this.alpha = 0
			}
			
		}
	}
	this.explode = function() {
		for (var p=0;p<this.container.children.length;p++) {
			var part = this.container.children[p]
			part.fly(this.speed)
			if (p === this.container.children.length-1 && part.alpha <= 0) {
				splashes.splice(splashes.indexOf(this),1)
				stage.removeChild(this.container)
				return
			}
		}
	}
	stage.addChild(this.container)
	splashes.push(this)
}
function Impact(posX,posY,texture,particles) {
	this.container = new PIXI.Container()
	
	for (var p=0;p<particles.length;p++) {
		var part = new PIXI.Sprite(texture)
		part.anchor.set = 0.5
		part.x = posX
		part.y = posY
		part.flyAngle = degToRad(360/particles)*p
		part.width = part.height = frog.sprite.height/10
		// var startSpot = pointAtAngle(part.x,part.y,part.flyAngle,frog.sprite.height/56)
		// part.x = startSpot.x
		// part.y = startSpot.y
		
		this.container.addChild(part)
		part.fly = function(speed) {
			var newSpot = pointAtAngle(this.x,this.y,this.flyAngle,speed)
			var distance = distanceFromABToXY(this.x,this.y,newSpot.x,newSpot.y)
			if (distance < frog.sprite.height/2) {
				this.x = newSpot.x
				this.y = newSpot.y
			}
			this.alpha -= 0.01
			if (this.alpha < 0) {
				this.alpha = 0
			}
		}
	}
	this.explode = function(speed) {
		for (var p=0;p<this.container.children.length;p++) {
			var part = this.container.children[p]
			part.fly(speed)
			// if (p === this.container.children.length-1 && part.alpha <= 0) {
				// impacts.splice(impacts.indexOf(this),1)
				// stage.removeChild(this.container)
				// return
			// }
		}
	}
	stage.addChild(this.container)
	impacts.push(this)
}
function rightMostInArray(arr) {
	var furthest = 0
	var winner = undefined
	for (var e=0;e<arr.length;e++) {
		var entry = arr[e]
		if (entry.x > furthest) {
			furthest = entry.x
			winner = entry
		}
	}
	return winner
}
function GameMessage() {
	if (screenVertical) {
		messageStyle = messageVertStyle
	} else {
		messageStyle = messageHorizStyle
	}
	this.legend = new PIXI.Text(currentMessage,messageStyle)
	this.legend.anchor.set(0.5)
	this.legend.homeX = Math.round(viewWidth/2)
	this.legend.x = Math.round(this.legend.homeX+(viewWidth/2)+(this.legend.width/2))
	this.legend.skew.x = -0.5
	this.legend.maxSkew = -this.legend.skew.x
	this.activated = false
	this.landed = false
	this.legend.y = Math.round(viewHeight/3)
	this.scrollOnscreen = function() {
		lastScrollSpeed = scrollUnit*16
		if (this.legend.text !== currentMessage) {
			this.legend.text = currentMessage
		}
		if (!this.landed) {
			if (this.legend.x-lastScrollSpeed >= this.legend.homeX) {
				this.legend.x -= lastScrollSpeed
			} else {
				this.legend.x = this.legend.homeX
				this.landed = true
			}	
		} else {
			if (messageDisplayDuration) {
				if (messageDisplayDuration > 50) {
					this.legend.skew.x += 0.5/10
					// this.legend.scale.x += 0.2/10
					// this.legend.scale.y += 0.2/10
				} else if (!frog.dead && messageDisplayDuration <= 10) {
					this.legend.skew.x -= 0.5/10
					// this.legend.scale.x -= 0.2/10
					// this.legend.scale.y -= 0.2/10
				}
				messageDisplayDuration--		
			} else {
				if (!frog.dead) {
					if (this.legend.x-lastScrollSpeed >= -this.legend.width/2) {
						this.legend.x -= lastScrollSpeed
					} else {
						this.reset()		
					}
				}
			}
		}
	}
	this.reset = function() {
		this.landed = false
		this.legend.y = Math.round(viewHeight/3)
		this.activated = false
		this.legend.x = this.legend.homeX+(viewWidth/2)+(this.legend.width/2)
		this.legend.skew.x = -0.5
		gameMessage.legend.text = ""
		messageDisplayDuration = 60
	}
	stage.addChild(this.legend)
}
function ExclamationMark() {
	this.sprite = preparedSprite(exclamationPointText)
	this.sprite.x = viewWidth-this.sprite.width*1.4
	this.sprite.y = this.sprite.height*1.5
	this.duration = 0
	this.triggered = false
	stage.addChild(this.sprite)
	this.sprite.visible = false
	this.trigger = function() {
		this.triggered = true
		this.sprite.visible = true
		this.duration = 80
		gapPlanned = true
		// nextGap.min = totalDistance
		// nextGap.max = totalDistance+(viewWidth)
	}
	this.activate = function() {
		
		if (this.duration % 5 === 0) {
			if (this.sprite.alpha === 1) {
				this.sprite.alpha = 0.2
			} else {
				this.sprite.alpha = 1
			}
		}
		this.duration--
		if (this.duration === 30) {
			events.length = 0
			addJump()
		}
		if (this.duration === 0) {
			this.sprite.visible = false
			this.triggered = false
			
		}
	}
}

function changeVehicle(newVehicle) {
	
	if (playerVehicle !== newVehicle) {
		playerVehicle = newVehicle
		createBackground()
		frog.destruct()
		frog = undefined
		frog = new Frog(playerVehicle)
	} else {
		frog.destruct()
		frog = undefined
		frog = new Frog(playerVehicle)
	}
	if (newVehicle === "rocketPlane") {
		for (var g=0;g<background.floors.length;g++) {
			var floorPiece = background.floors[g]
			if (floorPiece.texture === midGroundText) {
				floorPiece.texture = midEggsText
			}
		}
		guests.length = 0
		startingSpeed = scrollUnit*2
		rampUpSpeed = 12
		if (controlPanel) {
			controlPanel.jumpLabel.text = "SPEED UP"
			controlPanel.duckLabel.text = "SPEED DOWN"
		}
		// progressBar.eventMark.x = progressBar.eventLegend.x = progressBar.bar.x+(progressBar.bar.width/2)
	}
	
}
function clearSplashes() {
	for (var s=0;s<splashes.length;s++) {
		var splash = splashes[s]
		stage.removeChild(splash.container)
		splashes.splice(s,1)
		s--
	}
}

function Powerup(posX,posY,effect) {
	this.sprite = preparedSprite(megamanIconText)
	this.sprite.scale.x *= 0.5
	this.sprite.scale.y *= 0.5
	this.sprite.anchor.set(0.5)
	this.sprite.x = posX
	this.sprite.y = posY
	this.effect = effect
	stage.addChild(this.sprite)
	this.checkForFrog = function() {
		var xDistance = Math.abs(this.sprite.x-(frog.sprite.x-frog.sprite.width/2))
		var yDistance = Math.abs(this.sprite.y-frog.sprite.y)
		if (xDistance < frog.sprite.width/2 && yDistance < frog.sprite.height) {
			this.effect()
			this.sprite.visible = false
			powerups.splice(powerups.indexOf(this.sprite),1)
		}
	}
}

function Mine() {
	this.sprite = preparedSprite(mineText)
	this.sprite.anchor.x = 0.5
	this.shadow = new PIXI.Sprite(shadowText)
	this.shadow.anchor.x = 0.5
	this.shadow.height = frog.shadow.height
	this.shadow.width = frog.shadow.height*2.65
	this.shadow.origScale = this.shadow.scale.x
	this.shadow.origWidth = this.shadow.width
	this.explosion = preparedSprite(bombExplosionText)
	this.explosion.anchor.x = 0.5
	this.explosion.anchor.y = 0.5
	this.explosion.visible = false
	this.bobPosition = 0
	this.bobbed = 90
	// this.swayed = 90
	this.swayed = 0
	this.speed = this.sprite.width/(randomInt(8,16))
	this.bobMax = this.sprite.height*(randomInt(15,25)/10)
	this.swayMax = background.floorBreadth*4.25
	this.spin = randomInt(0,1)
	this.killedFrog = 0
	
	this.shadow.x = viewWidth
	if (frog.vehicle === "bike") {
		this.shadow.y = lowestFloor-(background.floorBreadth/2)-(this.shadow.height*1.3)
	} else {
		this.shadow.y = randomInt(lowestFloor/4,lowestFloor*1.1)
	}
	this.sprite.x = this.shadow.x
	this.sprite.y = this.shadow.y-(this.sprite.height/6)
	
	stage.addChild(this.sprite)
	stage.addChildAt(this.shadow,stage.children.indexOf(background.bg1)+1)
	stage.addChild(this.explosion)
	this.explode = function() {

	}
	this.advance = function() {
		this.bob()
		this.sprite.x -= this.speed
		this.shadow.x -= this.speed
		var previousPoint = pointAtAngle(this.sprite.x,this.sprite.y,degToRad(this.swayed-1),this.swayMax)
		var bobPoint = pointAtAngle(this.sprite.x,this.sprite.y,degToRad(this.swayed),this.swayMax)
		var moveAmount = bobPoint.y-previousPoint.y
		this.sprite.y += moveAmount
		this.shadow.y += moveAmount
		if (this.spin) {
			this.swayed += 9
			if (this.swayed >= 360) {
				this.swayed -= 360
			}
		} else {
			this.swayed -= 9
			if (this.swayed <= 360) {
				this.swayed += 360
			}	
		}
		if (this.sprite.x < -this.sprite.width/2) {
			this.sprite.visible = false
		}
		if (!frog.overGround()) {
			if (this.shadow.visible) {
				this.shadow.visible = false
			}
		} else {
			if (!this.shadow.visible) {
				this.shadow.visible = true
			}
		}
		
	}
	
	this.bob = function() {
		var previousPoint = pointAtAngle(this.sprite.x,this.sprite.y,degToRad(this.bobbed-1),this.bobMax)
		var bobPoint = pointAtAngle(this.sprite.x,this.sprite.y,degToRad(this.bobbed),this.bobMax)
		var moveAmount = bobPoint.y-previousPoint.y
		this.sprite.y += moveAmount
		if (this.attached) {
			this.attached.sprite.y += moveAmount
			if (this.attached.carrying) {
				this.attached.carrying.sprite.y += moveAmount
				// this.attached.carrying.shadow.y += moveAmount
			}
		}
		this.bobbed += 6
		if (this.bobbed >= 360) {
			this.bobbed -= 360
		}
	}
	this.correctZLevel = function() {
		if (frog.shadow.y <= this.sprite.y) {
			if (stage.children.indexOf(this.sprite) < stage.children.indexOf(frog.sprite)) {
				stage.removeChild(this.sprite)
				stage.addChildAt(this.sprite,stage.children.indexOf(frog.sprite)+1)
			}
		} else {
			if (stage.children.indexOf(this.sprite) > stage.children.indexOf(frog.sprite)) {
				stage.removeChild(this.sprite)
				stage.addChildAt(this.sprite,stage.children.indexOf(frog.sprite)-1)
			}
		}
	}
	mines.push(this)
	lastMine = counter
	
}
Mine.prototype.checkForFrog = function() {
	var xDistance = Math.abs(this.shadow.x-frog.shadow.x)
	var yDistance = Math.abs(this.shadow.y-frog.shadow.y)
	if (!frog.dead && !frog.knocked && !frog.offGround && xDistance < this.shadow.width*1.75 && yDistance < this.shadow.height) {
		frog.sprite.x -= frog.velocity.x
		frog.die(shortWidePillarText)
		frog.flyingCorpse.visible = true
		frog.flyingCorpse.x = frog.sprite.x
		frog.flyingCorpse.y = frog.sprite.y-frog.sprite.height/3
		this.killedFrog = counter
		this.shadow.visible = false	
	}
}
function RocketRat(posY) {
	this.posY = posY
	this.droppedPillar = false
	this.sprite = preparedSprite(rocketRatText)
	this.sprite.anchor.x = 0.5
	this.shadow = new PIXI.Sprite(shadowText)
	this.shadow.anchor.x = 0.5
	this.shadow.height = frog.shadow.height
	this.shadow.width = frog.shadow.height*2.65
	this.shadow.origScale = this.shadow.scale.x
	this.shadow.origWidth = this.shadow.width	
	this.speed = this.sprite.width/7
	this.shadow.x = 0
	this.shadow.y = (lowestFloor-this.shadow.height)-(posY*(background.floorBreadth/2))
	this.sprite.x = this.shadow.x
	this.sprite.y = this.shadow.y-(this.sprite.height*2.75)
	this.cargo = preparedSprite(shortPillarText)
	this.cargo.anchor.x = 0.5
	this.cargo.x = this.sprite.x
	this.cargo.y = this.sprite.y+this.sprite.height 
	stage.addChild(this.cargo)
	stage.addChild(this.sprite)
	stage.addChildAt(this.shadow,stage.children.indexOf(background.bg1)+1)
	
	this.advance = function() {
		if (!this.droppedPillar || counter-this.pillar.droppedAt > 15) {
			this.sprite.x += this.speed
			this.shadow.x += this.speed
		}
		if (this.cargo) {
			this.cargo.x = this.sprite.x
		}
		if (!this.droppedPillar && this.sprite.x >= viewWidth-(this.sprite.width*2)) {
			events = []
			events.push([shortPillarText,this.posY,0])
			
			executeFirstInQueue()
			this.cargo.destroy()
			this.cargo = undefined
			this.pillar = pillars[pillars.length-1]
			this.pillar.droppedAt = counter
			this.pillar.droppedBy = this
			this.pillar.sprite.x = this.sprite.x-this.sprite.width/4
			this.pillar.sprite.y = this.sprite.y+this.sprite.height
			stage.setChildIndex(this.pillar.sprite,stage.children.indexOf(this.shadow)+1)
			this.droppedPillar = true
			pillarsPending--
		}
		if (this.sprite.x > viewWidth+this.sprite.width/2) {
			this.sprite.visible = false
		}
	}
	this.correctZLevel = function() {
		if (frog.shadow.y <= this.sprite.y) {
			if (stage.children.indexOf(this.sprite) < stage.children.indexOf(frog.sprite)) {
				stage.removeChild(this.sprite)
				stage.addChildAt(this.sprite,stage.children.indexOf(frog.sprite)+1)
			}
		} else {
			if (stage.children.indexOf(this.sprite) > stage.children.indexOf(frog.sprite)) {
				stage.removeChild(this.sprite)
				stage.addChildAt(this.sprite,stage.children.indexOf(frog.sprite)-1)
			}
		}
	}
	rocketRats.push(this)
	
}

function distanceInFeet(distance) {
	return Math.round(numberInMiles(distance)*5280)
}

function Checkpoint() {
	this.rearPost = preparedSprite(checkpointRearPostText)
	this.frontPost = preparedSprite(checkpointFrontPostText)
	this.pole = preparedSprite(checkpointPoleText)

	this.rearPost.x = this.frontPost.x = this.pole.x = (viewWidth/stage.scale.x)-this.rearPost.width
	this.rearPost.y = this.frontPost.y = this.pole.y = lowestFloor+(this.rearPost.height*0.1)

	this.activated = false

	stage.addChildAt(this.rearPost,stage.children.indexOf(frog.sprite)-1)	
	stage.addChild(this.frontPost)	
	stage.addChild(this.pole)

	this.checkForFrog = function() {
		if (frog.sprite.x >= this.rearPost.x+(this.rearPost.width/2)) {
			this.activated = true
			scrollSpeed = 0
		}
	}
	this.ejectPole = function() {
		this.pole.y -= frog.sprite.height
		this.pole.x += frog.sprite.height
		if (Math.abs(frog.sprite.y-this.pole.y) > viewWidth) {
			stage.removeChild(this.pole)
		}

	}

}

function FlameWall(gapTop,gapBottom,moveTop,moveBottom) {
	this.container = new PIXI.Container()
	this.topHalf = new PIXI.Container()
	this.bottomHalf = new PIXI.Container()
	this.segHeight = preparedSprite(flameWallText).height
	this.moveTop = moveTop
	this.moveBottom = moveBottom
	this.gapTop = gapTop
	this.gapBottom = gapBottom
	this.minGap = frog.sprite.height*1.5
	this.flashTime = wallFrequency
	// var topNeeded = Math.ceil(gapTop/this.segHeight)+3
	// var bottomNeeded = Math.ceil((viewHeight-gapBottom)/this.segHeight)+3
	var topNeeded = 5
	var bottomNeeded = 5
	for (var s=0;s<topNeeded;s++) {
		var segment = preparedSprite(flameWallText)
		segment.anchor.x = 0.5
		segment.anchor.y = 0
		// segment.x = viewWidth-(segment.width/2)
		if (randomInt(0,1)) {
			segment.scale.x *= -1
		}
		segment.y += (s*segment.height)
		this.topHalf.addChild(segment)
	}
	for (var b=0;b<bottomNeeded;b++) {
		var segment = preparedSprite(flameWallText)
		segment.anchor.x = 0.5
		segment.anchor.y = 0
		// segment.x = viewWidth-(segment.width/2)
		if (randomInt(0,1)) {
			segment.scale.x *= -1
		}
		segment.y += (b*segment.height)
		this.bottomHalf.addChild(segment)
	}
	this.topHalf.x = viewWidth-(this.topHalf.width/2)
	this.bottomHalf.x = viewWidth-(this.bottomHalf.width/2)
	this.topHalf.y = gapTop-this.topHalf.height
	this.bottomHalf.y = gapBottom
	this.container.addChild(this.topHalf)
	this.container.addChild(this.bottomHalf)
	stage.addChildAt(this.container,stage.children.indexOf(background.bgZero)+1)
	flameWalls.push(this)
	this.advance = function() {
		this.topHalf.x -= scrollSpeed
		this.bottomHalf.x -= scrollSpeed
		if (counter % randomInt(2,3) === 0) {
			for (var s=0;s< this.topHalf.children.length;s++) {
				var segment = this.topHalf.children[s]
				segment.scale.x *= -1
			}
			for (var b=0;b< this.bottomHalf.children.length;b++) {
				var segment = this.bottomHalf.children[b]
				segment.scale.x *= -1
			}
		}
		if (this.topHalf.x < 0) {
			this.container.visible = false
		}
	}
	this.move = function() {
		this.topHalf.y += this.moveTop
		this.bottomHalf.y += this.moveBottom
		this.gapTop += this.moveTop
		this.gapBottom += this.moveBottom
		if (this.movetop > 0 && this.moveBottom > 0 || this.moveTop < 0 && this.moveBottom < 0) {
			// same direction
			if (this.topHalf.y < -this.topHalf.height) {
				this.moveTop *= -1
				// this.moveBottom *= -1
				this.topHalf.y = -this.topHalf.height
			}
			if (this.gapBottom > (pixelHeight*pixelSize)) {
				// this.moveTop *= -1
				this.moveBottom *= -1
				this.bottomHalf.y = (pixelHeight*pixelSize)
			}
		} else {
			// different directions
			if (this.moveTop && this.moveBottom) {
				// both moving
				if (this.moveTop < 0 && this.moveBottom > 0) {
					// moving apart
					if (this.topHalf.y < -this.topHalf.height) {
						// top offscreen
						this.moveTop *= -1
						this.topHalf.y = -this.topHalf.height
					}
					if (this.bottomHalf.y > (pixelHeight*pixelSize)) {
						// bottom offscreen
						this.moveBottom *= -1
						this.bottomHalf.y = (pixelHeight*pixelSize)
					}
					
				} else if (this.moveTop > 0 && this.moveBottom < 0) {
					// moving together
					if (this.gapBottom-this.gapTop < this.minGap) {
						// too close
						this.moveTop *= -1
						this.moveBottom *= -1
						this.topHalf.y += this.moveTop
						this.bottomHalf.y += this.moveBottom
					}
				}
			} else {
				// one or none moving
				if (!(this.moveTop && this.moveBottom)) {
					// one moving
					if (this.bottomHalf.y-(this.topHalf.y+this.topHalf.height) < this.minGap) {
						// too close
						if (this.moveTop > 0) {
							// top moving
							this.moveTop *= -1
							// this.topHalf.y = this.bottomHalf.y-frog.sprite.height
						}
						if (this.moveBottom < 0) {
							// bottom moving
							this.moveBottom *= -1
							// this.bottomHalf.y = this.topHalf.y+frog.sprite.height
						}
						
						
					}
				}
			}
		}
		
	}
	this.checkForFrog = function() {
		if ((frog.sprite.y < this.gapTop+(frog.sprite.height/2) || frog.sprite.y > this.gapBottom-(frog.sprite.height/2)) && 
		Math.abs(Math.abs(this.topHalf.x)-(frog.sprite.x-(frog.sprite.width/2))) < frog.sprite.width/4) {
			// frog.die()
			scrollSpeed = 0
		}
	}
}