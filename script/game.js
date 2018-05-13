"use strict";

// ***CONSTANTES***
const MAX_NUMBER_OF_CARDS = 22; // Nombre de cartes dans chaque set de thème. Chaque thème doit comporter ce nombre de cartes
const CARD_RATIO = 0.77; // Ratio de la largeur divisé par la hauteur
const OBSERVATION_TURN_DELAY = 700; // Délai pour visionner les cartes quand elles sont montrées au début du jeu
const BODY_TABLE_HEIGHT = 70; // Hauteur (pourcentage de la page) du body du tableau - Attention : prendre en compte la marge qui peut augmenter légèrement cette taille.
const TURNING_CARDS_DELAY = 100; // Temps que met une carte à être tournée
const TIME_SHOWING_CARDS = 1000; // Millisecondes pendant lesquelles les cartes sont montrées en début de partie si l'option est active
const FADE_OUT_TABLE = 1500; // Temps de disparition de la liste de cartes
const FADE_OUT_VICTORY_ITEMS = 1500; // Temps de disparition des éléments en cas de victoire
const FADE_IN_VICTORY_ITEMS = 2000; // Temps d'apparition des options suite à une victoire
const DELAY_CARDS_ACTIVATION = 600; // Délai d'activation des cartes

// ***VARIABLES***
var table_body = document.getElementById("cards_table_body");
var div_game_level = document.getElementById("game_level");
var div_found_pairs = document.getElementById("found_pairs");
var div_nb_tries = document.getElementById("nb_tries");
var div_nb_clicks = document.getElementById("nb_clicks");

var difficultyLevels = []; // Tableau des niveaux de difficulté
difficultyLevels.push(new DifficultyLevel(2, 2, true));     // niveau 00
difficultyLevels.push(new DifficultyLevel(3, 2, true));     // niveau 01
difficultyLevels.push(new DifficultyLevel(3, 2, false));    // niveau 02
difficultyLevels.push(new DifficultyLevel(4, 3, true));     // niveau 03
difficultyLevels.push(new DifficultyLevel(4, 3, false));    // niveau 04
difficultyLevels.push(new DifficultyLevel(4, 4, true));     // niveau 05
difficultyLevels.push(new DifficultyLevel(4, 4, false));    // niveau 06
difficultyLevels.push(new DifficultyLevel(5, 4, true));     // niveau 07
difficultyLevels.push(new DifficultyLevel(5, 4, false));    // niveau 08
difficultyLevels.push(new DifficultyLevel(6, 5, true));     // niveau 09
difficultyLevels.push(new DifficultyLevel(6, 5, false));    // niveau 10
difficultyLevels.push(new DifficultyLevel(6, 6, true));     // niveau 11
difficultyLevels.push(new DifficultyLevel(6, 6, false));    // niveau 12
difficultyLevels.push(new DifficultyLevel(7, 6, true));     // niveau 13
difficultyLevels.push(new DifficultyLevel(7, 6, false));    // niveau 14
difficultyLevels.push(new DifficultyLevel(8, 6, true));     // niveau 15
difficultyLevels.push(new DifficultyLevel(8, 6, false));    // niveau 16
difficultyLevels.push(new DifficultyLevel(9, 6, true));     // niveau 17
difficultyLevels.push(new DifficultyLevel(9, 6, false));    // niveau 18
difficultyLevels.push(new DifficultyLevel(10, 6, true));    // niveau 19
difficultyLevels.push(new DifficultyLevel(10, 6, false));   // niveau 20

var chosenTheme = "";
var playerName = "";
var gameDifficulty = 0;
var gameSound;
var player = JSON.parse(localStorage.getItem('playerPreference')); // Récupération des choix du joueur
console.log("PLAYER: ", player);
var musicPlayerOn = localStorage.getItem("musicPlayerOn");
if(player !== null){
    chosenTheme = player.theme; // Thème choisi
    playerName = player.name; // Nom du joueur
    gameDifficulty = player.difficulty; // Difficulté du jeu
    gameSound = player.sound; // Activation du son
} else {
    // Paramètres par défaut
    chosenTheme = "theme01";
    playerName = "Joueur1";
    gameDifficulty = 0;
    gameSound = "active";
}
var musicWindow = null;

var header = $('header');
var main = $('main');
var footer = $('footer');
var btn_pause = $('#btn_pause');
var btn_stop = $('#btn_stop');
var btn_reset = $('#btn_reset');
var btn_next = $('#btn_next');

