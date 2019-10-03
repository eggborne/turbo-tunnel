checkpoint = undefined
lastTouchPos = {x:null,y:null}
function update() {
	if (!titleScreen.container.visible) {
	if (playerInitiatedAt === counter && musicOn) {
		
	}
	if (debugMode) {
		if (pressedQAt === counter) {
			if (frogCollision) {
				frogCollision = false
			} else {
				frogCollision = true
			}
		}
		
		if (pressedEAt === counter) {
			console.log("alp " + controlPanel.container.alpha)
			if (frogGravity) {
				frogGravity = false
			} else {
				frogGravity = true
			}
		}
	}
	if (isMobile) {
		if (screenVertical) {
			if (controlPanel.container.alpha+0.05 <= 1) {
				controlPanel.container.alpha += 0.05
			}
			if (controlPanel.container.alpha > 0.9) {
				controlPanel.monitorInputs()
			}
		} else {
			if (!frog.dead && counter-playerInitiatedAt > 60) {
				if (controlPanel.bg.alpha > 0) {
					controlPanel.bg.alpha -= 0.02
					controlPanel.duckLabel.alpha -= 0.02
					controlPanel.jumpLabel.alpha -= 0.02
					controlPanel.duckArea.alpha -= 0.02
					controlPanel.jumpArea.alpha -= 0.02
				} else if (controlPanel.bg.alpha < 0){
					controlPanel.bg.alpha = 0
					controlPanel.duckLabel.alpha = 0
					controlPanel.jumpLabel.alpha = 0
					controlPanel.duckArea.alpha = 0
					controlPanel.jumpArea.alpha = 0
				}
				if (controlPanel.jumpArea.tint === 0x880000) {
					controlPanel.jumpArea.alpha = 0.75
				}
				if (controlPanel.duckArea.tint === 0x880000) {
					controlPanel.duckArea.alpha = 0.75
				}
				if (controlPanel.bg.alpha === 0) {
					if (controlPanel.jumpArea.alpha > 0) {
						controlPanel.jumpArea.alpha -= 0.1
					}
					if (controlPanel.duckArea.alpha > 0) {
						controlPanel.duckArea.alpha -= 0.1
					}
				}
				
			}
			controlPanel.monitorInputs()
		}
		
		handleFrogMovementInput()
	} else {
		handleDirectionalInputs()
		frog.followDirectionalInputs()
		if ((pressingSpace || pressingShift || pressingDirections.length) && controlPanel.instructions.alpha > 0) {
			controlPanel.instructions.alpha -= 0.05
		}
	}
	if (gameMessage.activated) {
		gameMessage.scrollOnscreen()
	}
	// if (checkpoint) {
	// 	checkpoint.rearPost.x -= Math.round(scrollSpeed)
	// 	checkpoint.frontPost.x -= Math.round(scrollSpeed)
	// 	checkpoint.pole.x -= Math.round(scrollSpeed)
	// 	if (!checkpoint.activated) {
	// 		checkpoint.checkForFrog()
	// 	} else {
	// 		checkpoint.ejectPole()
	// 	}
	// 	if (checkpoint.rearPost.x < stage.x-checkpoint.rearPost.width) {
	// 		stage.removeChild(checkpoint.rearPost)
	// 		stage.removeChild(checkpoint.frontPost)
	// 		checkpoint = undefined
	// 	}
	// }

	// var feet = numberInMiles(totalDistance)
	// info.text = "Speed: " + Math.round((((scrollSpeed*60)*60)*60)/((frog.sprite.height/3)*5280)) +" mph\r"
	// + " \rDistance: " + feet + " mi."

	// if (debugMode) {
	// debug.text = "collision: " + frogCollision
	// 	+ " gravity: " + frogGravity
	// 	+ "\rentities: " + stage.children.length
	// 	+ "\rsprites created: " + sprites
	// 	+ "\rdead sprites: " + deadSprites.length
	// 	+ "\revents: " + events.length
	// 	+ "\rcounter: " + counter
	// 	+ "\rlast mine: " + lastMine
	// 	+ "\rpending: " + pillarsPending
	// 	+ "\rspeed: " + Math.round(scrollSpeed)
	// 	+ "\rscreen distance: " + Math.round((totalDistance/viewWidth)*10)/10
	// 	+ "\rRATS: " + rocketRats.length + " MINES: " + mines.length
	// 	+ "\rcurrent special: " + currentSpecial
	// 	+ "\rnext special: " + (nextSpecial/viewWidth) + " - " + ((nextSpecial+specialLength)/viewWidth)
	// 	+ "\rsp. interval " + (specialInterval/viewWidth)
	// 	+ "\rsp. length " + (specialLength/viewWidth)
	// 	+ "\rguestIndex: " + guestIndex
	// 	+ "\revent duration: " + currentEventDuration
	// 	// + "\rwart activated: " + wart.activated
	// 	+ "\rcurrentGapSize: " + currentGapSize
	// 	+ "\rgap min max " + nextGap.min + " / " + nextGap.max
	// 	+ "\rmaxGapLength: " + maxGapLength
		
	// 	// + " \rfeet: " + (distanceInFeet(totalDistance))
	// }

	if (currentEventDuration <= 0 && totalDistance > nextSpecial) {
		if (totalDistance < nextSpecial+specialLength) {
			if (currentSpecial === "rat") {
				if (counter % 45 === 0) {
					new RocketRat(randomInt(0,2))
				}
			} else if (currentSpecial === "mine") {
				var sinceLast = counter-lastMine
				if (sinceLast > randomInt(100,200)) {
					new Mine()
				}
			}
		} else {
			specialInterval = viewWidth*(48+randomInt(-10,10))
			specialLength = viewWidth*(12+randomInt(-6,10))
			nextSpecial += specialInterval+specialLength
			currentSpecial = specialObstacles[randomInt(0,specialObstacles.length-1)]
		}
	}
	// if (exclamationMark.triggered) {
		// exclamationMark.activate()
	// }
	if (stage.children.indexOf(tyson.sprite) > -1) {	
		if (!frog.dead && currentEventDuration === 0) {
			tyson.exit()
			tyson.run(6-Math.round(scrollSpeed/15))	
		} else {
			if (!tyson.entered) {
				tyson.enter()
			} else if (!frog.dead && !tyson.tauntStartedAt && !tyson.currentPunch) {
				tyson.patrol()
			}
			if (tyson.tauntStartedAt) {
				tyson.taunt(100)
			} else {
				
				if (tyson.currentPunch) {
					tyson.checkForFrog()
					if (tyson.landedPunchAt === counter) {
						
					}
					if (counter-tyson.punchedAt >= tyson.currentPunch.duration) {
						tyson.currentPunch = undefined
						tyson.currentColumn = 0
						tyson.landedPunchAt = 0
						if (tyson.sprite.scale.x < 0) {
							tyson.sprite.scale.x *= -1
						}
					}
				} else {	
					if (!tyson.tauntStartedAt) {
						tyson.run(6-Math.round(scrollSpeed/12))
					}
					if (!frog.dead) {
						tyson.switchGuard(40)			
					}
				}
			}
			currentEventDuration--
		}
	}
	if (counter === playerInitiatedAt) {
		frog.ducking = false
	}
	if (!frog.dead) {
		if (frog.knockedAt) {
			if (counter === frog.knockedAt) {
				frog.sprite.texture = duckingFrogText
			}
			if (counter === frog.knockedAt+2) {
				frog.sprite.tint = 0xff6666
			}
			if (counter === frog.knockedAt+4) {
				frog.sprite.tint = 0xffaaaa
			}
			if (counter === frog.knockedAt+6) {
				frog.sprite.tint = 0xffffff
				// frog.sprite.texture = neutralFrogText
			}
			// if (counter === frog.knockedAt+8) {
				// frog.sprite.tint = 0xff0000
			// } 
			if (counter === frog.knockedAt+10) {
				
				frog.knockedAt = 0
			}
		}
		if (counter-playerInitiatedAt === 3600) {
			tyson.activate()
			currentMaxDuration = 1200
			currentEventDuration = currentMaxDuration
		}
		


		if (!frog.offGround) {
			if (!frog.knockedAt && frog.overGround() && pressedSpaceAt === counter) {			
				frog.jump(1)
			}
			if (pressedShiftAt === counter) {
				frog.bobbed = 90
				frog.ducking = true	
			}
			if (frog.ducking && frog.overGround()) {
				if (frog.sprite.texture !== duckingFrogText) {
					frog.sprite.texture = duckingFrogText
				}
				var duckY = frog.duckY()
				if (frog.sprite.y < duckY) {
					frog.sprite.y += (duckY-frog.sprite.y)/4
				} else if (frog.sprite.y > duckY) {
					frog.sprite.y = duckY
				}
				if (frog.attached) {
					frog.attached.sprite.y = frog.sprite.y+frog.attached.attachSpot.y
					
				}
			} else {
				if (frog.sprite.texture === duckingFrogText) {
					frog.sprite.texture = neutralFrogText
				}
			}
		}
		if (!frog.ducking) {
			frog.bob(frog.bobRate)	
		}
		if (counter > takeoffDelay && (scrollSpeed < startingSpeed || counter < rampUpSpeed)) {
			scrollSpeed += startingSpeed/rampUpSpeed
		}
			
		
		if (!frog.dead) {
			frog.applyVelocity()
		}
		if (frogGravity) {
			frog.applyGravity()
		}
	

		if (counter % generalFrequency === 0 && events.length === 0 && counter > 200) {
			if (randomInt(0,10) >= gapLikelihood) {
				if (randomInt(0,1)) {
					if (randomInt(0,2)) {
						addLowBar()
					} else {
						addHighBar()
					}
				} else {
					pillarFlurry(randomPillarFlurryArguments())
				}
			} else if (stage.children.indexOf(tyson.sprite) === -1 && !gapPlanned && !gapBlocking && counter-lastGap > 30) {
				var rando = randomInt(0,3)
				if (rando<=2) {
					addRamp()
				} else if (rando===3) {
					addHighRamp()
				}
			}
		}
	} else { // dead frog
		frog.animateDeath()
		if (controlPanel && counter === frog.diedAt+12) {
			var resetMessage = "TRY AGAIN"
			if (resets > 12121) {
				if (!randomInt(0,1)) {
					var resetMessage = resetMessages2[randomInt(0,resetMessages2.length-1)]
				} else if (!randomInt(0,1)) {
					var resetMessage = resetMessages1[randomInt(0,resetMessages1.length-1)]
				}
			} else if (resets > 4) {
				if (!randomInt(0,1)) {
					var resetMessage = resetMessages1[randomInt(0,resetMessages1.length-1)]
				}
			} else {

			}
			controlPanel.jumpLabel.tint = controlPanel.duckLabel.tint = 0x888888
			controlPanel.jumpLabel.text = resetMessage
			controlPanel.duckLabel.text = "QUIT TO TITLE"
			if (landscape) {
				controlPanel.container.alpha = 1
				// controlPanel.bg.alpha = controlPanel.instructions.alpha = 0
				controlPanel.jumpArea.alpha = 1
				controlPanel.duckArea.alpha = 1
				controlPanel.jumpLabel.alpha = 1
				controlPanel.duckLabel.alpha = 1
				controlPanel.duckLabel.text = "QUIT TO TITLE"
			}
		}
	}
	if (transitionScreen.summoned) {
		transitionScreen.display(30)
	}
	
	background.moveLeft(Math.round(scrollSpeed))
	
	if ((!currentEventDuration || stage.children.indexOf(tyson.sprite) > -1) && scrollSpeed >= startingSpeed && !rocketRats.length && !mines.length && changingSpeedDuration <= 0 && !frog.dead && counter > 160 && events.length && !pillarsPending) {
		executeFirstInQueue()
	}
	
	advancePillars()
	
	for (var s=0;s<splashes.length;s++) {
		var splash = splashes[s]
		splash.explode()
	}
	
	advanceMines()
	advanceRats()
	frog.lastElevation = frog.elevation
	if (rightClickedAt === counter) {
		 
	}
	if (frog.diedAt && counter === frog.diedAt+15) {
		var feet = 0
		if (totalDistance > bestDistance) {
			bestDistance = totalDistance
		}
		feet = scoreInFeet(totalDistance)
		if (connectedToDB) {
			if (checkIfScorePlaces()) {
			gameMessage.legend.y = Math.round(viewHeight/3)
			currentMessage = "HIGH SCORE! " + feet + " ft"
			$('#nameentry').fadeIn()
			} else {
				currentMessage = "DISTANCE: " + feet + " ft"
			}
		}
		
		gameMessage.activated = true
	}
	if (currentEventDuration < 0) {
		currentEventDuration = 0
	}
	} else { // title screen showing
		if (titleScreen.cover.alpha-0.05 > 0) {
			titleScreen.cover.alpha -= 0.05
		} else {
			titleScreen.cover.alpha = 0
		}
		titleScreen.animateStars()
		if (titleScreen.titlesLanded < 3) {
			titleScreen.placeTitle()
		}
		titleCounter++
		if (titleCounter % 600 === 0) {
			// if (currentPlayers > 1) {
				getTotalKillsFromDatabase(gameName)
			// }
			// getCurrentUsersFromDatabase(gameName)
		}
		if (highScoreScreen.container.visible) {
			
			
		}
	}
	if (touches.length) {
		// lastTouchPos = {x:touches[0].pos.x,y:touches[0].pos.y}
	}
	counter++
	if (counter % 60 === 0) {

	}
	// renderer.render(stage);
	// requestAnimationFrame(update);
	
}