(() => {
  "use strict";

  let deck = [];
  const tipes = ["C", "D", "H", "S"], specials = ["A", "J", "Q", "K"];

  let playersPoints = [], playerCredits = 5000, quantity = 0;

  /*

    This function is responsible for initializing the game, 
    returning the function that is responsible for creating the deck.

  */

  const gameInitialization = (nPlayers = 2) => {
    playersPoints = [];

    btn_newGame.disabled = true;
    btn_bet.disabled = false;
    deck = createDeck();

    for(let i = 0; i < nPlayers; i++) {
      playersPoints.push(0);
    }
    points.forEach(e => e.innerText = 0);
    divCards.forEach(e => e.innerHTML = '');

  }
  
  /*
  
    This function creates a shuffled deck of cards.

  */
  const createDeck = () => {

    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let tipe of tipes) {
        deck.push(i + tipe);
      }
    }

    for (let tipe of tipes) {
      for (let special of specials) {
        deck.push(special + tipe);
      }
    }
    return _.shuffle(deck);

  };



  /* 

    This function allows me to take a letter.
  
  */

  const takeCard = () => deck.length === 0 ? alert("There are no more cards in the deck") : deck.pop();
  
  /*
  
    This function shows the value of card.
  
  */ 

  const showValue = (card) => {
    const value = card.substring(0, card.length - 1);
    return value.includes('A') ? 11 : isNaN(value) ? 10 : parseInt(value);
  };

  //========== References ==========//

  const btn_request = document.querySelector("#btn-request"),
   btn_stop = document.querySelector("#btn-stop"),
   btn_newGame = document.querySelector("#btn-newGame"),
   btn_bet = document.querySelector("#btn-bet"),
   points = document.querySelectorAll("small"),
   divCards = document.querySelectorAll(".divCards"),
   title = document.querySelector(".title"),
   credits = document.querySelector('#credit');
   title.innerText = "Blackjack 🃏";
  //========== Events And Functions ==========//

  /*
  
    This function takes care of the player reward system.
  
  */

  const bet = () => {
    if (playerCredits <= 0) {
      btn_request.disabled = true;
      credits.innerText = playerCredits;
      alert("No credit 😢");
    } else {
      btn_request.disabled = false;
      btn_newGame.disabled = true;
      btn_stop.disabled = false;
      quantity = prompt("Please enter a quantity");
      if (quantity > playerCredits) {
        alert("Insufficient credits");
        btn_request.disabled = true;
        btn_newGame.disabled = false;
        btn_stop.disabled = true;
      } else {
        btn_request.disabled = false;
        btn_newGame.disabled = true;
        btn_stop.disabled = false;
        credits.innerText = playerCredits - quantity;
        playerCredits = playerCredits - quantity;
        btn_bet.disabled = true;
      }
    }
  };


/*

  This function is responsible for stopping the game, to pass the turn to the computer

*/


  const stop = () => {
    turnComputer(playersPoints[0]);
  };


   /*

    This function is responsible for accumulating the points of the players

  */

  const pointsAccumulator = (turn, card) => {
    playersPoints[turn] += showValue(card);
    points[turn].innerText = playersPoints[turn];
    return playersPoints[turn];
  }


  const divDecks = (card, turn) => {
    const addNewcard = document.createElement('img');
    addNewcard.src = `/assets/deck/${card}.png`;
    addNewcard.classList.add("cards");
    divCards[turn].append( addNewcard );
  }



  /*

    This function executes the computer's turn. 
    This same one is in charge of taking the necessary cards to beat the player and finally determine who is the winner.

  */


  const turnComputer = (minimumPoints) => {
    let pointsComputer = 0;
    do {
      let card = takeCard();
      pointsComputer = pointsAccumulator(playersPoints.length - 1, card);
      divDecks(card, playersPoints.length - 1);
    } while ((pointsComputer < minimumPoints) && (minimumPoints <= 21));

    btn_request.disabled = true;
    btn_newGame.disabled = false;
    btn_stop.disabled = true;
    btn_bet.disabled = true;
    points[1].innerText = pointsComputer;
    win();
  };

  /*

    This function is responsible for determining the winner of the round, comparing the final points of the player and the computer.

  */

  const win = () => {
    const [pointP, pointC] = playersPoints;
    setTimeout(() => {
      if (pointP > 21) {
        alert("LOSE");
      } else if (pointP === pointC) {
        playerCredits += parseInt(quantity);
        credits.innerText = playerCredits;
        alert("DRAW");
      } else if (pointC > 21) {
        credits.innerText = playerCredits += quantity * 2;;
        alert("WIN");
      } else {
        alert("LOSE");
      }
    }, 100);
    return btn_newGame.enabled = true;
  };



  //=========== Buttons ================//

  //Button newGame

  btn_newGame.addEventListener("click", () => {
    gameInitialization();
  });

  //Button request
  btn_request.addEventListener("click", () => {
    const card = takeCard();
    const addNewcard = document.createElement("img");

    const playerPoints = pointsAccumulator(0, card);

    divDecks(card, 0);

    if (playerPoints === 21) {
      turnComputer(playerPoints);
    } else if (playerPoints > 21) {
      turnComputer(playerPoints);
    }

    return playerPoints;
  });

  //Button bet
  btn_bet.addEventListener("click", () => {
    bet();
  });

  //Button stop
  btn_stop.addEventListener("click", () => {
    stop();
  });



})();