var nbColumnsCardsTable = difficultyLevels[gameDifficulty].tableColumns; // Nombre de colonnes du tableau de cartes
var nbRowsCardsTable = difficultyLevels[gameDifficulty].tableRows; // Nombre de lignes du tableau de cartes
var paused = false; // Variable de pause
var nbTurnedCards = 0; // Nombre de cartes actuellement tournées
var nbTries = 0; // Nombre d'esssais
var nbClicks = 0; // Nombre de clics
var turnedCards = []; // Collection de cartes tournées actives
var foundPairs = 0; // Paires trouvées

// ***FONCTION PRINCIPALE***
/**
 * Gère la page et son initialisation
 */
(function () {
    // Initialisation de la page
    htmlNoOpacity();
    $(document).ready(function () {
        initializeGame();
    });
})();

// ***FONCTIONS***

/**
 * Niveau de difficulté
 * @param tableColumns {number}
 * @param tableRows {number}
 * @param bRevealed {boolean}
 * @constructor
 */
function DifficultyLevel(tableColumns, tableRows, bRevealed) {
    this.tableColumns = tableColumns !== null ? tableColumns : 4;
    this.tableRows = tableRows !== null ? tableRows : 4;
    this.bRevealed = bRevealed !== null ? bRevealed : true;
}

/**
 * Rend les éléments de la page HTML transparents
 */
function htmlNoOpacity() {
    header.css("opacity", 0);
    main.css("opacity", 0);
    footer.css("opacity", 0);
}

// VISUELS DES CARTES
/**
 * Attribue l'image de dos des cartes en fonction du thème passé en paramètre
 * @param theme {string}
 */
function setBackImage(theme){
    // Récupération de la liste des dos de cartes
    var class_card_back = document.getElementsByClassName("back");

    // Vérifie l'existence de dos de cartes
    if(class_card_back.length !== 0) {
        // Boucle sur l'ensemble des dos
        for(var k = 0; k < class_card_back.length; k++){

            // Application de l'image de dos selon le thème choisi
            class_card_back[k].style.backgroundImage = "url('images/" + theme + "/card_back.png')";
        }
    }
    else {
        // Absence de dos de carte
        console.log("Aucun dos de carte");
    }
}

/**
 * Attribue l'image de face de chaque carte en fonction du thème passé en paramètre
 * @param theme {string}
 */
function setFrontImage(theme){
    // Récupération de la liste des faces de cartes
    var class_card_front = document.getElementsByClassName("front");

    if(class_card_front !== 0) {
        // Création des indices à exploiter
        var indexesAvailable = [];

        // Nombre de fois où il faut alimenter les indices disponibles, en fonction du nombre de cartes
        var nbRound = Math.ceil(class_card_front.length / 2 / MAX_NUMBER_OF_CARDS);

        // Boucle pour alimenter les indices disponibles
        for(var i = 0; i < nbRound; i++){
            for(var j = 1; j <= MAX_NUMBER_OF_CARDS; j++) {
                indexesAvailable.push(j);
            }
        }

        // TEST
        console.log("**** TEST DE LA MISE EN PLACE DES CARTES ****");
        console.log("Nombre de cartes devant recevoir une image : ", class_card_front.length);
        console.log("Indices disponibles : ", indexesAvailable);
        console.log("Nombre d'indices disponibles : ", indexesAvailable.length);

        // Création du tableau d'indices aléatoires en double
        var frontImagesIndexes = [];

        // Boucle sur le nombre de paires de faces de cartes
        for(var k = 0; k < class_card_front.length / 2; k++){
            // Détermine un indice aléatoire dans la liste disponible
            var randomIndex = Math.floor(Math.random() * indexesAvailable.length);
            // Extrait cet indice de la liste
            var extractedIndex = indexesAvailable.splice(randomIndex, 1);
            // Implémente cet indice dans les indices à appliquer
            frontImagesIndexes.push(extractedIndex[0]);
            frontImagesIndexes.push(extractedIndex[0]);
        }

        // TEST
        console.log("Nombre d'indices d'images mis à disposition : ", frontImagesIndexes.length);

        // Nouvelle boucle sur le nombre de faces de cartes
        for(var l = 0; l < class_card_front.length; l++){
            // Détermine un indice aléatoire dans la liste disponible
            var randomImageIndex = Math.floor(Math.random() * frontImagesIndexes.length);
            // Extrait cet indice de la liste
            var extractedImageIndex = frontImagesIndexes.splice(randomImageIndex, 1);
            // Attribue cet indice d'image à la face de la carte
            class_card_front[l].style.backgroundImage = "url('images/" + theme + "/card_" + (extractedImageIndex[0] < 10 ? "0" + extractedImageIndex[0] : extractedImageIndex[0]) +".png')";
            // Attribue le même indice en tant que valeur à la carte
            class_card_front[l].parentNode.setAttribute("value", extractedImageIndex[0]);
        }

        // TEST
        console.log("Indices restant à attribuer à une carte : ", frontImagesIndexes.length);
        console.log("Indices disponibles restant : ", indexesAvailable.length);
        console.log("Ne pas oublier qu'un même indice sert pour deux cartes !");
        console.log("**** FIN DU TEST DE LA MISE EN PLACE DES CARTES ****");
    }
    else {
        // Absence de face de carte
        console.log("Aucune face de carte");
    }
}

