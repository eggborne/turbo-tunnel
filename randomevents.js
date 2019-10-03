function sendMines(frequency) {
	if (counter % frequency === 0) {
		new Mine()
	}
}


function addPillar(argArray) {
	events.push(argArray)
	if (argArray[0] === rampText || argArray[0] === highRampText) {
		gapPlanned = true
	}
}
function addLowBar() {
	events.push([shortWidePillarText,0,30])
}
function addHighBar() {
	events.push([highWidePillarText,0,30])
}
function addRamp() {
	events.push([rampText,1,30])
}
function addJump() {
	events.push([rampText,1,30])
}
function addHighRamp() {
	events.push([highRampText,1,30])
}
function addGap(width,ramp) {
	if (ramp || width > 3) {
		addPillar(randomPillarArguments(true,true))
	}
	events.push([width])
	
}

function addFlameWall() {
	events.push("flameWall")
}
function executeFirstInQueue() {
	var eventArray = events[0]
	var newPillar = new Pillar(eventArray)
	if (newPillar.dropX > nextGap.min-(background.floorWidth/2) && newPillar.dropX < nextGap.max+(background.floorWidth*0.6)) {
		// newPillar.finalize()
		// newPillar.sprite.tint = 0xff0000
		// newPillar.sprite.visible = false
	} else {			
		newPillar.finalize()
		if (exclamationMark.duration) {
			newPillar.sprite.visible = false
			// stage.removeChild(newPillar.sprite)
		}
		events.splice(0,1)
	} 
	events.splice(0,1)
}
function randomlyChangeSpeed(frequency) {
	if (randomInt(1,2) && counter > 200 && counter % frequency === 0 && changingSpeedDuration <= 0) {
		changingSpeedDuration = 300
		speedAdjustment = startingSpeed/changingSpeedDuration/6
		currentMessage = "SPEED UP!"
		// if (!randomInt(0,4)) {
			// speedAdjustment *= -0.5
			// currentMessage = "SPEED DOWN!"
		// }
		gameMessage.activated = true
	}
	if (changingSpeedDuration > 0) {
		changingSpeedDuration--
		if (scrollSpeed+speedAdjustment <= maxSpeed && scrollSpeed+speedAdjustment >= startingSpeed) {
			scrollSpeed += speedAdjustment
			if (counter % 5 === 0) {
				// music.rate(1+(scrollSpeed-startingSpeed)/400)
			}
		} else {
			// music.rate(1+(scrollSpeed-startingSpeed)/400)
			changingSpeedDuration = 0
		}
		if (changingSpeedDuration === 0) {
			// music.rate(1+(scrollSpeed-startingSpeed)/400)
			nextSpeedUp = totalDistance+Math.round(speedUpIncrement)
			maxGapLength = 6
		}
		
	}
		
}

function randomPillarArguments() {
	var rando = randomInt(0,2)
	var posY = rando
	var randomText = randomInt(2,pillarTexts.length-2)
	var texture = pillarTexts[randomText]
	var warningTime = 10+padding
	if (texture === rampText || texture === highRampText) {
		posY = 1
	}
	return [randomText,posY,warningTime]
}
function pillarFlurry(argArray) {
	var texture = argArray[0]
	var pattern = argArray[1]
	var speed = argArray[2]
	for (var e=0;e<pattern.length;e++) {
		var posY = pattern[e]
		addPillar([texture,posY,speed])
		
	}
}
function randomPillarFlurryArguments() {
	var pattern = []
	var length = randomInt(2,6)
	for (var e=0;e<length;e++) {
		pattern.push(randomInt(0,2))
	}
	var randomText = randomInt(2,pillarTexts.length-2)
	var texture = pillarTexts[randomText]	
	var speed = randomInt(10,20)+padding
	return [texture,pattern,speed]
}
function increaseSpeed(amount) {
	if (counter % 60 === 0 && scrollSpeed+amount < maxSpeed) {
		scrollSpeed += amount
	}
}
function showAlienHeadToRight(duration,fireRate) {
	alienHead.fireRate = fireRate
	alienHead.attacking = true
	alienHead.duration = duration
	alienHead.summon(duration)
}
function descendAlienHeads(num,frequency) {
	if (frog.dead) {
		alienHeadsAttacking = 0
	}
	if (!alienHeadsAttacking) {
		alienHead.descending = true
		alienHeadsAttacking = num
		alienHead.lastExitedAt = counter
		// alienHead.summon(300)
		
	} else {
		if ((counter-alienHead.lastExitedAt) === frequency) {
			alienHeadsAttacking--
			if (alienHead.descendDelay-8 > 4) {
				alienHead.descendDelay -= 8
				alienHead.descendSpeed *= 1.2
			} else {
				alienHead.descendDelay = 4
			}
			if (!alienHeadsAttacking) {
				alienHead.descendDelay = 60
				alienHead.descendSpeed = alienHead.origDescendSpeed
				alienHead.sprite.visible = alienHead.shadow.visible = false
				alienHead.descending = false
			} else {
				// alienHead.summon(600)
			}
		}
		
	}
}

