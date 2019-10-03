$('body').on('mousewheel', function(event) {
	if (highScoreScreen.container.visible) {

		var target = highScoreScreen.listContainer.y+event.deltaY*(highScoreScreen.container.height/20)
		if (target >= highScoreScreen.listContainer.yLimit && target <= highScoreScreen.listContainer.origY) {
				highScoreScreen.listContainer.y = target
			} else {
				if (target>this.origY) {
					highScoreScreen.listContainer.y = highScoreScreen.listContainer.origY
				}
				if (target<this.yLimit) {
					highScoreScreen.listContainer.y = highScoreScreen.listContainer.yLimit
				}
			}
	}
});



function Joystick(rootX,rootY) {
	this.maxLean = viewHeight/10
	this.deadZoneSize = 0
	this.container = new PIXI.Container()

	this.arrows = []
	
	this.frogPosition = {x:frog.sprite.x,y:frog.sprite.y}
		
	this.lastReleased = 0
	this.thumbpad = new PIXI.Sprite(redInsigniaText)
	// this.thumbpad.visible = false
	this.thumbpad.anchor.set(0.5)
	this.thumbpad.width = this.thumbpad.height = cellSize*8.5
	this.thumbpad.tint = 0x2a4b16
	this.thumbpad.x = rootX
	this.thumbpad.y = rootY
	this.thumbpad.alpha = 1
	this.thumbpad.lastPosition = {x:this.thumbpad.x,y:this.thumbpad.y}
	this.fading = undefined
	// this.container.addChild(this.thumbpad)		
	if (!landscape || !isMobile) {
		stage.addChild(this.container)
	}
	this.followThumb = function() {
		var touch = touches[touches.length-1].pos
		this.thumbpad.x = touch.x
		this.thumbpad.y = touch.y		
	}
	this.monitorForTouchInput = function() {
		var amountX = this.thumbpad.lastPosition.x-this.thumbpad.x
		var amountY = this.thumbpad.lastPosition.y-this.thumbpad.y
		var angle = angleOfPointABFromXY(this.thumbpad.lastPosition.x,this.thumbpad.lastPosition.y,this.thumbpad.x,this.thumbpad.y)
		var distance = distanceFromABToXY(this.thumbpad.lastPosition.x,this.thumbpad.lastPosition.y,this.thumbpad.x,this.thumbpad.y)
		var frogGoal = pointAtAngle(frog.sprite.x,frog.sprite.y,angle,distance)
		var frogDistance = distanceFromABToXY(frog.sprite.x,frog.sprite.y,frogGoal.x,frogGoal.y)
		var frogDistX = frogGoal.x-frog.sprite.x
		var frogDistY = frogGoal.y-frog.sprite.y
		
		// if (amountX > frog.speed || frogDistX > frog.speed) {
			// amountX = frog.speed
		// } else if (amountX < -frog.speed || frogDistX < -frog.speed) {
			// amountX = -frog.speed
		// }
		// if (amountY > frog.speed || frogDistY > frog.speed) {
			// amountY = frog.speed
		// } else if (amountY < -frog.speed || frogDistY < -frog.speed) {
			// amountY = -frog.speed
		// }
		if (!frog.knockedAt) {
			frog.velocity.x = -amountX*0.9
			frog.velocity.y = -amountY*0.8
			// frog.move(-amountX,-amountY)
			
		} else {
			if (joystick) {
				joystick.thumbpad.x += amountX
				joystick.thumbpad.y += amountY
			}
		}
		// frog.move(-amountX*0.9,-amountY*0.7)
		this.thumbpad.lastPosition = {x:this.thumbpad.x,y:this.thumbpad.y}
	
	}
	this.destroy = function() {
		stage.removeChild(this.container)
		stopPressing(pressingDirections[pressingDirections.length-1])
		if (pressingDirections.length > 0) {
			stopPressing(pressingDirections[0])
		}
		pressingUp = pressingDown = pressingLeft = pressingRight = false
		joystick = undefined
	}
}