/**
 * Change le thème si celui par défaut n'est pas sélectionné
 */
function setPageTheme() {
    changeCSS(chosenTheme);
    setBackImage(chosenTheme);
    setFrontImage(chosenTheme);
}

/**
 * Change le fichier CSS du thème
 * @param newTheme {string}
 */
function changeCSS(newTheme) {

    // Crée le nouveau lien CSS
    var newlink = document.createElement("link");
    newlink.setAttribute("id", "css_" + newTheme);
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", "style/" + newTheme + ".css");
    console.log(newlink);

    // Remplace le lien CSS
    document.getElementsByTagName("head").item(0).appendChild(newlink);
}

// GESTION DES CARTES
/**
 * Alimente le tableau du code HTML avec le nombre de lignes et de colonnes demandé. Chaque cellule contient une carte.
 * @param table_body {Element}
 * @param nbLines {number}
 * @param nbColumns {number}
 */
function setCards(table_body, nbLines, nbColumns){

    table_body.innerHTML = "";

    // Boucle d'implémentation des lignes
    for(var i = 0; i < nbLines; i++){

        // Création d'un bloc ligne
        var tr_line = document.createElement("tr");

        // Boucle d'implémentation des cellules de la ligne
        for(var j = 0; j < nbColumns; j++){

            // Création d'un bloc cellule
            var td_cell = document.createElement("td");

            // Création d'un div conteneur
            var div_container = document.createElement("div");
            // Affectation de la classe conteneur pour le CSS
            div_container.classList.add("container");
            // Définition de la hauteur des cartes en fonction de la hauteur réservée au tableau
            var cardHeight = BODY_TABLE_HEIGHT / nbLines;
            console.log("Largeur de carte : ", cardHeight);
            div_container.style.width =  cardHeight * CARD_RATIO + "vh";
            div_container.style.height = cardHeight + "vh";

            // Création d'un div carte
            var div_card = document.createElement("div");
            // Affectation de la classe carte pour le CSS
            div_card.classList.add("card", "not_found");

            // Création d'un div face
            var div_front = document.createElement("div");
            // Affectation de la classe face pour le CSS
            div_front.classList.add("front");

            // Création d'un div dos
            var div_back = document.createElement("div");
            // Affectationde de la classe dos pour le CSS
            div_back.classList.add("back");

            // Imbrication des éléments hiérarchiquement dans le code HTML
            div_card.appendChild(div_front);
            div_card.appendChild(div_back);
            div_container.appendChild(div_card);
            td_cell.appendChild(div_container);
            tr_line.appendChild(td_cell);
        }

        // Ajout de la ligne dans le corps du tableau du code HTML
        table_body.appendChild(tr_line);
    }
}

/**
 * Change la classe d'un bloc passé en paramètre pour tourner l'élément.
 * Si le bloc a déjà la classe, la fonction le retire, sinon elle l'ajoute.
 * @param targetedElement {Element}
 */
function flip(targetedElement){

    nbClicks++;
    div_nb_clicks.textContent = nbClicks < 10 ? "0" + nbClicks : nbClicks;

    targetedElement.classList.toggle("flipped"); // Ajout de classe pour tourner la carte

    checkTurnedCards(targetedElement);
}

/**
 * Applique le retournement sur l'objet appelant
 */
function applyflip() {
    flip(this);
}

