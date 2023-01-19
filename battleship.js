const view = {
    displayMessage: function (msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

const model = {
    boardSize: 7,
    numShips: 3,
    shipSunk: 0,
    shipLength: 3,
    ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }],
    generateShips: function () {
        let location;
        for (let i = 0; i < this.numShips; i++) {
            do {
                location = this.generateShipLocation();
            } while (this.collision(location));
            this.ships[i].locations = location;
        }
    },
    collision: function (location) {
        let ship;
        for (let i = 0; i < this.numShips; i++) {
            ship = this.ships[i];
            for (let j = 0; j < location.length; j++) {
                if (ship.locations.indexOf(location[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },
    generateShipLocation: function () {
        let direction = Math.floor(Math.random() * 2);
        let row;
        let col;
        let shipLocation = [];
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength - 1)));
            for (let i = 0; i < this.shipLength; i++) {
                shipLocation.push(row + "" + (col + i));
            }
        } else {
            col = Math.floor(Math.random() * this.boardSize);
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength - 1)));
            for (let i = 0; i < this.shipLength; i++) {
                shipLocation.push((row + i) + "" + col);
            }
        }
        return shipLocation;
    },
    fire: function (guess) {
        let ship;
        let index;
        for (let i = 0; i < this.numShips; i++) {
            ship = this.ships[i];
            index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hits";
                view.displayHit(guess);
                view.displayMessage("HIT!")
                if (this.isSunk(ship)) {
                    this.shipSunk++;
                    view.displayMessage("You sunk my " + this.shipSunk + " battleship!")
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You Missed");
        return false;
    },
    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hits") {
                return false;
            }
        }
        return true;
    }
}

const controller = {
    guesses: 0,
    alphabet: [["A", "B", "C", "D", "E", "F", "G"], ["a", "b", "c", "d", "e", "f", "g"]],
    processGuess: function (guess) {
        let char1OfGuess;
        let char1 = NaN;
        let char2;
        if (guess == null || guess.length !== 2) {
            alert("OOPS! please Enter a letter and number");
        } else if (!(isNaN(guess.charAt(0))) && !(isNaN(guess.charAt(1)))) {
            return guess;
        } else {
            char1OfGuess = guess.charAt(0);
            char2 = guess.charAt(1);
            for (let i = 0; i < this.alphabet.length; i++) {
                let index = this.alphabet[i].indexOf(char1OfGuess);
                if (index >= 0) {
                    char1 = index;
                }
            }
            if (isNaN(char1) || isNaN(char2)) {
                alert("OOPS! Not on the board");
            } else if (char1 >= model.boardSize || char2 >= model.boardSize) {
                alert("OOPS! Off the board");
            } else {

                return char1 + char2;
            }
        }
        return null;
    },
    applyGuess: function (guess) {
        let location = this.processGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipSunk === model.numShips) {
                view.displayMessage("You sunk all my battleship in " + this.guesses + " guesses.")
                alert("Game over!")
            }
        }
    }
}

function init() {
    let fireButton = document.getElementById("fireButton");
    let guessInput = document.getElementById("guessInput");
    let table = document.getElementById("table");
    table.addEventListener("click", handleTable)
    fireButton.onclick = handleFireButton;
    guessInput.onkeydown = handleKeyPress;
    model.generateShips();
}
function handleTable(e) {
    let target = e.target.id;
    controller.applyGuess(target);
}
function handleFireButton() {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
    controller.applyGuess(guess);
    guessInput.value = "";
}
function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}



window.onload = init;







