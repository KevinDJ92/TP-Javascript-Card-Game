"use strict";

// CONSTANTES
const SIXTY_SECOND_MODEL = 60;
const SIXTY_MINUTE_MODEL = 60;
const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;

// VARIABLES
var myTimer = document.getElementById('get_timer');

var second = 0;
var minute = 0;
var hour = 0;
var isTimerOn = false;
var timer;

/**
 * Définit la fonction du bouton pause et lance le timer
 */
function toggleTimer() {

    btn_pause.on('click', setTimerOnPause);
    if (!isTimerOn) {
        isTimerOn = true;
        timedCount();
    }
    else {
        clearTimeout(timer);
        isTimerOn = false;
    }
}

/**
 * Met à jour le timer et l'affichage
 */
function timedCount() {
    console.log('Je suis dans le timer...');

    second++;

    if (second >= SIXTY_SECOND_MODEL) {
        minute++;
        second = 0;
    }
    if (minute >= SIXTY_MINUTE_MODEL) {
        hour++;
        minute = 0;
    }

    myTimer.innerHTML = (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second);

    if (isTimerOn) {
        timer = setTimeout(timedCount, 1000);
    }
}

/**
 * Met le timer en pause et change la fonction du bouton Pause
 */
function setTimerOnPause(){
    console.log('arret enclenché');

    isTimerOn = !isTimerOn; //Ce qui rend le compteur à arrêter
    btn_pause.off("click", setTimerOnPause);
    btn_pause.on('click', restartTimer);
}

/**
 * Relance le timer et change la fonction du bouton Pause
 */
function restartTimer() {
    console.log('Restart timer enclenché');

    if (isTimerOn === false) {
        isTimerOn = !isTimerOn;
        timer = setTimeout(timedCount, 1000);
        btn_pause.off('click', restartTimer);
        btn_pause.on("click", setTimerOnPause);
    }
}

/**
 * Converti le temps en secondes cumulatives (pour le calcul des scores)
 * @returns {nombre de secondes}
 */
function timeInSecond() {
    return second + (minute*SECONDS_IN_MINUTE) + (hour*SECONDS_IN_HOUR);
}