function touchingJoystickArea() {
	var touching = false
	for (var t=0;t<touches.length;t++) {
		var touch = touches[t]
		if (counter !== hitJumpAt && counter !== hitDuckAt) {
			if (!screenVertical) {
				if (touch.pos.x > 0 &&
					touch.pos.x < (viewWidth/2)) {
					touching = true
				}
			} else {
				if (touch.pos.y > (controlPanel.container.y)) {
					touching = true
				}
			}
		}
	}
	return touching
}
function extendAdjunctsForXPosition(posX) {
	if (posX > viewWidth*(1/2)) {
		controlPanel.jumpAdjuncts[0].extend(1)
		controlPanel.duckAdjuncts[0].extend(1)
	} else if (posX <= viewWidth*(1/2)) {
		controlPanel.jumpAdjuncts[1].extend(1)
		controlPanel.duckAdjuncts[1].extend(1)
	}
}
function retractAdjuncts() {
	controlPanel.jumpAdjuncts[0].extend(-1)
	controlPanel.duckAdjuncts[0].extend(-1)
	controlPanel.jumpAdjuncts[1].extend(-1)
	controlPanel.duckAdjuncts[1].extend(-1)
}
function handleFrogMovementInput() {
	if (joystick) {
		if (!frog.dead) {
			joystick.monitorForTouchInput()
		}
		if (controlPanel.jumpAdjuncts[0].scale.y < controlPanel.jumpAdjuncts[0].origScaleY && controlPanel.jumpAdjuncts[1].scale.y < controlPanel.jumpAdjuncts[1].origScaleY) {
			extendAdjunctsForXPosition(joystick.thumbpad.x)
		}
	}
}
function handleDirectionalInputs() {
	
	if (!frog.knockedAt && pressingUp) {
		newDirection = "up"
		
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
		}
	}
	if (pressingDown) {
		newDirection = "down"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
		}
	}
	if (pressingLeft) {
		newDirection = "left"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
		}
	}
	if (pressingRight) {
		newDirection = "right"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
		}
	}	
}

