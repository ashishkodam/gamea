(function (document) {

    console.log(" tesing Chain reaction... ");


    ///Start Game//
    const form1 = document.getElementById('newGameRoom');
    const form2 = document.getElementById('joinGameRoom');
    const firstPlayer = form1.fnametext;
    const secoundPlayer = form2.snametext;
    const roomNumber = form2.roomnumber;
    let gameGrid;
    let totalPlayer = 2;
    let currentPlayer;
    let checkPlayer;
    let winner = 0;
    let isActivePlayer;
    let hasCompletedFirstRound;
    let playerColor = ['#E33C2A', '#372D76']

    let startNewGame = function () {
        document.getElementById("nR").style.display = "none";
        document.getElementById('card-style').style.display = "none"
        document.getElementById("jR").style.display = "none";

        let startNewGameBtn = document.querySelector("input[name=newgame]");
        startNewGameBtn.addEventListener("click", function () {
            if (firstPlayer.value != '') {

                socket = io();
                // // socket.on('news', function (data) {
                // //     console.log(data);
                socket.emit('sendName', { palyerName: firstPlayer.value });
                //     socket.on('news', message => {console.log(message)})
                // //   });
                socket.on('newGame', message => {
                    console.log(message);
                    document.getElementById("changF-text").innerHTML = `${'Hai'} ${firstPlayer.value}!${' New Room'} ${message.room} ${'Created'}`;
                    alert('Share the Room number')
                    document.getElementById("nR").style.opacity = "0.5";
                })

                socket.on('asuccess', message => {
                    snackbar.createSnackbar(message, {
                        theme: 'light',
                        position: 'right',
                        duration: 1000

                    })

                });
                socket.on('secoundSucces', message => {
                    snackbar.createSnackbar(message, {
                        theme: 'light',
                        position: 'right',
                        duration: 1000
                    });
                    document.getElementById("nR").style.opacity = "1";
                    gameGrid = createGrid(9, 6); /*Pass rows And col*/
                    setBoard(9, 6);
                    CheckingPlayer(); /* checking chance*/
                    startGame(); /*initail game */
                });

            }
            if (firstPlayer.value == '') {
                alert('Enter the player details')
            }
            //}
        });
        let JoinGameBtn = document.querySelector("input[name=joinGame]");
        JoinGameBtn.addEventListener("click", function () {
            socket = io();
            socket.emit('joinRoom', {
                'playerName': secoundPlayer.value,
                'roomno': roomNumber.value
            });
            socket.on('bsuccess', message => {
                snackbar.createSnackbar(message.message, {
                    theme: 'light',
                    position: 'right',
                    duration: 1000

                });
                document.getElementById("changing-text").innerHTML = `${'Hai'} ${message.playerName}!${'Successfully Joined To Room'} ${roomNumber.value}`;
                gameGrid = createGrid(9, 6); /*Pass rows And col*/
                setBoard(9, 6);
                CheckingPlayer(); /* checking chance*/
                startGame(); /*initail game */

            });
        });

    }

    let createGrid = function (rows, columns) {
        let grid = new Array();
        for (let row = 0; row < rows; row++) {
            let rowArray = new Array();
            for (let col = 0; col < columns; col++) {
                let state = {
                    player: 0,
                    atoms: 0
                }
                rowArray.push(state);
            }
            grid.push(rowArray);
        }
        console.log(grid)
        return grid;
    }
    // end //

    // set up board//
    let setBoard = function (rows, columns) {

        let gameboard = document.querySelector("div#mygameboard");
        cleargameboard();

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                attributes = {
                    "class": "box",
                    "data-row": row,
                    "data-column": col
                }
                let box = createAnElement("div").modify(attributes);
                gameboard.appendChild(box);
            }
        }
        //console.log(random)
        gameboard.style.width = "" + (columns * 50) + "px";
        gameboard.style.height = "" + (rows * 50) + "px";

    }

    // end //

    let cleargameboard = function () {
        winner = 0;
        let gameboard = document.querySelector("div#mygameboard");
        gameboard.innerHTML = "";
    }

    let freezegameboard = function () {
        let gameboard = document.querySelector("div#mygameboard");
        gameboard.classList.add = "freeze";
    }

    let createAnElement = function (elementName) {

        let element = document.createElement(elementName);

        let get = function () {
            return element;
        }
        let modify = function (attributes) {
            for (let key of Object.keys(attributes))
                element.setAttribute(key, attributes[key]);
            return element;
        }
        return {
            'get': get,
            'modify': modify
        }
    }

    ////changes///
    let CheckingPlayer = function () {

        let playerNumbers = new Array();

        isActivePlayer = new Array();
        hasCompletedFirstRound = new Array();

        for (let i = 1; i <= totalPlayer; i++) {
            playerNumbers.push(i);
            isActivePlayer.push(true);
            hasCompletedFirstRound.push(false);
        }

        checkPlayer = getChance(playerNumbers);
    }


    let getChance = function* (players) {
        let index = 0;

        while (true) {

            if (index < players.length) {
                if (isActivePlayer[index]) {
                    yield players[index];
                    index += 1;
                } else {
                    while (index < players.length && !isActivePlayer[index]) {
                        index += 1;
                    }
                }
            } else {
                index = 0;
                if (isActivePlayer[index]) {
                    yield players[index];
                    index += 1;
                } else {
                    while (index < players.length && !isActivePlayer[index]) {
                        index += 1;
                    }
                }
            }
        }
    }

    ///end//
    let startGame = function () {
        nextPlayer();
        initializeGrid();
    }

    let nextPlayer = function () {

        currentPlayer = checkPlayer.next();
        console.log(currentPlayer)
        switch (currentPlayer.value) {
            case 1:

                box = document.getElementsByClassName('box')
                for (let i = 0; i < box.length; i++) {
                    box[i].style.borderColor = playerColor[0];
                }
                // document.querySelector('.chance1').style.display="block"
                // document.querySelector('.chance2').style.display="none"
                break;

            case 2:

                box = document.getElementsByClassName('box')
                for (let i = 0; i < box.length; i++) {
                    box[i].style.borderColor = playerColor[1];
                }
                //  document.querySelector('.chance2').style.display="block";
                //  document.querySelector('.chance1').style.display="none"
                break;
        }


    }

    let initializeGrid = function () {

        let cells = document.querySelectorAll("div.box");
        //console.log('cell',cells)
        for (let cell of cells) {
            cell.addEventListener("click", function (event) {

                if (winner <= 0) {
                    let thisCell = this;
                    let clickedCol = thisCell.getAttribute("data-column");
                    let clickedRow = thisCell.getAttribute("data-row");
                    playerChance(clickedRow, clickedCol);

                }

            });
        }

    }

    let playerChance = function (clickedRow, clickedCol) {

        console.log(clickedRow, clickedCol)
        let player = currentPlayer.value;
        // console.log(player)
        let cellState = gameGrid[clickedRow][clickedCol];
        // console.log(cellState)
        let isMyCell = (cellState.player === player);
        let isEmptyCell = (cellState.player === 0);

        if (isMyCell || isEmptyCell) {
            socket.emit('rowColl', {
                clickedCol: clickedCol,
                clickedRow: clickedRow
            })
            //console.log('testing')
            chanceOfPlayer(player);
            hasCompletedFirstRound[player - 1] = true;
            if (winner <= 0)
                nextPlayer();
        }

    }

    let chanceOfPlayer = function (player) {
        console.log(player)
        let clickedRow;
        let clickedCol;
        socket.on('clickedR&C', data => {
            console.log(data)
            let location = getclickpointer(data.clickedRow, data.clickedCol);
            let cellState = gameGrid[data.clickedRow][data.clickedCol];
            let atoms = cellState.atoms;

            let checkIsGameOver = gameStatus();

            console.log(checkIsGameOver)
            let isGameOver = checkIsGameOver.status;

            let split = false;

            switch (location) {
                case "corner":
                    if (atoms == 1) split = true;
                    break;
                case "border":
                    if (atoms == 2) split = true;
                    break;
                case "inner":
                    if (atoms == 3) split = true;
                    break;
            }
            if (split) {

                clearCell(data.clickedRow, data.clickedCol);

                setTimeout(function () {
                    let adjCells
                        = changesInCell(data.clickedRow, data.clickedCol);
                    for (let i = 0; i < adjCells.length; i++) {
                        let cellPositions = adjCells[i];
                        if (cellPositions.length > 0) {
                            let newRow = cellPositions[0];
                            let newCol = cellPositions[1];

                            if (!isGameOver) {
                                chanceOfPlayer(newRow, newCol, player);
                            } else {

                                switch (winner) {
                                    case 1:
                                        playerColors = playerColor[0];
                                        winnerPlayer = firstPlayer;
                                        break;

                                    case 2:
                                        playerColors = playerChance[1];
                                        winnerPlayer = firstPlayer
                                        break;
                                }


                                var whosChance = document.querySelector(".winner");
                                whosChance.innerText = "Player " + winnerPlayer + " won!!";
                                console.log('eeeeeeeeeeeeeeeeeeeeee');

                                //document.querySelector('#fourth').remove()
                                //document.getElementById('restartButton').style.display="block";

                                box = document.getElementsByClassName('box')
                                for (let i = 0; i < box.length; i++) {
                                    box[i].style.borderColor = playerColors;
                                }
                                freezegameboard();
                            }
                        }
                    }
                }, 200);

            } else {

                atoms++;
                cellState.atoms = atoms;
                cellState.player = player;
                console.log('cellState.player', cellState.player, 'cellState.atoms', cellState.atoms)
                handlingCell(data.clickedRow, data.clickedCol, atoms, player);

            }
        })
       
    }

    let getclickpointer = function (rowLoc, colLoc) {
        let totalRows = gameGrid.length - 1;
        let totalCols = gameGrid[0].length - 1;

        if (rowLoc == 0 && colLoc == 0
            || rowLoc == 0 && colLoc == totalCols
            || rowLoc == totalRows && colLoc == 0
            || rowLoc == totalRows && colLoc == totalCols) {
            return "corner";
        }
        else if (rowLoc == 0
            || colLoc == 0
            || rowLoc == totalRows
            || colLoc == totalCols) {
            return "border"
        }
        else return "inner";
    }

    let gameStatus = function () {

        let totalRows = gameGrid.length;
        let totalCols = gameGrid[0].length;

        let checkActivePlayer = new Array();
        for (let i = 0; i < totalPlayer; i++)
            checkActivePlayer.push(false);


        for (let row = 0; row < totalRows; row++) {
            for (let col = 0; col < totalCols; col++) {

                let cellState = gameGrid[row][col];
                let player = cellState.player;

                if (player !== 0 && !checkActivePlayer[player - 1]) {
                    checkActivePlayer[player - 1] = true;
                }
            }
        }

        for (let i = 0; i < totalPlayer; i++) {
            if (!hasCompletedFirstRound[i])
                checkActivePlayer[i] = true;
        }

        for (let i = 0; i < totalPlayer; i++) {
            isActivePlayer[i] = checkActivePlayer[i]
        }
        let playersCount = 0;
        for (let i = 0; i < totalPlayer; i++) {
            if (checkActivePlayer[i]) {
                winner = i + 1;
                playersCount++;
                if (playersCount > 1) {
                    winner = 0;
                    return { status: false };
                }
            }
        }

        console.log(winner)
        switch (winner) {
            case 1:
                playerColors = playerColor[0];
                winnerPlayer = firstPlayer;
                break;

            case 2:
                playerColors = playerColor[1];
                winnerPlayer = firstPlayer
                break;
        }

        var whosChance = document.querySelector(".winner");
        whosChance.innerText = "Player " + winnerPlayer + " won!!";

        console.log('wwwwwwwwwwwwwwwwwwwwwwww');
        //document.getElementById('restartButton').style.display="block";

        // restartFunction() 

        box = document.getElementsByClassName('box')
        for (let i = 0; i < box.length; i++) {
            box[i].style.borderColor = playerColors;
        }

        freezegameboard();
        return {
            status: true
        };
    }
    let clearCell = function (clickedRow, clickedCol) {
        let cellState = gameGrid[clickedRow][clickedCol];
        cellState.atoms = 0;
        cellState.player = 0;
        let cell
            = document.querySelector("div.box[data-column='" + clickedCol + "'][data-row='" + clickedRow + "']");
        cell.innerHTML = "";
    }

    let changesInCell = function (clickr, clickc) {

        let totalRows = gameGrid.length - 1;
        let totalCols = gameGrid[0].length - 1;

        clickr = parseInt(clickr);
        clickc = parseInt(clickc);

        let top = new Array()
        let right = new Array()
        let bottom = new Array()
        let left = new Array()
        let topRight = new Array()
        let topLeft = new Array()
        let bottomRight = new Array()
        let bottomLeft = new Array();

        if (clickr - 1 >= 0) {
            top.push(clickr - 1);
            top.push(clickc);

            if (clickc + 1 <= totalRows) {
                topRight.push(clickr - 1);
                topRight.push(clickc + 1);
            }

            if (clickc - 1 >= 0) {
                topLeft.push(clickr - 1);
                topLeft.push(clickc - 1);
            }
        }

        if (clickc + 1 <= totalRows) {
            right.push(clickr);
            right.push(clickc + 1);
        }


        if (clickr + 1 <= totalRows) {
            bottom.push(clickr + 1);
            bottom.push(clickc);

            if (clickc - 1 >= 0) {
                bottomLeft.push(clickr + 1);
                bottomLeft.push(clickc - 1);
            }

            if (clickc + 1 <= totalRows) {
                bottomRight.push(clickr + 1);
                bottomRight.push(clickc + 1);
            }
        }

        if (clickc - 1 >= 0) {
            left.push(clickr);
            left.push(clickc - 1);
        }


        let sides = new Array();
        sides.push(top);
        sides.push(right);
        sides.push(bottom);
        sides.push(left);
        //break;

        return sides;
    }

    var handlingCell = function (row, col, atoms, player) {
        switch (currentPlayer.value) {
            case 1:
                playerColors = playerColor[0]
                break;

            case 2:
                playerColors = playerColor[1]
                break;
        }

        var box = document.querySelector("div.box[data-column='" + col + "'][data-row='" + row + "']");
        console.log('box', box)
        box.innerHTML = "";

        var numberInWords = {
            1: "one",
            2: "two",
            3: "three"
        }

        attributes = {
            "class": "atom-container " + numberInWords[parseInt(atoms)] + ""
        }
        var atomContainer = createAnElement("div").modify(attributes);

        for (var i = 0; i < atoms; i++) {

            attributes = { "class": "atom " + numberInWords[(i + 1)] + "" }
            var atom = createAnElement("div").modify(attributes);
            // console.log(atom.style.background 
            // 	= "radial-gradient(circle at 10px 10px, "+ playerColors +", #000)")
            atom.style.background
                = "radial-gradient(circle at 10px 10px, " + playerColors + ", #000)";

            atomContainer.appendChild(atom);
        }

        box.appendChild(atomContainer);

    }

    startNewGame()
})(document);
function OnChangeRadio(radio) {
    const roomType = radio.value
    console.log(roomType)
    switch (roomType) {
        case '0':
            console.log('new')
            document.getElementById("nR").style.display = "block";
            document.getElementById('card-style').style.display = "block"
            document.getElementById("jR").style.display = "none";
            break;
        case '1':
            console.log('join')
            document.getElementById("jR").style.display = "block";
            document.getElementById('card-style').style.display = "block"
            document.getElementById("nR").style.display = "none";
            break;
    }
}