function advancePillars() {
	for (var p=0;p<pillars.length;p++) {
		var pillar = pillars[p]	
		if (!pillar.droppedAt) {
			pillar.flash()
		} else {
			
			if (!pillar.droppedBy) {
				if (frogCollision && frog.sprite.y < gameHeight+(frog.sprite.height/2) && !frog.dead) {
					// if (pillar.sprite.texture === rampText || pillar.sprite.texture === highRampText) {
						pillar.checkForFrog()
					// }
					
				}
				pillar.correctZLevel()	
				pillar.advance()
				if (pillar.screenPosition().x <= -pillar.sprite.width) {
					// if (!usedSpriteAvailable(pillar.sprite.texture)) {
						deadSprites.push(pillar.sprite)
					// }
					pillars.splice(p,1)
					stage.removeChild(pillar.sprite)
					if (pillar.shadow) {
						stage.removeChild(pillar.shadow)
					}
					p--
				}
			} else {
				if (pillar.sprite.y === pillar.homeY) {
					pillar.advance()
					if (frogCollision && !frog.dead) {
						pillar.checkForFrog()
					}
					pillar.correctZLevel()	
				}
			}
		}
	}
}
function advanceMines() {
	for (var m=0;m<mines.length;m++) {
		var mine = mines[m]
		if (true) {
			if (!mine.killedFrog) {
				mine.advance()
				mine.correctZLevel()
				if (frogCollision) {
					mine.checkForFrog()
				}
			} else {
				var sinceHit = counter-mine.killedFrog
				if (sinceHit === 1) {
					mine.sprite.alpha = 0
					mine.explosion.visible = true
					mine.explosion.x = mine.sprite.x
					mine.explosion.y = mine.sprite.y
					mine.explosion.origScale = mine.explosion.scale.x
					mine.explosion.scale.x *= 0.4
					mine.explosion.scale.y *= 0.4
				} else if (sinceHit < 15) {
					if (Math.abs(mine.explosion.scale.x*1.1) < mine.explosion.origScale) {
						mine.explosion.scale.x *= 1.5
						mine.explosion.scale.y *= 1.5
					} else {
						mine.explosion.scale.x = mine.explosion.scale.y = mine.explosion.origScale
					}
					if (sinceHit % 3 === 0) {
						mine.explosion.tint = 0xff0000
						// mine.explosion.scale.x *= -1
					} else {
						mine.explosion.tint = 0xffffff
					}
				} else {
					mine.explosion.scale.x -= 0.5
					mine.explosion.scale.y -= 0.5
					if (mine.explosion.scale.x < 0) {
						mine.explosion.visible = false
						mine.sprite.visible = false
					}
					
				}
			}
			if (!mine.sprite.visible) {
				mines.splice(m,1)
				// m--
				// stage.removeChild(mine.sprite)
				mine.sprite.destroy()
				mine.shadow.destroy()
				mine.explosion.destroy()
				// stage.removeChild(mine.shadow)
			}
		}
		
	}
}
function advanceRats() {
	for (var r=0;r<rocketRats.length;r++) {
		var rat = rocketRats[r]
		rat.advance()
		if (rat.droppedPillar) {
			if (rat.pillar.sprite.y+(pixelSize*4) < rat.pillar.homeY) {
				rat.pillar.sprite.y += pixelSize*4
			} else {
				rat.pillar.sprite.y = rat.pillar.homeY
			}
		}
		
		if (!rat.sprite.visible) {
			rocketRats.splice(r,1)
			// r--
			rat.sprite.destroy()
			rat.shadow.destroy()
		}
	}
}