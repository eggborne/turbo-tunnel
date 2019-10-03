function Metroid(posY) {
	this.sprite = preparedSprite(metroidText)
	this.shadow = new PIXI.Sprite(shadowText)
	this.shadow.width = frog.shadow.height*2.65
	this.shadow.height = frog.shadow.height
	this.shadow.x = viewWidth+this.sprite.width/2
	this.shadow.y = (lowestFloor-this.shadow.height*1.25)-(posY*(this.shadow.height*1.8))
	this.shadow.anchor.x = 0.5
	this.sprite.x = this.shadow.x
	this.sprite.y = this.shadow.y-gameHeight/2.4
	this.sprite.anchor.set(0.5)
	this.bobbed = 0
	this.bobMax = this.sprite.height*randomInt(2,4)
	this.lockedOn = false
	this.speed = scrollSpeed/randomInt(5,8)
	this.attachedAt = 0
	this.diedAt = 0
	
	this.bob = function(speed) {
		var previousPoint = pointAtAngle(this.sprite.x,this.sprite.y,degToRad(this.bobbed-1),this.bobMax)
		var bobPoint = pointAtAngle(this.sprite.x,this.sprite.y,degToRad(this.bobbed),this.bobMax)
		var moveAmount = bobPoint.y-previousPoint.y
		this.sprite.y += moveAmount
		this.bobbed += speed
		if (this.bobbed >= 360) {
			this.bobbed -= 360
		}
	}
	
	this.move = function(amountX,amountY) {
		this.sprite.x -= amountX
		this.shadow.x -= amountX
		this.sprite.y -= amountY
		this.shadow.y -= amountY
	}
	
	
	
	enemies.push(this)
	stage.addChild(this.sprite)
	stage.addChildAt(this.shadow,stage.children.indexOf(background.bg1)+1)
}
Metroid.prototype.advance = function() {
	if (!this.lockedOn) {
		this.move(this.speed,0)
		this.move(this.speed,0)
	} else {
		if (!frog.hasMetroid && this.sprite.y < this.shadow.y-this.sprite.height/2) {
			var xDistance = Math.abs(this.shadow.x-frog.shadow.x)
			var yDistance = Math.abs(this.shadow.y-frog.shadow.y)
			var zDistance = frog.sprite.y-this.sprite.y
			this.sprite.y += this.sprite.height/5
			if (xDistance < this.shadow.width && zDistance <= this.sprite.height/2) {
				this.attachedAt = counter
				frog.hasMetroid = true
				
			} else {
				
			}
		} else {
			if (!this.attachedAt) {
				this.move(scrollSpeed,0)
				this.sprite.rotation += degToRad(12)
			} else {
				
			}
		}			
	}
}
Metroid.prototype.checkForFrog = function() {
	if (!frog.hasMetroid) {
		var xDistance = Math.abs(this.shadow.x-frog.shadow.x)
		var yDistance = Math.abs(this.shadow.y-frog.shadow.y)
		if (xDistance < this.shadow.width/4 && yDistance < this.shadow.height) {
			this.lockedOn = true
			this.shadow.visible = false
		}
	}
}
Metroid.prototype.checkForBullets = function() {
	for (var b=0;b<bullets.length;b++) {
		var bullet = bullets[b]
		var xDiff = Math.abs(this.sprite.x-bullet.x)
		var yDiff = Math.abs(this.sprite.y-bullet.y)
		if (bullet.visible && xDiff < this.sprite.width && yDiff < this.sprite.height) {
			this.shadow.visible = false
			this.diedAt = counter
		}
	}
}
Metroid.prototype.correctZLevel = function() {
	if (this.attachedAt || frog.shadow.y <= this.shadow.y) {
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
Metroid.prototype.explode = function() {
	var sinceDied = counter-this.diedAt
	if (sinceDied < 5) {
		this.sprite.tint = 0xff0000
	} else if (sinceDied < 10) {
		this.sprite.tint = 0x00ff00
	} else if (sinceDied < 15) {
		this.sprite.tint = 0x0000ff
	} else {
		this.sprite.visible = false
		this.diedAt = 0
	}
}
function AlienHead() {
	this.sprite = preparedSprite(alienHeadClosedText)
	this.diagSize = Math.sqrt(2)*this.sprite.width*0.8
	this.lastExitedAt = 0
	this.sprite.anchor.set(0)
	this.descendSpeed = this.origDescendSpeed = this.sprite.width/48
	this.retractSpeed = this.sprite.width/32
	this.descendDelay = 60
	this.sprite.y = this.topStart = -this.diagSize/2
	this.duration = this.totalDuration = 0
	this.injuredAt = 0
	this.struck = false
	this.shadow = preparedSprite(shadowText)
	this.shadow.anchor.set(0.5)
	this.shadow.width = this.sprite.width/3
	this.shadow.origWidth = this.shadow.width
	this.shadow.height = this.shadow.width/4
	this.elevation = (this.diagSize*1.2)
	
	this.fireRate = 30
	
	// this.sprite.visible = false
	// this.shadow.visible = false
	
	this.summon = function() {
		
		if (stage.children.indexOf(this.sprite) === -1) {
			stage.addChildAt(this.shadow,stage.children.indexOf(background.bg1)+1)
			stage.addChildAt(this.sprite,stage.children.indexOf(background.bg1)+2)		
		}
		
		
		
	}
	this.correctZLevel = function() {
		if (frog.shadow.y < this.shadow.y+(this.shadow.height/2)) {
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
		if (alienHead.attacking) {
			stage.setChildIndex(this.sprite,stage.children.indexOf(background.bgZero))
		}
	}
	this.checkForBullets = function() {
		for (var b=0;b<bullets.length;b++) {
			var bullet = bullets[b]
			var xDiff = this.sprite.x-bullet.x+(bullet.width/2)
			var yDiff = (this.sprite.y+this.sprite.height)-bullet.y
			if (bullet.visible && xDiff < bullet.width/2 && yDiff < this.sprite.height+(bullet.height/2)) {
				this.sprite.tint = 0xff0000
				this.injuredAt = counter
				bullet.visible = false
			}
		}
	}
	this.checkForFrog = function() {
		var xDistance = Math.abs(frog.shadow.x-this.shadow.x)
		var yDistance = Math.abs(frog.shadow.y-this.shadow.y)
		var zDistance = Math.abs(frog.elevation-this.elevation)
		if (xDistance <= (this.shadow.width/2)+(frog.sprite.width/6) && yDistance <= this.shadow.height/2) {
			frog.sprite.tint = 0x888888
			if (frogCollision && zDistance <= 0) {
				frog.sprite.visible = false
				frog.die("metroid")
			}
		} else {
			if (frog.sprite.tint !== 0xffffff) {
				frog.sprite.tint = 0xffffff
			}
		}
	}
	this.descend = function(posX,posY) {
		// console.log("elev " + Math.round(this.elevation))
		if (this.elevation > 0) {
			var elevPercent = (this.elevation/(this.diagSize*0.6))/2
			if (this.shadow.origWidth*(1-elevPercent) > this.shadow.origWidth*0.4) {
				this.shadow.width = (this.shadow.origWidth)*(1-elevPercent)
				this.shadow.height = this.shadow.width/4
			}
		}
		
		if (this.duration === this.totalDuration) {
			if (this.sprite.texture !== alienHeadOpenText) {
				this.sprite.texture = alienHeadOpenText
			}
			this.sprite.visible = true
			this.shadow.visible = true
			// alienHead.sprite.visible = alienHead.shadow.visible = true
			this.sprite.rotation = -degToRad(45)
			this.sprite.x = posX
			this.shadow.x = this.sprite.x+this.sprite.height/1.475
			// this.shadow.y = lowestFloor-frog.shadow.height-(posY*frog.shadow.height*2)
			this.shadow.y = frog.shadow.y
			this.sprite.y = this.topStart = this.shadow.y-(this.diagSize*1.2)
			this.elevation = (this.diagSize*0.6)
			this.duration--
		} else {
			this.duration--
			if (this.duration < this.totalDuration-this.descendDelay) {
				var floorY = this.shadow.y-(this.diagSize/2)
				if (!this.struck && this.sprite.y < floorY) {
					this.sprite.y += this.descendSpeed
					this.elevation -= this.descendSpeed
				} else if (!this.struck) {
					this.sprite.y = floorY
					this.elevation = 0
					this.struck = true
					this.sprite.texture = alienHeadClosedText
				} else {
					var factor = 1
					if (frog.dead) {
						factor = 0.2
					}
					this.sprite.y -= this.retractSpeed*factor
					this.elevation += this.retractSpeed*factor
					if (this.sprite.y <= this.topStart) {
						this.sprite.y = this.topStart
						this.elevation = (this.diagSize*0.6)
						this.duration = 0
						this.shadow.visible = false
						this.struck = false
						if (frog.sprite.tint === 0x888888) {
							frog.sprite.tint = 0xffffff
						}
						
					}
				}
			}
			
			if (!this.duration) {
				this.lastExitedAt = counter
				this.duration = this.totalDuration
				if (!alienHeadsAttacking) {
					stage.removeChild(this.sprite)
					stage.removeChild(this.shadow)
					console.log("killing final alien")
					this.descending = false
				}
			}
		}
	}
	this.attack = function() {
		if (this.shadow.visible) {
			this.shadow.visible = false
		}
		if (counter % 20 === 0) {
			if (this.sprite.texture !== alienHeadClosedText) {
				this.sprite.texture = alienHeadClosedText
			} else {
				this.sprite.texture = alienHeadOpenText
			}
		}
		if (currentEventDuration === currentMaxDuration) {
			this.sprite.rotation = 0
			this.sprite.visible = true
			this.sprite.x = viewWidth
			this.sprite.y = -this.sprite.height
		}
		
		if (currentEventDuration > currentMaxDuration-45) {
			if (this.sprite.texture !== alienHeadClosedText) {
				this.sprite.texture = alienHeadClosedText
			}
			if (this.sprite.y < -this.sprite.height/2) {
				this.sprite.x -= this.sprite.width/100
				this.sprite.y += this.sprite.width/100
			}
			
		} else if (currentEventDuration < 45) {
			if (this.sprite.texture !== alienHeadClosedText) {
				this.sprite.texture = alienHeadClosedText
			}
			if (this.sprite.y > -this.sprite.height) {
				this.sprite.x += this.sprite.width/100
				this.sprite.y -= this.sprite.width/100
			} else {
				this.attacking = false
				stage.removeChild(this.sprite)
				stage.removeChild(this.shadow)
			}
		} else if (counter % this.fireRate === 0 ) {
			if (this.sprite.texture !== alienHeadOpenText) {
				this.sprite.texture = alienHeadOpenText
			}
			new Floater(randomInt(0,2))
			
		}
	}
	// stage.addChild(this.sprite)
}
function Floater(posY) {
	this.sprite = preparedSprite(floaterClosedText)
	this.sprite.anchor.set(0.5)
	this.sprite.x = alienHead.sprite.x + this.sprite.width*1.35
	this.sprite.y = alienHead.sprite.y+alienHead.sprite.height/1.25
	this.sprite.rotation = degToRad(randomInt(0,359))
	this.shadow = new PIXI.Sprite(shadowText)
	this.shadow.width = frog.shadow.width
	this.shadow.height = frog.shadow.height
	this.shadow.x = this.sprite.x
	this.shadow.y = (lowestFloor-this.shadow.height*1.25)-(posY*(this.shadow.height*1.8))
	this.shadow.anchor.x = 0.5
	this.elevation = this.shadow.y-this.sprite.y
	this.diedAt = 0
	stage.addChildAt(this.shadow,stage.children.indexOf(background.bg1)+1)
	stage.addChildAt(this.sprite,stage.children.indexOf(alienHead.sprite)-1)
	enemies.push(this)
	
}
Floater.prototype.checkForFrog = function() {
	
	var xDistance = Math.abs(this.shadow.x-frog.shadow.x)
	var yDistance = Math.abs(this.shadow.y-frog.shadow.y)
	if (!frog.offGround && xDistance < this.shadow.width*1.75 && yDistance < this.shadow.height) {
		// frog.jump(0.5)
		// frog.knocked = true
		
		frog.sprite.x -= frog.velocity.x
		frog.die(shortWidePillarText)
		frog.flyingCorpse.visible = true
		frog.flyingCorpse.x = frog.sprite.x
		frog.flyingCorpse.y = frog.sprite.y-frog.sprite.height/3
		this.diedAt = counter
		this.shadow.visible = false
		if (stage.children.indexOf(this.sprite) > stage.children.indexOf(frog.sprite)) {	
			// frog.velocity.y -= frog.sprite.height/3
		} else {
			// frog.velocity.y += frog.sprite.height/3
		}
	} else {
		// frog.sprite.tint = 0xffffff
	}
	if (frog.attached) {
		if (frog.offGround && (xDistance < this.shadow.width && (this.sprite.y-frog.sprite.y) < (frog.attached.sprite.height/2))) {
			// frog.jump(1.4)
			this.sprite.tint = 0xff0000
		}
	}
}
Floater.prototype.advance = function() {
	if (counter % 6 === 0) {
		if (this.sprite.texture !== floaterClosedText) {
			this.sprite.texture = floaterClosedText
		} else {
			this.sprite.texture = floaterOpenText
		}
	}
	
	if (this.elevation > this.sprite.height/2.5) {
		this.move(-this.sprite.width/12,this.sprite.width/12)
		this.sprite.rotation += degToRad(6)
	} else {
		this.move(-this.sprite.width/8,0)
		this.sprite.rotation += degToRad(18)
	}
	if (this.sprite.x < -this.sprite.width/2) {
		this.sprite.visible = false
	}
	
}
Floater.prototype.move = function(amountX,amountY) {
	this.sprite.x += amountX
	this.shadow.x += amountX
	this.sprite.y += amountY
	this.elevation -= amountY
	
}
Floater.prototype.bob = function() {
	
}
Floater.prototype.correctZLevel = function() {
	if (this.sprite.y > alienHead.sprite.y+alienHead.sprite.height) {
		if (frog.shadow.y <= this.shadow.y) {
			if (stage.children.indexOf(this.sprite) < stage.children.indexOf(frog.sprite)) {
				stage.setChildIndex(this.sprite,stage.children.indexOf(frog.sprite)+1)
			}
		} else {
			if (stage.children.indexOf(this.sprite) > stage.children.indexOf(frog.sprite)) {
				stage.setChildIndex(this.sprite,stage.children.indexOf(frog.sprite)-1)
			}
		}
	}
}
Floater.prototype.checkForBullets = function() {
	for (var b=0;b<bullets.length;b++) {
		var bullet = bullets[b]
		var xDiff = Math.abs(this.sprite.x-bullet.x)
		var yDiff = Math.abs(this.sprite.y-bullet.y)
		if (bullet.visible && xDiff < this.sprite.width && yDiff < this.sprite.height) {
			this.diedAt = counter
			this.shadow.visible = false
			// this.sprite.texture = explosion1Text
			bullet.visible = false
		}
	}
}
Floater.prototype.explode = function() {
	var sinceDied = counter-this.diedAt
	// if (sinceDied < 10) {
		// console.log("exploding")
		// this.sprite.width += 2
	// }
	if (sinceDied < 3) {
		this.sprite.tint = 0xff0000
	} else if (sinceDied < 6) {
		this.sprite.tint = 0x00ff00
	} else if (sinceDied < 9) {
		this.sprite.tint = 0x0000ff
	} else {
		this.sprite.visible = false
		this.diedAt = 0
	}
}

function Tyson() {
	this.textureSheet = tysonSheet
	this.currentColumn = 0
	this.currentRow = 0
    this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*60,this.currentRow*120,60,120)
	this.punching = undefined
	this.punchSpeed = 30
	this.moveSpeed = frog.sprite.width/72
	this.punchedAt = 0
	this.direction = 1
	this.activated = false
	this.entered = false
	this.sprite = new PIXI.Sprite(this.textureSheet)
    this.spriteHW = this.sprite.height/this.sprite.width
	this.sprite.height = viewHeight*(this.sprite.height/pixelHeight)
	this.sprite.width = this.sprite.height/this.spriteHW
	this.sprite.width = Math.round(this.sprite.width)
	this.sprite.height = Math.round(this.sprite.height)
	this.sprite.anchor.x = 0.5
	this.sprite.anchor.y = 0
	this.sprite.x = viewWidth+this.sprite.width/2
	this.sprite.y = gameHeight/2-(this.sprite.height/1.9)
	this.landedPunchAt = 0
	this.tauntStartedAt = 0
	this.taunted = false
	this.duration = this.maxDuration = 1600
	this.lastAppeared = 0
	this.sprite.visible = false
	this.dead = false

	this.activate = function() {
		stage.addChildAt(this.sprite,stage.children.indexOf(background.bg1)-1)
        this.sprite.visible = true
	}
	
	this.reset = function() {
		this.currentColumn = 0
		this.currentRow = 0
		stage.removeChild(this.sprite)
		this.sprite.x = viewWidth+this.sprite.width/2
		this.landedPunchAt = 0
		this.punchedAt = 0
		this.direction = 1
		this.activated = false
		this.entered = false
		this.taunted = false
		this.tauntStartedAt = 0
		this.duration = this.maxDuration
		this.lastAppeared = counter
		
	}
	this.changeFrame = function(column,row) {
		this.currentColumn = column
		this.currentRow = row
		this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*60, this.currentRow*120, 60, 120)
	
	}
	this.enter = function() {
		
		if (!this.taunted && !this.tauntStartedAt && this.sprite.x < viewWidth/1.9) {
			this.sprite.x = viewWidth/1.9
			this.tauntStartedAt = counter
			this.taunted = true
		}
		if (this.tauntStartedAt) {
			// this.taunt(80)
		} else {
			this.sprite.x -= this.sprite.height/64
		}
		if (!this.tauntStartedAt && !this.entered && Math.abs(this.sprite.x-frog.shadow.x) < frog.sprite.width/2) {
			this.entered = true
		}
		
	}
	this.exit = function() {
		this.sprite.x -= this.sprite.height/64
		if (this.sprite.x <= -this.sprite.width) {
			this.reset()
			this.dead = true
		}
	}
	this.taunt = function(flexes) {
		var sinceStarted = counter-this.tauntStartedAt
		if (sinceStarted === 0) {
			this.changeFrame(2,2)
		} else {
			if (sinceStarted % Math.floor(flexes/6) === 0) {
				if (this.currentRow === 2)
					this.changeFrame(2,3)
				else {
					this.changeFrame(2,2)
				}
			} 
			if (!frog.dead && sinceStarted === flexes+1) {
				this.changeFrame(0,0)
				this.tauntStartedAt = 0
				if (!this.entered) {
					this.entered = true
				}
			}
		}
	}
	
	this.run = function(speed) {
		if (counter % speed === 0) {
			if (this.currentRow < 3) {
				this.currentRow++
			} else {
				this.currentRow = 0
			}
			this.changeFrame(this.currentColumn,this.currentRow)
		}
	}
	this.switchGuard = function(speed) {
		if (counter % speed === 0) {
			if (this.currentColumn === 0) {				
				this.currentColumn = 1		
			} else if (this.currentColumn === 1) {
				this.currentColumn = 0
				var frogDistance = {x:Math.abs(frog.shadow.x-this.sprite.x),y:(frog.shadow.y-this.sprite.y)}
				if (frogDistance.x < frog.sprite.width && frog.shadow.y < lowestFloor-background.floorBreadth*(2/3) && !frog.dead && !this.tauntStartedAt) {
					this.throwPunch(0)
				}
				
			}
			this.changeFrame(this.currentColumn,this.currentRow)
		}
	}
	this.checkForFrog = function() {
		if (this.currentPunch.type === "jab") {
			var xDistance = Math.abs(frog.shadow.x-this.sprite.x)
			if (counter-this.punchedAt < 3 && !this.landedPunchAt && xDistance < (frog.sprite.width/2) && 
			frog.elevation < frog.sprite.height/2 && 
			frog.shadow.y < lowestFloor-background.floorBreadth*(2/3)) {
				frog.sprite.tint = 0xff0000
				frog.velocity.y = frog.speed*1.3
				this.landedPunchAt = counter
				this.duration = this.maxDuration
				frog.knockedAt = counter
				if (pressingDirections.indexOf("up") > -1) {
					pressingDirections.splice(pressingDirections.indexOf("up"),1)
				}
				var stars = new Splash(frog.sprite.x-frog.sprite.width/2,frog.sprite.y,frog.sprite.height/5,frog.sprite.height/32,starText,16,0.05)
				stage.setChildIndex(stars.container,stage.children.indexOf(frog.sprite)-1)
			}
		}
		if (this.currentPunch.type === "uppercut") {
			if (frog.elevation < frog.sprite.height*1.5 && frog.shadow.y < lowestFloor-background.floorBreadth/2) {
				frog.sprite.tint = 0xff0000
				// frog.velocity.y = frog.speed/2
				frog.jump(0.5)
				this.landedPunchAt = counter
			}
		}
	}
	this.throwPunch = function(type) {
		if (randomInt(0,1)) {
			this.sprite.scale.x *= -1
		}
		this.currentPunch = this.punches[type]
		this.punchedAt = counter
		if (this.currentPunch.type === "jab") {
			this.changeFrame(2,0)
		}
		if (this.currentPunch.type === "uppercut") {
			this.changeFrame(2,1)
		}
	}
	this.patrol = function(speed) {
		var distance = this.sprite.x-frog.shadow.x
		var potentialSpot = this.sprite.x+(this.moveSpeed*this.direction)
		var leftLimit = frog.sprite.x-frog.sprite.width*2
		var rightLimit = frog.sprite.x+frog.sprite.width*2
		if (leftLimit < frog.sprite.width/2) {
			leftLimit = frog.sprite.width/2
		}
		if (rightLimit > viewWidth-(frog.sprite.width/2)) {
			rightLimit = viewWidth-(frog.sprite.width/2)
		}
		if (potentialSpot < leftLimit) {
			potentialSpot = leftLimit
			this.direction *= -1
		} else if (potentialSpot > rightLimit) {
			potentialSpot = rightLimit
			this.direction *= -1
		} else {
			
		}
		if (Math.abs(distance) > frog.sprite.width/2) {
			if (distance < 0) {
				this.direction = 1
			} else {
				this.direction = -1
			}
			potentialSpot = this.sprite.x+(this.moveSpeed*this.direction)
		}
		this.sprite.x = potentialSpot
		if (counter % 30 === 0 && !randomInt(0,1)) {
			this.direction *= -1
		}
	}
	this.punches = [
		{"type":"jab","duration":15},
		{"type":"uppercut","duration":30}
	]
	this.currentPunch = undefined
	stage.addChildAt(this.sprite,stage.children.indexOf(background.bg1)-1)
}
function Triclyde() {
	this.textureSheet = triclydeSheet
	this.currentColumn = 0
	this.currentRow = 0
    this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*40,this.currentRow*48,40,48)
	this.activated = false
	this.sprite = new preparedSprite(this.textureSheet)
	this.sprite.x = viewWidth/2
	this.sprite.y = this.sprite.height
	this.carpet = new FlyingCarpet(this)
	this.carpet.sprite.x += this.sprite.width/4
	this.activate = function() {
		this.activated = true
		stage.addChild(this.carpet.sprite)
		stage.addChild(this.sprite)
	}
	this.dance = function(speed) {
		if (counter % speed === 0) {
			
			this.changeFrame(this.currentColumn,this.currentRow)
			this.currentColumn++
			if (this.currentColumn === (1320/40)) {
				this.currentColumn = 0
			}
		}
	}
	this.changeFrame = function(column,row) {
		this.currentColumn = column
		this.currentRow = row
		this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*40,this.currentRow*48,40,48)
	}
}
function Toad() {
	this.textureSheet = toadSheet
	this.currentColumn = 0
	this.currentRow = 0
    this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*16,this.currentRow*20,16,20)
	this.sprite = new preparedSprite(this.textureSheet)
	this.sprite.anchor.x = 1
	this.sprite.anchor.y = 1
	this.attachSpot = {}
	this.sprite.x = frog.sprite.x
	// this.sprite.y = frog.sprite.y+(this.sprite.height/4)
	this.sprite.y = 0
	this.attachSpot.x = 0
	this.attachSpot.y = 0
	this.lastThrown = 0
	this.throwing = false
	this.threwAt = 0
	this.carrying = undefined
	frog.attached = this
	stage.addChild(this.sprite)

	this.landOnFrog = function() {
		this.sprite.x = frog.sprite.x
		if (this.sprite.y+(this.sprite.height/3) < frog.sprite.y+(this.sprite.height/4)) {
			this.sprite.y += this.sprite.height/3
		} else {
			this.sprite.y = frog.sprite.y+(this.sprite.height/4)
		}
	}
	this.flyOff = function() {
		this.sprite.x -= this.sprite.width/2
		this.sprite.y -= this.sprite.height/2
		if (this.sprite.y < 0) {
			this.sprite.visible = false
		}
	}
	
	this.throwCarrying = function() {
		if (controlPanel) {
			controlPanel.duckLabel.text = "DUCK"
			controlPanel.duckLabel.tint = 0x888888
		}
		this.carrying.velocity.x = this.sprite.width/4
		this.carrying.velocity.y = this.sprite.width/4
		this.carrying = undefined
		this.threwAt = counter
		this.currentColumn = 1
		this.changeFrame(frog.attached.currentColumn,frog.attached.currentRow)
	}
	
	this.changeFrame = function(column,row) {
		this.currentColumn = column
		this.currentRow = row
		this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*16,this.currentRow*20,16,20)
	}
}
function Wart() {
	this.textureSheet = wartSheet
	this.currentColumn = 0
	this.currentRow = 0
    this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*48,this.currentRow*48,48,48)
	this.activated = false
	this.sprite = new preparedSprite(this.textureSheet)
	this.sprite.x = viewWidth
	this.sprite.y = lowestFloor-background.floorBreadth/2
	this.homeX = viewWidth-this.sprite.width*1.25
	this.stepping = "left"
	this.direction = 0
	this.lane = 1
	this.fireRate = 30
	this.spewing = "bubbles"
	this.injuredAt = 0
	this.hit = 0
	this.hitsToKill = 3
	this.dead = false
	this.reset = function() {
		this.sprite.x = viewWidth
		stage.removeChild(this.sprite)
		this.activated = false
	}
	this.activate = function() {
		this.dead = false
		this.activated = true
		currentEventDuration = currentMaxDuration = 1000
		stage.addChild(this.sprite)
	}
	this.exit = function() {
		if (this.sprite.x < viewWidth) {
			this.sprite.x += this.sprite.width/16
		} else {
			this.dead = true
			// this.die()
			// this.sprite.visible = false
		}
	}
	this.walk = function(speed) {
		if (counter % speed === 0) {
			// if (this.currentColumn === 0) {
				if (this.stepping === "left") {
					this.currentColumn = 1
					this.stepping = "right"
				} else {
					this.currentColumn = 2
					this.stepping = "left"
				}
			// } else {
				// this.currentColumn = 0
			// }
			this.changeFrame(this.currentColumn,this.currentRow)
			// this.currentColumn++
			// if (this.currentColumn === 3) {
				// this.currentColumn = 0
			// }
		}
		if (this.currentRow !== 2 && counter % 20 === 0) {
			this.currentRow = randomInt(0,1)
		}
		if (!this.injuredAt && this.currentRow === 1) {
			if (counter % this.fireRate === 0) {
				this.spew()
			}
		} else {
			if (counter % 120 === 0) {
				if (this.spewing === "bubbles") {
					this.spewing = "bombs"
					this.fireRate = 40
				} else if (randomInt(0,1) && this.spewing === "bombs") {
					this.spewing = "bubbles"
					this.fireRate = 30
				}
			}
		}
	}
	this.patrol = function(speed) {
		if (this.sprite.y+(speed*this.direction) > highestFloor+frog.shadow.height && this.sprite.y+(speed*this.direction) < lowestFloor-frog.shadow.height/2) {
			this.sprite.y += speed*this.direction
			
		}
		if (this.hit < this.hitsToKill && counter % 20 === 0) {
			this.direction = randomInt(-1,1)
		}
		
	}
	this.spew = function(forceX,forceY) {
		if (this.spewing === "bubbles") {
			var bubble = new Bubble(this,bubbleSheet,-this.sprite.width/12,this.sprite.width/14)
		} else if (this.spewing === "bombs") {
			var bubble = new Bubble(this,bombSheet,-this.sprite.width/randomInt(18,30),this.sprite.width/9)
			bubble.shadow.width *= 1.25
			bubble.shadow.width *= 1.5
			bubble.gravityPower *= 0.2
		}
	}
	this.die = function() {
		
		if (counter % 10 === 0) {
			// this.currentRow = randomInt(0,2)
			// this.changeFrame(this.currentColumn,this.currentRow)
		}
		if (counter === this.injuredAt+1) {
			
		}
		if (counter-this.injuredAt === 60) {
			this.dead = true
			stage.setChildIndex(wart.sprite,stage.children.indexOf(background.bg1)+1)
			
		}
		if (counter-this.injuredAt > 120) {
			
			this.sprite.y += this.sprite.height/10
			if (this.sprite.y > gameHeight+this.sprite.height) {
				this.activated = false
				this.sprite.visible = false
			}
		} else {
			this.patrol(this.sprite.height/50)
		}
	}
	this.changeFrame = function(column,row) {
		this.currentColumn = column
		this.currentRow = row
		this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*48,this.currentRow*48,48,48)
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
}
function Bubble(owner,sheet,forceX,forceY) {
	this.textureSheet = sheet
	this.pulseSpeed = 10
	if (sheet === bombSheet) {
		this.pulseSpeed = 4
	}
	this.currentColumn = 0
	this.currentRow = 0
	this.elevation = 0
    this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*16,this.currentRow*16,16,16)
	this.sprite = new preparedSprite(this.textureSheet)
	this.gravityPower = this.sprite.width/24
	this.numOfFrames = this.textureSheet.baseTexture.realWidth/16
	this.sprite.anchor.x = 0.5
	this.sprite.anchor.y = 1
	this.shadow = preparedSprite(shadowText)
	this.shadow.anchor.set(0.5)
	this.shadow.height = frog.shadow.height*0.9
	this.shadow.width = this.shadow.height*2
	this.sprite.x = owner.sprite.x+owner.sprite.width/1.8
	this.sprite.y = owner.sprite.y-owner.sprite.height*0.55
	this.elevation = wart.sprite.y-this.sprite.y
	this.shadow.x = this.sprite.x
	this.shadow.y = this.sprite.y+this.elevation
	this.landed = 0
	this.moveSpeed = this.sprite.width/3
	this.velocity = {}
	this.velocity.x = forceX
	this.velocity.y = forceY
	this.explosion = undefined
	this.explodedAt = 0
	this.caught = false
	
	this.fly = function() {
		this.sprite.x += this.velocity.x
		this.shadow.x += this.velocity.x
		this.sprite.y -= this.velocity.y
		this.elevation += this.velocity.y
		if (this.sprite.y > this.shadow.y) {
			if (this.textureSheet === bubbleSheet) {
				this.landed++
				this.velocity.y = forceY*2/(1+(this.landed/4))
			}
			if (!this.caught && this.textureSheet === bombSheet) {
				this.explode()
			}
		}
		
		if (this.velocity.x * 0.99 > 0) {
			this.velocity.x *= 0.99
		}
		this.velocity.y -= this.gravityPower
		if (this.caught) {
			this.checkForWart()
		}
	}
	this.pulse = function() {
		if (counter % this.pulseSpeed === 0) {
			if (this.currentColumn < this.numOfFrames-1) {
				this.currentColumn++
			} else {
				this.currentColumn = 0
			}
			this.changeFrame(this.currentColumn,this.currentRow)
		}
	}
	this.explode = function() {
		this.explodedAt = counter
		this.sprite.visible = false
		this.shadow.visible = false
		
		this.explosion = preparedSprite(bombExplosionText)
		this.explosion.anchor.set(0.5)
		this.explosion.x = this.sprite.x
		this.explosion.y = this.sprite.y-this.sprite.height/1.5
		this.explosion.origScale = this.explosion.scale.x
		// this.shadow.width = this.explosion.width
		// this.shadow.height = this.explosion.width
		this.explosion.scale.x *= 0.4
		this.explosion.scale.y *= 0.4
		stage.addChild(this.explosion)
		
	}
	this.animateExplosion = function() {
		this.explosion.x -= scrollSpeed
		this.shadow.x -= scrollSpeed
		if (counter-this.explodedAt < 15) {
			if (Math.abs(this.explosion.scale.x*1.1) < this.explosion.origScale) {
				this.explosion.scale.x *= 1.5
				this.explosion.scale.y *= 1.5
			} else {
				this.explosion.scale.x = this.explosion.scale.y = this.explosion.origScale
			}
			if ((counter-this.explodedAt) % 3 === 0) {
				this.explosion.tint = 0xff0000
				// this.explosion.scale.x *= -1
			} else {
				this.explosion.tint = 0xffffff
			}
		} else {
		
			this.explosion.scale.x -= 0.5
			this.explosion.scale.y -= 0.5
			if (this.explosion.scale.x < 0) {
				this.explosion.visible = false
			}
			
		}
	}
	this.checkForFrog = function() {
	
		var xDistance = Math.abs(this.shadow.x-frog.shadow.x)
		var yDistance = Math.abs(this.shadow.y-frog.shadow.y)
		var zDistance = this.elevation-frog.elevation
		if ((this.textureSheet !== bombSheet || this.explosion) && !frog.offGround && xDistance < this.shadow.width/2 && yDistance < frog.shadow.height) {
			
			frog.sprite.x -= frog.velocity.x
			frog.die(shortWidePillarText)
			frog.flyingCorpse.visible = true
			frog.flyingCorpse.x = frog.sprite.x
			frog.flyingCorpse.y = frog.sprite.y-frog.sprite.height/3
			this.diedAt = counter
			this.shadow.visible = false
		}
		if (this.textureSheet === bombSheet) {
			if (xDistance < frog.sprite.width/2 && yDistance < frog.shadow.height && zDistance < frog.sprite.height) {
				this.caught = true
				if (controlPanel) {
					controlPanel.duckLabel.text = "THROW"
					controlPanel.duckLabel.tint = 0xffffff
				}
				this.sprite.x = frog.sprite.x-(frog.attached.sprite.width/2)
				this.sprite.y = frog.attached.sprite.y-(frog.attached.sprite.height)
				
				frog.attached.carrying = this
				frog.attached.carrying.shadow.x = frog.attached.carrying.sprite.x
			}
		}
	}
	this.checkForWart = function() {		
		var xDistance = wart.sprite.x-this.shadow.x
		var yDistance = wart.sprite.y
		var zDistance = this.elevation
		if (!wart.injuredAt && xDistance < this.sprite.width/2 && zDistance < wart.sprite.height*0.7) {
			if (wart.currentRow === 1) {
				this.sprite.visible = false
				wart.currentRow = 2
				wart.changeFrame(wart.currentColumn,wart.currentRow)
				wart.injuredAt = counter
				wart.hit++
				if (wart.hit === wart.hitsToKill) {
					wart.direction = -1
				}
			} else {
				this.velocity.x = -this.sprite.width/12
				this.velocity.y = this.sprite.width/4
			}
		}
	}
	
	this.changeFrame = function(column,row) {
		this.currentColumn = column
		this.currentRow = row
		this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*16,this.currentRow*16,16,16)
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
	bubbles.push(this)
	stage.addChildAt(this.shadow,stage.children.indexOf(background.bg1)+1)
	stage.addChild(this.sprite)
}
function FlyingCarpet(owner) {
	this.textureSheet = carpetSheet
	this.currentColumn = 0
	this.currentRow = 0
    this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*32,this.currentRow*8,32,8)
	this.moveSpeed = frog.sprite.width/48
	this.sprite = new preparedSprite(this.textureSheet)
	this.sprite.x = owner.sprite.x
	this.sprite.y = owner.sprite.y+this.sprite.height
	this.flap = function() {
		if (counter % 8 === 0) {
			
			this.changeFrame(0,this.currentRow)
			this.currentRow++
			if (this.currentRow === 3) {
				this.currentRow = 0
			}
		}
	}
	this.changeFrame = function(column,row) {
		this.currentColumn = column
		this.currentRow = row
		this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*32,this.currentRow*8,32,8)
	}
	
}
function Fireball() {
	this.sprite = preparedSprite(fireballText)
	this.sprite.anchor.set(0.5)
	this.sprite.x = viewWidth/2
	this.sprite.y = gameHeight+this.sprite.height/2
	this.sprite.rotation = degToRad(randomInt(0,359))
	this.flySpeed = this.sprite.height/4
	this.shadow = preparedSprite(shadowText)
	this.shadow.width = this.sprite.width*1.5
	this.shadow.height = this.sprite.width*1.5
	this.shadow.anchor.set(0.5)
	this.shadow.x = this.sprite.x
	this.elevation = -(gameHeight-lowestFloor)
	this.velocity = {}
	this.velocity.x = 0
	this.velocity.y = this.sprite.height*1.35
	this.velocity.y = this.sprite.height*1.35
	this.shadow.y = lowestFloor
	fireballs.push(this)
	stage.addChildAt(this.shadow,stage.children.indexOf(background.bg1)+1)
	stage.addChildAt(this.sprite,stage.children.indexOf(background.bgZero)-1)
	this.fly = function() {
		this.sprite.y -= this.velocity.y
		this.elevation += this.velocity.y
		
		this.sprite.x -= scrollSpeed/3
		this.sprite.rotation += degToRad(20)
		this.shadow.x = this.sprite.x
		if (this.elevation > 0) {
			this.shadow.y = lowestFloor+(lowestFloor-this.elevation)
		} else {
			this.shadow.y = 23
		}
		
		this.velocity.y -= this.sprite.height/12
		if (this.sprite.y <= highestFloor) {
			stage.setChildIndex(this.sprite,stage.children.indexOf(background.bg1)-1)
		}
		// console.log("elev " + Math.round(this.elevation))
	}
	
}
	

	