/**
 * Active ou désactive les cartes
 * @param isBoolean {boolean}
 */
function activateAllCards(isBoolean){
    // Récupération de la liste de cartes
    var class_card = document.getElementsByClassName("card");

    // Vérifie s'il existe des cartes
    if(class_card.length !== 0){
        // Si activation
        if(isBoolean){
            // Boucle sur l'ensemble des cartes
            for(var i = 0; i < class_card.length; i++){
                // Affectation de la fonction onclick
                activate(class_card[i], true);
            }
        }
        else {
            // Boucle sur l'ensemble des cartes
            for(var j = 0; j < class_card.length; j++){
                // Suppression de la fonction onclick
                activate(class_card[j], false);
            }
        }
    }
    else {
        // Absence de carte
        console.log("Aucune carte");
    }
}

/**
 * Active ou désactive seulement les cartes non trouvées
 * @param isBoolean
 */
function activateNotFoundCards(isBoolean){
    // Récupération de la liste de cartes
    var class_card = document.getElementsByClassName("not_found");

    // Vérifie s'il existe des cartes
    if(class_card.length !== 0){
        // Si activation
        if(isBoolean){
            // Boucle sur l'ensemble des cartes
            for(var i = 0; i < class_card.length; i++){
                // Affectation de la fonction onclick
                activate(class_card[i], true);
            }
        }
        else {
            // Boucle sur l'ensemble des cartes
            for(var j = 0; j < class_card.length; j++){
                // Suppression de la fonction onclick
                activate(class_card[j], false);
            }
        }
    }
    else {
        // Absence de carte
        console.log("Aucune carte");
    }
}

/**
 * Si l'élément passé en paramètre est une carte, l'active ou la désactive
 * @param targetedElement {Element}
 * @param isBoolean {boolean}
 */
function activate(targetedElement, isBoolean){
    if(targetedElement.classList.contains("card")) {
        if(isBoolean){
            targetedElement.addEventListener("click", applyflip);
            targetedElement.style.cursor = 'pointer';
        } else {
            targetedElement.removeEventListener("click", applyflip);
            targetedElement.style.cursor = 'not-allowed';
        }
    }
}

/**
 * Tourne les cartes les unes après les autres selon un délai fixé en constante
 * @param cards {string}
 * @param counter {number}
 */
function turnCardsWithDelay(cards, counter) {
    setTimeout(function () {
        cards[counter].classList.toggle("flipped");
        counter++;
        if(counter < (nbColumnsCardsTable * nbRowsCardsTable)){
            turnCardsWithDelay(cards, counter);
        }
    }, TURNING_CARDS_DELAY)
}

/**
 * Montre les cartes quelques secondes avant le début de partie
 * @param bShow {boolean}
 */
function showCardsAtStartUp(bShow){
    if(bShow){
        var cards = document.getElementsByClassName("card");
        var i = 0;
        turnCardsWithDelay(cards, i);

        setTimeout(function () {
            turnCardsWithDelay(cards, i);
        }, (TURNING_CARDS_DELAY * nbRowsCardsTable * nbColumnsCardsTable) + TIME_SHOWING_CARDS);

        setTimeout(function () {
            activateAllCards(true);
            setStartingButtons();
            toggleTimer();
        }, DELAY_CARDS_ACTIVATION + 2 * (TURNING_CARDS_DELAY * nbRowsCardsTable * nbColumnsCardsTable) + TIME_SHOWING_CARDS);
    }
    else{
        setTimeout(function () {
            activateAllCards(true);
            setStartingButtons();
            toggleTimer();
        }, DELAY_CARDS_ACTIVATION);
    }
}

// CONFIGURATION DES BOUTONS

/**
 * Configure le bouton "Pause"
 */
function setPauseButton() {
    btn_pause = $('#btn_pause')
        .on("click", function () {
            if(paused){
                activateNotFoundCards(true);
                $(this).css("color", "black");
                myTimer.style.color = "black";
                myTimer.previousElementSibling.style.color = "black";
                paused = false;
            }
            else{
                activateNotFoundCards(false);
                $(this).css("color", "red");
                myTimer.style.color = "red";
                myTimer.previousElementSibling.style.color = "red";
                paused = true;
            }
        })
        .prop("disabled", false)
        .css({cursor: 'pointer'});
}

/**
 * Configure le bouton "Arrêter"
 */
