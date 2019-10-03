class UserGamepad {
  constructor(gamepadObj) {
    this.buttons = gamepadObj.buttons;
    this.index = gamepadObj.index;
    this.currentlyPressedButtons = [];
    this.buttonMappings = {
      0: {
        name: "",
        action: {
          down: () => {
            pressingShift = true;
            pressedShiftAt = counter;
          },
          up: () => {
            pressingShift = false;
            if (frog.ducking) {
              frog.ducking = false;
            }
          }
        }
      },
      1: {
        name: "",
        action: {
          down: () => {
            pressingSpace = true;
            pressedSpaceAt = counter;
            if (gameStarted < 0) {
              gameStarted = counter;
            }
          },
          up: () => {
            pressingSpace = false;
          }
        }
      },
      2: {
        name: "",
        action: {
          down: () => {
            pressingShift = true;
            pressedShiftAt = counter;
          },
          up: () => {
            pressingShift = false;
            if (frog.ducking) {
              frog.ducking = false;
            }
          }
        }
      },
      3: {
        name: "",
        action: {
          down: () => {
            pressingSpace = true;
            pressedSpaceAt = counter;
            if (gameStarted < 0) {
              gameStarted = counter;
            }
          },
          up: () => {
            pressingSpace = false;
          }
        }
      },
      4: { name: "", action: null },
      5: { name: "", action: null },
      6: { name: "", action: null },
      7: { name: "", action: null },
      8: { name: "", action: null },
      9: { name: "", action: null },
      10: { name: "", action: null },
      11: { name: "", action: null },
      12: {
        name: "up",
        action: {
          down: () => (pressingUp = true),
          up: () => stopPressing("up")
        }
      },
      13: {
        name: "down",
        action: {
          down: () => (pressingDown = true),
          up: () => stopPressing("down")
        }
      },
      14: {
        name: "left",
        action: {
          down: () => (pressingLeft = true),
          up: () => stopPressing("left")
        }
      },
      15: {
        name: "right",
        action: {
          down: () => (pressingRight = true),
          up: () => stopPressing("right")
        }
      }
    };
    this.actionButtons = {
      "WALK LEFT": "left",
      "WALK RIGHT": "right",
      JUMP: "up",
      CROUCH: "down",
      "PUNCH/WEAPON": "y",
      KICK: "b",
      "THROW WEAPON": "x"
    };
  }
  currentData() {
    let gamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads
      ? navigator.webkitGetGamepads
      : [];
    return gamepads[this.index];
  }
  buttonDown(b) {
    return typeof b == "object" ? b.pressed : b == 1.0;
  }
  monitorForPresses() {
    this.currentData().buttons.map((button, i) => {
      if (this.buttonDown(button)) {
        if (!this.currentlyPressedButtons.includes(i)) {
          console.log("pressing button", this.buttonMappings[i].name);
          this.currentlyPressedButtons.push(i);
          if (this.buttonMappings[i].action !== null) {
            this.buttonMappings[i].action.down();
          }
          // pressButton(this.buttonMappings.action, i);
        }
      } else {
        if (this.currentlyPressedButtons.includes(i)) {
          console.log("releasing button", this.buttonMappings[i].name);

          if (this.buttonMappings[i].action !== null) {
            this.buttonMappings[i].action.up();
          }
          // releaseButton(this.buttonMappings[i].action);
          this.currentlyPressedButtons.splice(
            this.currentlyPressedButtons.indexOf(i),
            1
          );
        }
      }
    });
  }
}

window.addEventListener("gamepaddisconnected", e => {
  console.error("Gamepad " + e.gamepad.index + " disconnected!");
  userGamepad = undefined;
  gamepadPollingInterval = setInterval(checkForNewGamepads, 1000);
	document.body.classList.remove("gamepad-connected");
	titleScreen.gamepadMessage.visible = false;
});

gamepadPollingInterval =
  "ongamepadconnected" in window
    ? null
    : setInterval(checkForNewGamepads, 1000);

function checkForNewGamepads() {
  console.log("checking for gamepads...");

  let gamepadAtIndex0 = navigator.getGamepads
    ? navigator.getGamepads()[0]
    : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads[0] : [])[0];
  if (gamepadAtIndex0) {
    console.error("Gamepad connected at index", gamepadAtIndex0.index);
    userGamepad = new UserGamepad(gamepadAtIndex0);
    clearInterval(gamepadPollingInterval);
		document.body.classList.add("gamepad-connected");
		titleScreen.gamepadMessage.visible = true;
  }
}
