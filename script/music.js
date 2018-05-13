"use strict";

var chosenTheme = "theme01";
var player = JSON.parse(localStorage.getItem('playerPreference')); // Récupération des choix du joueur
console.log("PLAYER: ", player);

document.addEventListener("DOMContentLoaded", function () {
    if(player !== null){
        chosenTheme = player.theme; // Thème choisi
    }

    var music = new Audio("music/" + chosenTheme + ".mp3");
    music.addEventListener('ended', function() {
        this.play();
    }, false);
    music.play();
    console.log("Music is playing");

    setInterval(function () {
        checkOpen();
    }, 500);

    window.addEventListener("load", function () {
        setTimeout(function () {
            $(window).blur();
        }, 100);
    })
});

/**
 * Si la fenêtre parent est fermée, ferme la fenêtre en cours
 */
function checkOpen() {
    console.log("Test");
    if(window.opener === null){
        window.close();
    }
}