function setStopButton() {
    btn_stop = $('#btn_stop')
        .on("click", function () {
            if(isGameFinished()){
                // Placer ici le code pour sauvegarder les scores
                // ...
            }
            $('header').fadeOut(FADE_OUT_TABLE);
            $('main').fadeOut(FADE_OUT_TABLE);
            $('button').fadeOut(FADE_OUT_TABLE);
            setTimeout(function () {
                window.location.href = "index.html" ; // Retour à la page d'accueil
            }, FADE_OUT_TABLE);

            musicPlayerOn = localStorage.getItem("musicPlayerOn");
            console.log("Music player : ", musicPlayerOn);
            if(musicPlayerOn){
                console.log("in music player");
                if(musicWindow !== null && !musicWindow.closed){
                    musicWindow.close();
                }
                localStorage["musicPlayerOn"] = false;
            }
        })
        .prop('disabled', false)
        .css({cursor: 'pointer'});

}

/**
 * Configure le bouton réinitialiser
 */
function setResetButton(){
    btn_reset = $('#btn_reset')
        .on("click", function () {
            $('header').fadeOut(FADE_OUT_TABLE);
            $('main').fadeOut(FADE_OUT_TABLE);
            $('button').fadeOut(FADE_OUT_TABLE);
            setTimeout(function () {
                window.location.href = "game.html" ;
            }, FADE_OUT_TABLE);
        })
        .prop("disabled", false)
        .css({cursor: 'pointer'});
}

/**
 * Configure le bouton Niveau Suivant
 */
function setNextButton() {
    btn_next = $('#btn_next')
        .on("click", function () {
            $('header').fadeOut(FADE_OUT_TABLE);
            $('main').fadeOut(FADE_OUT_TABLE);
            $('button').fadeOut(FADE_OUT_TABLE);
            player.difficulty++;
            localStorage["playerPreference"] = JSON.stringify(player);
            setTimeout(function () {
                window.location.href = "game.html" ;
            }, FADE_OUT_TABLE);
        })
        .prop("disabled", false)
        .css({cursor: 'pointer'})
        .hide();
}

/**
 * Désactive tous les boutons
 */
function deactivateButtons() {
    $('button').prop("disabled", true).css({cursor: 'not-allowed'});
}

/**
 * Configure les boutons de départ du jeu
 */
function setStartingButtons(){
    setPauseButton();
    setStopButton();
    setResetButton();
}

// GESTION DE LA PARTIE
/**
 * Vérifie la carte passée en paramètre pour voir s'il s'agit de la première tournée ou non. En fonction de la
 * situation procède aux changements d'état nécessaires
 * @param lastTurnedCard
 */
function checkTurnedCards(lastTurnedCard) {

    switch(nbTurnedCards){ // Vérification du nombre de cartes actives tournées
        case 0: // Première carte tournée

            nbTurnedCards++; // Incrémentation du nombre de cartes tournées

            lastTurnedCard.classList.add("active"); // Ajout de classe pour marquer la carte
            break;

        case 1: // Seconde carte tournée

            lastTurnedCard.classList.add("active"); // Ajout de classe pour marquer la carte

            // Récupération de toutes les cartes marquées
            turnedCards = document.getElementsByClassName("active");

            // Si les cartes marquées sont de même valeur
            if(turnedCards.length > 1 && turnedCards[0].getAttribute("value") === turnedCards[1].getAttribute("value")){
                // Boucle à l'envers pour éviter les décalages d'indices
                for(var i = turnedCards.length - 1; i >= 0; i--){
                    activate(turnedCards[i], false); // Retire la fonction du clic
                    turnedCards[i].classList.remove("active", "not_found"); // Retire la marque
                }
                foundPairs++;// Incrémente le nombre de paires trouvées
                div_found_pairs.textContent = foundPairs < 10 ? "0" + foundPairs : foundPairs;

                if(isGameFinished()){ // Vérifie si le jeu est fini
                    console.log("Jeu fini");
                    toggleTimer();
                    var score = calculateScore(timeInSecond(), nbColumnsCardsTable*nbRowsCardsTable , nbTries +1, player);
                    console.log("score: ", score);
                    var isHS = isHighScore(score, player.difficulty);
                    console.log(isHS);
                    displayVictoryScreen(score, isHS); // Affiche l'écran de victoire

                }
            }
            else{
                // Délai pour avoir le temps de voir les cartes différentes
                setTimeout(function () {
                    // Boucle à l'envers pour éviter les décalages d'indices
                    for(var j = turnedCards.length - 1; j >= 0; j--){
                        // Retire la marque et retourne la carte
                        turnedCards[j].classList.remove("active", "flipped");
                    }
                }, OBSERVATION_TURN_DELAY);
            }
            nbTurnedCards = 0; // Réinitialise le nombre de cartes tournées
            nbTries++;
            div_nb_tries.textContent = nbTries < 10 ? "0" + nbTries : nbTries;
            break;
        default:
            nbTurnedCards = 0; // Sécurité qui réinitialise le nombre de cartes tournées
            // Boucle à l'envers pour éviter les décalages d'indices
            for(var k = turnedCards.length - 1; k >= 0; k--){
                turnedCards[k].classList.remove("active", "flipped"); // Retire la marque
            }
            break;
    }
}