function stopPressing(direction) {
	if (direction === "up") {
		pressingUp = false
	}
	if (direction === "down") {
		pressingDown = false
	}
	if (direction === "left") {
		pressingLeft = false
	}
	if (direction === "right") {
		pressingRight = false
	}
	
	lastLiftedDirection = direction
	stoppedPressing = counter
	pressingDirections.splice(pressingDirections.indexOf(direction),1)
}
function setInputs() {
	document.onmousedown = function(event) {
		if (event.button === 0) {
			LMBDown = true
			clickedAt = counter
		}
		if (event.button === 2) {
			RMBDown = true
			rightClickedAt = counter
		}
	}
	document.onmousemove = function(event) {
		cursor.x = event.clientX
		cursor.y = event.clientY
	}
	
	document.onmouseup = function(event) {
		if (event.button === 0) {
			LMBDown = false
		}
		if (event.button === 2) {
			RMBDown = false	
		}
	}
	document.onkeydown = function(event) {
		
		if (event.keyCode == 81) {
			pressingQ = true
			pressedQAt = counter
		};
		if (event.keyCode == 69) {
			pressingE = true
			pressedEAt = counter
		};
		
		if (pressingDirections.length < 2) {
			if (event.keyCode == 87 || event.keyCode == 38) {
				pressingUp = true
			};
			if (event.keyCode == 83 || event.keyCode == 40) {
				pressingDown = true
				
			};
			if (pressingRight === false && event.keyCode == 65 || event.keyCode == 37) {
				pressingLeft = true
				
			};
			if (pressingLeft === false && event.keyCode == 68 || event.keyCode == 39) {
				pressingRight = true
				
			};		
		}
		if (!pressingSpace && event.keyCode == 32) {
			pressingSpace = true
			pressedSpaceAt = counter
			if (gameStarted < 0) {
				gameStarted = counter
			}
			
		};
		if (!pressingShift && event.keyCode == 16) {
			pressingShift = true
			pressedShiftAt = counter
			
			
		};
	};
    document.onkeyup = function(event) {		
		if (event.keyCode == 81) {
			pressingQ = false
		};
		if (event.keyCode == 69) {
			pressingE = false
		};
		if (event.keyCode == 87 || event.keyCode == 38) {
			stopPressing("up")
		};
		if (event.keyCode == 83 || event.keyCode == 40) {
			stopPressing("down")
		};
		if (event.keyCode == 65 || event.keyCode == 37) {
			stopPressing("left")
		};
		if (event.keyCode == 68 || event.keyCode == 39) {
			stopPressing("right")
		};
		if (event.keyCode == 32) {
			pressingSpace = false
		}	
		if (event.keyCode == 16) {
			pressingShift = false
			if (frog.ducking) {
				frog.ducking = false
			}
		}		
    };
	stage.interactive = true
	stage.onDragStart = function(event)
    {
		if (touches.length === 0) {
			var e = event || window.event;
			this.data = e.data;
			var touch = {
				id: this.data.identifier || 0,
				pos: this.data.getLocalPosition(this)
			};
		
			touches.push(touch);
			touchedAt = counter
		}
        
	}
    stage.onDragMove = function(event)
    {
        var e = event || window.event;
        this.data = e.data;
        for (var i=0; i < touches.length; i++) {
            if(touches[i].id === (this.data.identifier || 0)) {
                touches[i].pos = this.data.getLocalPosition(this);
            }
        };
    }
    stage.onDragEnd = function (event)
    {
		var e = event || window.event;
        this.data = e.data;
        for (var i = 0; i < touches.length; i++) {
            if(touches[i].id === (this.data.identifier || 0)) {
                
                touches.length = 0
            }
        };
        if (touches.length === 0) {
			pressingDirections = []
			
        }
		
    }
    stage.on("touchstart",stage.onDragStart)
    stage.on("touchmove",stage.onDragMove)
    stage.on("touchend",stage.onDragEnd)
    stage.on("touchendoutside",stage.onDragEnd)
}

function jumpButtonAction(){
	
	hitJumpAt = counter
	if (frog.dead) {
		if (counter-frog.diedAt > 5) {
			// try again
			$('#nameentry').fadeOut(1)
			transitionScreen.summon(true)
		}
	} else if (true) {
		if (!frog.knocked && !frog.dead && !frog.offGround && frog.elevation === 0) {
			frog.jump(1)					
		}
	}
			
	if (!this.text) {
		this.tint = controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = 0x880000
	}
	controlPanel.jumpArea.tint = 0x880000
}

