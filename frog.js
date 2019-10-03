function Frog(vehicle) {
	this.vehicle = vehicle
	if (vehicle === "bike") {
		neutralFrogText = neutralFrogText
		this.offGround = false
	} else if (vehicle === "rocketPlane") {
		neutralFrogText = frogRocketText
		crashedBikeText = crashedRocketText
		bikeText = rocketPlaneText
		this.offGround = true
		currentGapSize = 99
	}
	this.sprite = new PIXI.Sprite(neutralFrogText)
	this.spriteHW = this.sprite.height/this.sprite.width
	this.sprite.height = viewHeight*(this.sprite.height/pixelHeight)
	this.sprite.width = this.sprite.height/this.spriteHW
	this.sprite.width = Math.round(this.sprite.width)
	this.sprite.height = Math.round(this.sprite.height)
	// this.sprite.width *= pixelSize
  // this.sprite.height *= pixelSize
	this.sprite.anchor.x = 1
	this.sprite.anchor.y = 0.5
	this.sprite.x = this.sprite.width*1.5
	this.sprite.y = highestFloor
	this.velocity = {x:0,y:0,z:0}
	this.speed = this.sprite.width/18
	this.dead = false
	this.diedAt = -99
	this.landedAt = 0
	this.ducking = false
	this.bobRate = 10
	this.killedBy = undefined
	this.fell = false
	this.terminalZ = -this.sprite.height/8
	this.attached = undefined
	
	this.carrying = undefined
	this.flyingCorpse = new PIXI.Sprite(flungFrogText)
	this.corpse = new PIXI.Sprite(crashedFrogText)
	this.corpse.anchor.x = 1
	this.corpse.anchor.y = 0.5
	this.corpseHW = this.corpse.height/this.corpse.width
	this.corpse.height = viewHeight*(this.corpse.height/pixelHeight)
	this.corpse.width = this.corpse.height/this.corpseHW
	
	this.flyingCorpse.anchor.x = 1
	this.flyingCorpse.anchor.y = 0.5
	this.flyingCorpseHW = this.flyingCorpse.height/this.flyingCorpse.width
	this.flyingCorpse.height = viewHeight*(this.flyingCorpse.height/pixelHeight)
	this.flyingCorpse.width = this.flyingCorpse.height/this.flyingCorpseHW
	
	this.caughtSprite = preparedSprite(frogCaughtText)
	this.caughtSprite.rotation += degToRad(10)
	this.caughtSprite.visible = false
	this.caughtSprite.anchor.x = 1
	this.caughtSprite.anchor.y = 0.5
	stage.addChild(this.caughtSprite)
	
	this.bobPosition = 0
	this.bobbed = 45
	
	this.elevation = 0
	this.lastElevation = this.elevation
	this.lastPosition = {x:0,y:0}
	this.hasMetroid = false
	this.jumpApex = 0
	this.headBumped = false
	this.knockedAt = 0
	
	this.shadow = new PIXI.Sprite(shadowText)
	this.shadow.anchor.x = 0.5
	
	if (!snes) {
		this.shadow.width = this.sprite.width/3
		this.shadow.height = this.shadow.width/2.65
		this.shadow.origScale = this.shadow.scale.x
		this.shadow.origWidth = this.shadow.width
		this.shadow.x = this.sprite.x-(this.sprite.width/2)+(this.shadow.width/4)
	} else {
		this.shadow.width = this.sprite.width/4
		this.shadow.height = this.shadow.width/2.65
		this.shadow.origScale = this.shadow.scale.x
		this.shadow.origWidth = this.shadow.width
		this.shadow.x = this.sprite.x-(this.sprite.width/3)
	}
	this.shadow.y = this.sprite.y+(this.sprite.height/2.5)
	
	this.baseElevation = this.shadow.y-this.sprite.y
	if (this.vehicle === "bike") {
		stage.addChildAt(this.shadow,stage.children.indexOf(background.bg1)+1)
	}
	stage.addChild(this.sprite)
	if (this.vehicle === "rocketPlane") {
		stage.setChildIndex(this.sprite,stage.children.indexOf(background.bgZero))
	}
	
	stage.addChild(this.corpse)
	stage.addChild(this.flyingCorpse)
	this.corpse.visible = false
	this.flyingCorpse.visible = false
	this.deathImpact = undefined
	
	this.destruct = function() {
		stage.removeChild(this.sprite)
		stage.removeChild(this.shadow)
		stage.removeChild(this.corpse)
		stage.removeChild(this.flyingCorpse)
		stage.removeChild(this.caughtSprite)
	}
	
	this.jump = function(factor) {
		this.offGround = true
		this.sprite.texture = frogJumpingUpText
		// this.sprite.y = this.shadow.y-this.baseElevation
		if (this.attached) {
			this.attached.sprite.y = frog.sprite.y
			if (this.attached.carrying) {
				this.attached.carrying.sprite.y = frog.attached.sprite.y-frog.attached.sprite.height
			}
		}
		this.velocity.z = (this.sprite.height/8.5)*factor	
	}
	this.duckY = function() {
		return this.shadow.y-(this.sprite.height/2)+(this.shadow.height*0.8)
	}
	
		
	this.startDucking = function() {
		if (this.attached && this.attached.carrying) {
			this.attached.throwCarrying()
		} else {
			if (!this.dead) {
				this.bobbed = 90
				this.ducking = true
			} else {
				$('#nameentry').fadeOut('fast')
				if (this.dead && counter-this.diedAt > 5) {
					titleScreen.container.visible = true
					playerResetAt = 0
					clearSplashes()
					resetGame()
					titleScreen.resetTitles()
					if (musicOn) {
						music.stop()
					}
				}
			}
		}
	}
	this.die = function(killer) {
		// if (gameMessage.activated) {
			// gameMessage.reset()
		// }
		this.sprite.tint = 0xffffff
		if (killer) {
			this.shadow.visible = false
			lastScrollSpeed = Math.round(scrollSpeed)
			if (killer === pillarText || killer === shortPillarText || killer === shortWidePillarText) {
				var newText = crashedBikeText
			} else if (killer === highWidePillarText) {
				var newText = bikeText
			} else if (killer === "metroid") {
				var newText = frogCaughtText
				// new Splash(this.caughtSprite.x-this.caughtSprite.width/2,this.caughtSprite.y,this.caughtSprite.height/8,this.caughtSprite.height/18,sphereText,8,0.01)
			} else {
				newText = neutralFrogText
				new Splash(this.sprite.x-this.sprite.width/2,this.sprite.y,this.sprite.height/8,this.sprite.height/18,sphereText,8,0.018,0.05)
			}
			this.sprite.texture = newText
		}
		// if (tyson && counter <= tyson.landedPunchAt+60) {
		// 	tyson.tauntStartedAt = counter
		// }	
		scrollSpeed = 0
		this.dead = true
		this.diedAt = counter
		sendDeadFrogToDatabase(gameName)
		getScoresFromDatabase(gameName,true)

	}
	
	this.animateDeath = function() {
		var sinceDied = counter-this.diedAt
		if (sinceDied === 1) {
			if (soundOn) {
				impactSound.play()
			}
		}
		if (this.corpse.visible) {
			if (sinceDied > 15) {
				var fallAmount = (this.corpse.height/1000)*(sinceDied)
				if (this.corpse.y+fallAmount <= viewHeight-(this.corpse.height/2)) {
					var fallAmount = (this.corpse.height/1000)*(sinceDied)
					this.corpse.y += fallAmount
				}  else {
					this.corpse.visible = false
					new Splash(this.corpse.x-this.corpse.width/2,this.corpse.y,this.corpse.height/8,this.corpse.height/18,sphereText,8,0.05)
				}
			}
			if (this.sprite.texture === bikeText) {
				this.sprite.x += lastScrollSpeed
				if (this.sprite.x > viewWidth) {
					this.sprite.texture = crashedBikeText
					this.sprite.x = viewWidth
				}
			}
		} else {
			this.flyingCorpse.x += lastScrollSpeed/2
			if (sinceDied < 24) {
				this.flyingCorpse.y -= (this.flyingCorpse.height/24)
			} else {
				if (this.flyingCorpse.visible && this.flyingCorpse.x > viewWidth) {
					this.flyingCorpse.visible = false
					this.corpse.visible = true
					this.corpse.x = viewWidth
					this.corpse.y = this.flyingCorpse.y
				} else {
					this.flyingCorpse.y += (this.flyingCorpse.height/1000)*(sinceDied)
					
				}
				
			}
		}
		if (sinceDied > 60 && this.sprite.texture === crashedBikeText) {
			var fallAmount = (this.sprite.height/1000)*(sinceDied/3)
			if (this.sprite.y+fallAmount < viewHeight-(this.sprite.height/2)) {
				var fallAmount = (this.corpse.height/1000)*(sinceDied)
				this.sprite.y += fallAmount
			} else if (this.sprite.visible) {
				this.sprite.visible = false
				new Splash(this.sprite.x-this.sprite.width/2,this.sprite.y,frog.sprite.height/8,frog.sprite.height/18,sphereText,8,0.05)
			}
			
		}
	}	
	this.move = function(amountX,amountY) {
		if (this.ducking) {
			amountX *= 0.5
			amountY *= 0.5
		}
		if (this.vehicle === "bike") {
			var yLimit = {min:highestFloor,max:lowestFloor-this.shadow.height/2}
			if (this.shadow.y+amountY < yLimit.min) {
				amountY = 0
				this.velocity.y = 0
			}
			if (this.shadow.y+amountY > yLimit.max)  {
				amountY = 0
				this.velocity.y = 0
			}	
		}
		if (this.vehicle === "rocketPlane") {
			var yLimit = {min:this.sprite.height*0.75,max:gameHeight}
			if (this.overGround()) {
				yLimit.y = lowestFloor
			}
			if (this.shadow.y+amountY < yLimit.min) {
				amountY = 0
				this.velocity.y = 0
			}
			if (this.shadow.y+amountY > yLimit.max)  {
				amountY = 0
				this.velocity.y = 0
			}
		}	
		if (this.sprite.x+amountX < this.sprite.width*0.8)  {
			amountX = 0
			this.velocity.x = 0
		}		
		if (this.sprite.x+amountX > window.innerWidth/stage.scale.x) {
			amountX = 0
			this.velocity.x = 0
		}			
		this.sprite.x += amountX
		this.sprite.y += amountY
		this.shadow.x += amountX
		this.shadow.y += amountY
		// if (megaman && !megaman.dead && megaman.sprite.texture !== megamanBumped1Text) {
		// 	megaman.move(amountX,amountY)
		// }
		if (this.attached) {
			this.attached.sprite.x += amountX
			this.attached.sprite.y += amountY
			if (this.attached.carrying) {
				this.attached.carrying.sprite.x += amountX
				this.attached.carrying.sprite.y += amountY
				this.attached.carrying.shadow.x += amountX
				this.attached.carrying.shadow.y += amountY
			}
		}
		
	}
	if (!snes) {
		this.bobMax = this.sprite.height
	} else {
		this.bobMax = this.sprite.height*0.8
	}
	
	this.bob = function(speed) {
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
		this.bobbed += speed
		if (this.bobbed >= 360) {
			this.bobbed -= 360
		}
	}
	this.bob2 = function(speed) {
		var previousPoint = pointAtAngle(this.sprite.x,this.sprite.y,degToRad(this.bobbed-1),this.bobMax)
		var bobPoint = pointAtAngle(this.sprite.x,this.sprite.y,degToRad(this.bobbed),this.bobMax)
		var moveAmount = bobPoint.y-previousPoint.y
		this.sprite.y += moveAmount
		this.bobbed += speed
		if (this.bobbed >= 360) {
			this.bobbed -= 360
		}
	}	
	this.followDirectionalInputs = function() {
		for (var d=0;d<pressingDirections.length;d++) {
			var direction = pressingDirections[d]
			if (direction === "up") {
				if (this.velocity.y > -this.speed) {
					// this.velocity.y -= this.speed/10
					this.velocity.y -= this.speed/6
				}
			}
			if (direction === "down") {
				if (this.velocity.y < this.speed) {
					// this.velocity.y += this.speed/10 
					this.velocity.y += this.speed/6 
				}
			}
			if (direction === "left") {
				if (this.velocity.x > -this.speed) {
					// this.velocity.x -= this.speed/10
					this.velocity.x -= this.speed/6
				}
				
			}
			if (direction === "right") {
				if (this.velocity.x < this.speed) {
					// this.velocity.x += this.speed/10
					this.velocity.x += this.speed/6
				}				
			}
		}
	}
	this.applyGravity = function() {	
		var touchingElevation = 0
		if (this.attached) {
			// touchingElevation = this.attached.sprite.height/12
		}	
		if (Math.abs(this.velocity.z) < 0.05) {
			this.velocity.z = 0
		}
		if (this.elevation > 0) {
			var elevPercent = (this.elevation/(this.sprite.height/2))/6
			if ((this.shadow.origWidth)*(1-elevPercent) > this.shadow.origWidth/2) {
				this.shadow.width = (this.shadow.origWidth)*(1-elevPercent)
			}
		} else {
			
		}
		if (this.elevation === 0 && this.shadow.scale.x !== this.shadow.origScale) {
			this.shadow.scale.x = this.shadow.origScale
		}
		if (this.fell || !this.overGround() || this.elevation > 0) {	
			if (this.velocity.z > this.terminalZ) {
				this.velocity.z -= this.sprite.height/gravityPower
				this.elevation -= this.sprite.height/gravityPower
			}
			if (!this.jumpApex && this.elevation-this.lastElevation < 0) {
				this.jumpApex = this.lastElevation
			}
			if (!this.headBumped && this.jumpApex && this.elevation < this.jumpApex*2 && this.sprite.texture !== frogJumpingDownText) {
				this.sprite.texture = frogJumpingDownText
			}
			if (!this.overGround() && this.elevation < 0) {
				this.fell = true
				this.velocity.x = 0
				this.shadow.visible = false
				stage.setChildIndex(this.sprite,stage.children.indexOf(background.bg1))
			}
			this.vanishIfOffY()
		}
		
		if (!this.fell && this.overGround() && this.elevation < touchingElevation) {
			this.land()
		}
		// this.elevation = Math.round(frog.elevation)
	}
	this.land = function() {
		this.jumpApex = 0
		this.headBumped = false
		this.bobbed = 45
		this.sprite.y = this.shadow.y-this.baseElevation
		this.landedAt = counter
		this.elevation = 0
		this.velocity.z = 0
		this.offGround = false
		this.sprite.texture = neutralFrogText
		if (this.knocked) {
			this.knocked = false
		}
		if (this.attached) {
			this.attached.sprite.y = frog.sprite.y+this.attached.attachSpot.y
			if (this.attached.carrying) {
				this.attached.carrying.sprite.y = this.attached.sprite.y-this.attached.sprite.height
			}
		}
	}
	this.vanishIfOffY = function() {
		if (this.sprite.y > gameHeight-this.sprite.height/2) {
				this.die("fall")
				this.sprite.visible = false
				// this.shadow.visible = false
			}
	}
	this.move2D = function() {
		this.move(this.velocity.x,this.velocity.y)
		this.velocity.x *= 0.9
		this.velocity.y *= 0.9
		if (Math.abs(this.velocity.x) < 0.05) {
			this.velocity.x = 0
		}
		if (Math.abs(this.velocity.y) < 0.04) {
			this.velocity.y = 0
			
		}	
	}
	this.applyVelocity = function() {	
		this.move(this.velocity.x,this.velocity.y)
		this.sprite.y -= this.velocity.z
		// if (this.attached) {
		// 	this.attached.sprite.y -= this.velocity.z
		// 	if (this.attached.carrying) {
		// 		this.attached.carrying.sprite.y -= this.velocity.z
		// 		this.attached.carrying.shadow.y -= this.velocity.z
		// 	}
		// }
		this.elevation += this.velocity.z
		this.velocity.x *= 0.9
		this.velocity.y *= 0.9
		if (Math.abs(this.velocity.x) < 0.005) {
			this.velocity.x = 0
		}
		if (Math.abs(this.velocity.y) < 0.004) {
			this.velocity.y = 0
			
		}	
		// if (Math.abs(this.velocity.z) < 0.005) {
			// this.velocity.z = 0
		// }
		
	}
	this.overGround = function() {
		var over = true
		var frogX = (-background.bg1.x)+this.sprite.x
		if (frogX > nextGap.min+(this.sprite.width/4) && frogX < nextGap.max+(this.sprite.width)) {
			over = false
			
			// frog.sprite.tint = 0xf0f000
		} else {
			// frog.sprite.tint = 0xffffff
		}
		if (frog.vehicle === "rocketPlane") {
			over = false
		}
		return over
	}
}