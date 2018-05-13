var isCreated =localStorage.getItem('hasDemoScore');

if (isCreated != "true"){

    gameScore = JSON.parse(localStorage.getItem('gameScores'));
    if (gameScore === null){
        gameScore =[];
    }

    gameScore.push(new PlayerScore("Superman", 36, 7, 70000,1));
    gameScore.push(new PlayerScore("Batman", 36, 7, 70000,2));
    gameScore.push(new PlayerScore("Spiderman", 10, 20, 70000,3));
    gameScore.push(new PlayerScore("Thor", 42, 10, 70000,4));
    gameScore.push(new PlayerScore("Wonderwoman", 54, 14, 70000,5));
    gameScore.push(new PlayerScore("Captain America", 54, 14, 70000,6));
    gameScore.push(new PlayerScore("Superman", 58, 16, 70000,7));
    gameScore.push(new PlayerScore("Batman", 58, 16, 70000,8));
    gameScore.push(new PlayerScore("Spiderman", 80, 25, 70000,9));
    gameScore.push(new PlayerScore("Thor", 80, 25, 70000,10));
    gameScore.push(new PlayerScore("Wonderwoman", 86, 28, 70000,11));
    gameScore.push(new PlayerScore("Captain America", 28, 45, 70000,12));
    gameScore.push(new PlayerScore("Superman", 117, 41, 70000,13));
    gameScore.push(new PlayerScore("Batman", 117, 41, 70000,14));
    gameScore.push(new PlayerScore("Spiderman", 123, 44, 70000,15));
    gameScore.push(new PlayerScore("Thor", 123, 44, 70000,16));
    gameScore.push(new PlayerScore("Wonderwoman", 204, 87, 70000,17));
    gameScore.push(new PlayerScore("Captain America", 204, 87, 70000,18));
    gameScore.push(new PlayerScore("Superman", 210, 90, 70000,19));
    gameScore.push(new PlayerScore("Batman", 210, 90, 70000,20));

    localStorage["gameScores"] = JSON.stringify(gameScore);
    localStorage["hasDemoScore"] = true;
}