function ControlPanel() {
	
	this.container = new PIXI.Container()
	this.bg = new PIXI.Sprite(pixelText)
	this.container.y = viewHeight
	this.bg.width = window.innerWidth
	this.bg.height = window.innerHeight-gameHeight
	var buttonStyle = startStyle2
	var instructStyle = exitStyle2
	if (landscape) {
		this.bg.width = viewWidth/2
		this.bg.height = gameHeight
		buttonStyle = startStyle
		instructStyle = exitStyle
		if (!isMobile) {
			startStyle.fontSize = viewHeight/24
		}
	}
	this.bg.tint = 0x222222
	// this.bg.alpha = 0
	this.container.addChild(this.bg)
	console.log("gameH " + gameHeight)
	this.buttonYBorder = (window.innerHeight-gameHeight)/12
	this.adjunctHeight = (this.container.height/4.75)*0.9
	this.instructions = new PIXI.Text("DRAG TO MOVE",instructStyle)
	this.jumpLabel = new PIXI.Text("JUMP",buttonStyle)
	this.duckLabel = new PIXI.Text("DUCK",buttonStyle)	
	this.instructions.tint = this.jumpLabel.tint = this.duckLabel.tint = 0xaaaaaa
	this.instructions.anchor.x = 0.5
	this.instructions.x = this.container.width/2
	this.instructions.y = this.container.height/2-(this.instructions.height/2)
	this.instructions.alpha = 0.5
	this.jumpLabel.alpha = this.duckLabel.alpha = 1
	this.jumpArea = new PIXI.Sprite(pixelText)
	this.duckArea = new PIXI.Sprite(pixelText)
	this.jumpArea.tint = this.jumpAreaColor = 0x660000
	this.duckArea.tint = this.duckAreaColor = 0x440000
	this.jumpArea.width = this.duckArea.width = this.container.width*0.9
	this.jumpArea.height = this.duckArea.height = this.container.height/4.75
	this.jumpArea.anchor.x = this.duckArea.anchor.x = this.jumpLabel.anchor.x = this.duckLabel.anchor.x = 0.5
	this.jumpArea.x = this.duckArea.x = Math.round(viewWidth/2)
	this.jumpArea.y = this.buttonYBorder
	this.duckArea.y = Math.round(this.container.height-this.duckArea.height-this.buttonYBorder)
	this.duckArea.interactive = true
	this.duckLabel.interactive = true
	this.jumpArea.interactive = true
	this.jumpLabel.interactive = true
	this.jumpAdjuncts = []
	this.duckAdjuncts = []
	
	this.jumpLabel.anchor.y = 0.5
	this.duckLabel.anchor.y = 0.5
	
	if (landscape) {
		this.container.x = this.container.y = 0
		// this.instructions.visible = false
		this.jumpArea.width = viewWidth*0.25
		this.duckArea.width = viewWidth*0.25
		this.jumpArea.x = viewWidth-(this.jumpArea.width/2)
		this.duckArea.x = this.jumpArea.x-((this.jumpArea.width/2)+(this.duckArea.width/2))
		this.jumpArea.height = gameHeight/4
		this.duckArea.height = gameHeight/4
		this.jumpArea.y = gameHeight-this.jumpArea.height
		this.duckArea.y = gameHeight-this.duckArea.height
		
		this.jumpLabel.y += this.jumpArea.y+(this.jumpArea.height/2)-(this.jumpLabel.height/2)
		this.duckLabel.y += this.duckArea.y+(this.duckArea.height/2)-(this.duckLabel.height/2)
		
		if (!isMobile) {
			this.jumpArea.x = (viewWidth/2)-(this.jumpArea.width/2)
			this.duckArea.x = (viewWidth/2)+(this.jumpArea.width/2)
		}
		this.jumpLabel.x = this.jumpArea.x
		this.duckLabel.x = this.duckArea.x
		
	} else {
		this.jumpLabel.x = this.jumpArea.x
		this.jumpLabel.y = this.jumpArea.y+(this.jumpArea.height/2)-(this.jumpLabel.height/2)
		this.duckLabel.x = this.duckArea.x
		this.duckLabel.y = this.duckArea.y+(this.duckArea.height/2)-(this.duckLabel.height/2)
	}
		this.container.addChild(this.instructions)

	if (landscape && !isMobile) {
		this.bg.alpha = this.jumpLabel.alpha = this.duckLabel.alpha = this.jumpArea.alpha = this.duckArea.alpha = 0
		this.instructions.text = "WASD or ARROWS - MOVE\r\rSPACE - JUMP\r\rSHIFT - DUCK"
		this.instructions.alpha = 0.9
		this.instructions.x = window.innerWidth/2
		this.instructions.y = window.innerHeight/2-(this.instructions.height/2)
		
	}

	this.jumpLabel.y += this.jumpLabel.height/2
	this.duckLabel.y += this.jumpLabel.height/2
	
	this.container.addChild(this.jumpArea)
	this.container.addChild(this.duckArea)
	
	if(!landscape || !isMobile) {
		this.container.addChild(this.jumpLabel)
		this.container.addChild(this.duckLabel)
	} else {
		this.container.addChild(this.jumpLabel)
		this.container.addChild(this.duckLabel)
		// this.jumpArea.alpha = 0
		// this.duckArea.alpha = 0
		// this.bg.alpha = 0
	}
	
	
	for (var a=0;a<4;a++) {
		var newAdjunct = new PIXI.Sprite(pixelText)
		if (!landscape && isMobile) {
			this.container.addChild(newAdjunct)
		}
		newAdjunct.interactive = true
		newAdjunct.width = this.duckArea.width/3
		newAdjunct.height = this.adjunctHeight
		
		newAdjunct.alpha = 1
		if (a === 0) {
			newAdjunct.anchor.y = 0
			newAdjunct.x = this.jumpArea.x-(this.jumpArea.width/2)
			newAdjunct.y = this.jumpArea.y+this.jumpArea.height
			newAdjunct.tint = this.jumpArea.tint
			this.jumpAdjuncts.push(newAdjunct)
		} else if (a === 1) {
			newAdjunct.anchor.y = 0
			newAdjunct.x = this.jumpArea.x+(this.jumpArea.width/2)-newAdjunct.width
			newAdjunct.y = this.jumpArea.y+this.jumpArea.height
			newAdjunct.tint = this.jumpArea.tint
			this.jumpAdjuncts.push(newAdjunct)
		} else if (a === 2) {
			newAdjunct.anchor.y = 1
			newAdjunct.x = this.duckArea.x-(this.duckArea.width/2)
			newAdjunct.y = this.duckArea.y
			newAdjunct.tint = this.duckArea.tint
			this.duckAdjuncts.push(newAdjunct)
		} else if (a === 3) {
			newAdjunct.anchor.y = 1
			newAdjunct.x = this.duckArea.x+(this.duckArea.width/2)-newAdjunct.width
			newAdjunct.y = this.duckArea.y
			newAdjunct.tint = this.duckArea.tint
			this.duckAdjuncts.push(newAdjunct)
		}
		if (a < 2) {
			
			
			
			newAdjunct.on("touchstart",jumpButtonAction)
			newAdjunct.on("touchend",function(){
				controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = controlPanel.jumpAreaColor
				controlPanel.jumpArea.tint = controlPanel.jumpAreaColor
			})
			newAdjunct.on("touchendoutside",function(){
				controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = controlPanel.jumpAreaColor
				controlPanel.jumpArea.tint = controlPanel.jumpAreaColor
			})
		} else {
			newAdjunct.on("touchstart",function(){
			frog.startDucking()
			controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = 0x880000
			controlPanel.duckArea.tint = 0x880000
			})
			newAdjunct.on("touchend",function(){
				frog.ducking = false
				controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = controlPanel.duckAreaColor
				controlPanel.duckArea.tint = controlPanel.duckAreaColor
			})
			newAdjunct.on("touchendoutside",function(){
				frog.ducking = false
				controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = controlPanel.duckAreaColor
				controlPanel.duckArea.tint = controlPanel.duckAreaColor
			})
		}
		// newAdjunct.tint = 0x00ff00
		newAdjunct.extending = false
		newAdjunct.origScaleY = newAdjunct.scale.y
		newAdjunct.scale.y = 0
		newAdjunct.extend = function(direction) {
			this.scale.y += direction*this.origScaleY/8
			if (direction > 0) {
				if (this.scale.y > this.origScaleY) {
					this.scale.y = this.origScaleY
					this.extending = false
				}
			} else {
				if (this.scale.y < 0) {
					this.scale.y = 0
					this.extending = false
				}
			}
		}
	}
	this.duckArea.on("pointerdown",function(){
		if (true) {
			hitDuckAt = counter
			frog.startDucking()
			this.tint = controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = 0x880000
		}
	})
	this.duckArea.on("pointerup",function(){
		frog.ducking = false
		this.tint = controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = controlPanel.duckAreaColor
	})
	this.duckArea.on("pointerupoutside",function(){
		frog.ducking = false
		this.tint = controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = controlPanel.duckAreaColor
	})
	this.duckLabel.on("pointerdown",function(){
		if (true) {
			hitDuckAt = counter
			frog.startDucking()
			controlPanel.duckArea.tint = controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = 0x880000
		}
	})
	this.duckLabel.on("pointerup",function(){
		frog.ducking = false
		controlPanel.duckArea.tint = controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = controlPanel.duckAreaColor
	})
	this.duckLabel.on("pointerupoutside",function(){
		frog.ducking = false
		controlPanel.duckArea.tint = controlPanel.duckAdjuncts[0].tint = controlPanel.duckAdjuncts[1].tint = controlPanel.duckAreaColor
	})
	this.jumpArea.on("pointerdown",jumpButtonAction)
	this.jumpArea.on("pointerup",function(){
		this.tint = controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = controlPanel.jumpAreaColor
	})
	this.jumpArea.on("pointerupoutside",function(){
		this.tint = controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = controlPanel.jumpAreaColor
	})
	this.jumpLabel.on("pointerdown",jumpButtonAction)
	this.jumpLabel.on("pointerup",function(){
		controlPanel.jumpArea.tint = controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = controlPanel.jumpAreaColor
	})
	this.jumpLabel.on("pointerupoutside",function(){
		controlPanel.jumpArea.tint = controlPanel.jumpAdjuncts[0].tint = controlPanel.jumpAdjuncts[1].tint = controlPanel.jumpAreaColor
	})
	if (screenVertical) {
		this.container.alpha = 0
	}
	this.monitorInputs = function() {
		if (touches.length) {
			if (touchingJoystickArea()) {
				if (touchedAt === counter) {
					if (!joystick) {
						joystick = new Joystick(touches[touches.length-1].pos.x,touches[touches.length-1].pos.y)
					} else {
						// joystick.destroy()
						// joystick = new Joystick(touches[0].pos.x,touches[0].pos.y)
					}
				}
				if (controlPanel.instructions.alpha > 0) {
					controlPanel.instructions.alpha -= 0.05
				}
				if (joystick && joystick.container.alpha < 1) {
					joystick.container.alpha += 0.04
				}
				if (joystick) {
					joystick.followThumb()
				}
			}
			
		} else {
			retractAdjuncts()
			if (joystick) {
				if (joystick.container.alpha > 0) {
					joystick.container.alpha -= 0.5
				}
				if (joystick.container.alpha <= 0) {
					joystick.destroy()
					joystickKilledAt = counter
				}
			}
			if (counter-joystickKilledAt > 30 && !joystick && controlPanel && controlPanel.instructions.alpha < 0.5) {
				// controlPanel.instructions.alpha += 0.1
			}
			
			
		}
	}
	stage.addChildAt(this.container,stage.children.indexOf(background.bgZero)+1)
	if (landscape && isMobile) {
		this.container.alpha = 0.9
	}
}
function setStyles() {
	buttonFontSize = Math.round(pixelSize*16)
	messageFontSize = Math.round(pixelSize*13)
	if (window.innerWidth < window.innerHeight) {
		highScoreSize = pixelSize*11
	} else {
		highScoreSize = pixelSize*6
	}
	buttonStyle = {
		align: 'left',
		font : (buttonFontSize) +'px Press Start 2P',
		fill : '#efefef',
		dropShadow : true,
		dropShadowColor : '#000000',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : Math.round(messageFontSize/12)
	};
	debugStyle = {
		align: 'left',
		font : (pixelSize*5) +'px Press Start 2P',
		fill : '#efefef',
	};
	messageHorizStyle = {
		fontFamily : 'Press Start 2P',
		fontSize : Math.round(pixelSize*11) + 'px',
		// fontStyle : 'italic',
		// fontWeight : 'bold',
		fill : '#ffffff',
		stroke : '#000000',
		strokeThickness : (pixelSize*2),
		dropShadow : true,
		dropShadowColor : '#000000',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : Math.round(pixelSize*3),
		align:'center'
	};
	highScoreStyle = {
		fontFamily : 'Press Start 2P',
		fontSize : Math.round(highScoreSize) + 'px',

		fill : '#ffffff',
	
		align:'left'
	};
	highScoreStyleRight = {
		fontFamily : 'Press Start 2P',
		fontSize : Math.round(highScoreSize) + 'px',
		fill : '#ffffff',
		align:'right'
	};
	messageVertStyle = {
		fontFamily : 'Press Start 2P',
		fontSize : Math.round(pixelSize*16) + 'px',
		// fontStyle : 'italic',
		// fontWeight : 'bold',
		fill : '#ffffff',
		stroke : '#000000',
		strokeThickness : (pixelSize*2),
		dropShadow : true,
		dropShadowColor : '#000000',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : Math.round(pixelSize*3),
	};
	messageStyle2 = {
		align: 'center',
		fontFamily : 'Helvetica',
		fontSize : Math.round(pixelSize*6) + 'px'
	
	};
	horizTitleStyle = {
		align: 'center',
		fontFamily : 'Press Start 2P',
		fontSize : Math.round(viewHeight/8),
		// fontStyle : 'italic',
		// fontWeight : 'bold',
		fill : '#F7ffCA',
		stroke : '#224422',
		padding: 12,
		strokeThickness : Math.round(pixelSize*7),
		letterSpacing:2
		
	};
	vertTitleStyle = {
		align: 'center',
		fontFamily : 'Press Start 2P',
		fontSize : Math.round(viewWidth/8),
		// fontStyle : 'italic',
		fontWeight : 'bold',
		fill : '#F7ffCA',
		stroke : '#224422',
		padding: 12,
		strokeThickness : Math.round(pixelSize*6),
		letterSpacing:2
	};
	vertMenuStyle = {
		align: 'center',
		fontFamily : 'Press Start 2P',
		fontSize : Math.round(viewWidth/20),
		fill : '#aaccaa',
		stroke : '#000000',
		strokeThickness : Math.round(pixelSize*2)
	
	};
	horizMenuStyle = {
		align: 'center',
		fontFamily : 'Press Start 2P',
		fontSize : Math.round(pixelSize*7) + 'px',
		fill : '#aaccaa',
		stroke : '#000000',
		strokeThickness : Math.round(pixelSize*2)
		
	};
	startStyle = {
		align: 'center',
		font : (viewHeight/24) +'px Press Start 2P',
		fill : '#ffffff',
		lineHeight:(viewHeight/18),
		wordWrap:true,
		// wordWrapDistance: (pixelSize*40)
		// stroke : '#000000',
		// strokeThickness : Math.round(pixelSize*2),

		
	};
	startStyle2 = {
		align: 'center',
		font : (viewHeight/16) +'px Press Start 2P',
		fill : '#ffffff',
		// wordWrap:true,
		// wordWrapDistance: (pixelSize*40)
		// stroke : '#000000',
		// strokeThickness : Math.round(pixelSize*2),

		
	};
	exitStyle = {
		align: 'center',
		font : (pixelSize*13) +'px Press Start 2P',
		fill : '#ffffff',
		stroke : '#000000',
		strokeThickness : (pixelSize*2),

		
	};
	exitStyle2 = {
		align: 'center',
		font : (viewHeight/20) +'px Press Start 2P',
		fill : '#ffffff',
		stroke : '#000000',
		strokeThickness : (pixelSize*2),

		
	};
}