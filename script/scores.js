function PlayerScore(playerName, time ,nbTry, score, level) {
    this.playerName = playerName;
    this.time = time;
    this.nbTry = nbTry;
    this.score = score;
    this.level = level;
    this.date = new Date();
}

function calculateScore(time, nbCards, nbTries, player){
// Le score maximum est de 100 000: 50 000 sont attribués au temps et 50 000 au nombre de tentatives
    var scoreTime = 50000;
    var scoreTries = 50000;

    // Nombre de tentatives minimales nécessaire à la réalisation du niveau
    var nbTriesMin = nbCards/2;

    // Attribution de la pénalité pour chaque secondes supplémentaire et tentative nécessaire selon niveau
    var timePenalty = 0;
    var triesPenalty = 0;

    if (player.difficulty <= 4){
        timePenalty = 500;
        triesPenalty =4000;
    }
    else if (player.difficulty <= 8){
        timePenalty = 400;
        triesPenalty =2500;
    }
    else if (player.difficulty <= 12){
        timePenalty = 300;
        triesPenalty =1500;
    }
    else if (player.difficulty <= 16){
        timePenalty = 200;
        triesPenalty =750;
    }
    else {
        timePenalty = 100;
        triesPenalty =500;
    }

    scoreTries -= (nbTries-nbTriesMin)*triesPenalty; // Enlève des points lorsqu'on dépasse le nombre de tentatives minimales
    if (scoreTries<0){
        scoreTries =0;
    }
    scoreTime -= (time-(nbTriesMin))*timePenalty;  // Enlève des points à partir du nombre de tentatives minimale en seconde
    if (scoreTime<0){
        scoreTime=0;
    }


    // Sauvegarde des scores
    storeScore(player.name, time, nbTries, scoreTime+scoreTries, player.difficulty);

    // valeur de retour
    return scoreTime+scoreTries;
}


/**
 * Fonction qui permet d'enregistrer les scores
 * @param playerName - Nom du joueur
 * @param time - temps pris pour compléter la grille
 * @param nbTry - nombre de tentatives nécessaire
 * @param score - le score
 * @param level - le niveau
 */
function storeScore(playerName, time, nbTry, score, level){

    var gameScore = JSON.parse(localStorage.getItem('gameScores'));
    if (gameScore === null){
         gameScore =[];
    }
    var newScore = new PlayerScore(playerName, time, nbTry, score,level);
    gameScore.push(newScore);
    localStorage["gameScores"] = JSON.stringify(gameScore);
}


/**
 * Fonction pour déterminer si un score est le plus élevé du niveau
 * @param score - le nouveau score
 * @param level - le niveau
 * @returns {boolean} - retourne true si c'est le score le plus élevé du niveau
 */
function isHighScore(score, level) {
    var result = true;
    var gameScore = JSON.parse(localStorage.getItem('gameScores'));
    for (var i = 0; i<gameScore.length-1;i++){
        if (gameScore[i].level == level && gameScore[i].score>= score){
            result = false;
            break;
        }
    }
  return result;
}