/**
 * Iniitalise les variables de jeu
 */
function initializeVariables() {
    if(nbTurnedCards !== 0){
        nbTurnedCards = 0;
    }

    if(nbTries !== 0){
        nbTries = 0;
    }

    if(nbClicks !== 0){
        nbClicks =0;
    }

    if(foundPairs !== 0){
        foundPairs = 0;
    }

    if(turnedCards.length > 0){
        for(var i = turnedCards.length - 1; i >= 0; i--){
            // Retire la marque et retourne la carte
            turnedCards[i].classList.remove("active");
        }
    }
}

/**
 * Initialise la partie
 */
function initializeGame(){

    header
        .delay(TURNING_CARDS_DELAY)
        .animate({
            "opacity": 1
        },{
            duration: "slow"
        });
    main
        .delay(TURNING_CARDS_DELAY)
        .animate({
            "opacity": 1
        }, {
            duration: "slow"
        });
    footer
        .delay(TURNING_CARDS_DELAY)
        .animate({
            "opacity": 1
        }, {
            duration: "slow"
        });

    setCards(table_body, nbRowsCardsTable, nbColumnsCardsTable);
    setPageTheme();

    deactivateButtons();
    if(gameDifficulty < 20){
        setNextButton();
    }
    initializeVariables();
    div_game_level.textContent = gameDifficulty < 10 ? "0" + gameDifficulty : gameDifficulty;
    div_found_pairs.textContent = "00";
    div_nb_tries.textContent = "00";
    div_nb_clicks.textContent = "00";

    showCardsAtStartUp(difficultyLevels[gameDifficulty].bRevealed);

    setMusic();
}

function setMusic() {
    if(gameSound === "active"){
        console.log("Sound active");

        if(musicPlayerOn === null || musicPlayerOn === "false"){
            console.log("musicPlayerOn", musicPlayerOn);
            musicWindow = window.open("music.html", "lecteur", "resizable=0,toolbar=no,status=no,width=150,height=100");
            localStorage["musicPlayerOn"] = true;
        }
    }
    else{
        musicWindow = window.open("", "lecteur", "width=200,height=100");
        musicWindow.close();
    }
}


/**
 * Vérifie si la partie est finie
 * @returns {boolean}
 */
function isGameFinished() {
    var answer = false;

    if((nbColumnsCardsTable * nbRowsCardsTable / 2) === foundPairs){
        answer = true;
    }

    return answer;
}

/**
 * Affiche l'écran de victoire avec le bouton de retour vers l'accueil
 */
function displayVictoryScreen(score, isHighScore) {
    $("#cards_table").fadeOut(FADE_OUT_TABLE);
    $('button').fadeOut();
    setTimeout(function () {
        var p_victory_message = $('<p>').appendTo($('main'));
        p_victory_message.append("Victoire !<br/>Bien joué, " + playerName + "<br/> Score: "+score + ((isHighScore) ? "<br/> Meilleur score" : "" ));
        p_victory_message.addClass("victory_text");
        p_victory_message.fadeIn(FADE_IN_VICTORY_ITEMS);

        btn_stop = $('#btn_stop');
        btn_reset = $('#btn_reset');
        btn_next = $('#btn_next');

        btn_stop.fadeIn(FADE_IN_VICTORY_ITEMS);
        btn_reset.fadeIn(FADE_IN_VICTORY_ITEMS);
        btn_next.fadeIn(FADE_IN_VICTORY_ITEMS);

    }, FADE_OUT_VICTORY_ITEMS);
}