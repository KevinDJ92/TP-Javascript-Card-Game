"use strict";

//Page d'accueil
document.addEventListener("DOMContentLoaded", function () {

    // Initialisation de la page selon les informations en mémoire du joueur
    var playerStored = JSON.parse(localStorage.getItem('playerPreference'));
    if (playerStored !== null){
        document.body.style.backgroundImage='url("images/'+ playerStored.theme+'/background.png")';
        document.getElementById("img_theme_back").src = "images/"+playerStored.theme+"/card_back.png";
        document.getElementById("img_theme_front").src = "images/"+playerStored.theme+"/card_01.png";
        document.getElementById("name").value = playerStored.name;
        document.getElementById("settingDifficulty").value = playerStored.difficulty;
        if (playerStored.sound === "active"){
            document.getElementById("soundActive").checked = true;
        }
        if (playerStored.sound === "notActive"){
            document.getElementById("soundNotActive").checked = true;
        }
        switch (playerStored.theme){
            case ("theme01"):
                document.getElementById("img_theme_back").previousElementSibling.textContent = "Dungeons and Dragons";
                break;
            case ("theme02"):
                document.getElementById("img_theme_back").previousElementSibling.textContent = "Final Fantasy IX";
                break;
            case ("theme03"):
                document.getElementById("img_theme_back").previousElementSibling.textContent = "Princesses Disney";
                break;
            default:
                document.getElementById("img_theme_back").previousElementSibling.textContent = "Dungeons and Dragons";
                break;
        }
    }

    // Initialise la musique
    if(localStorage.getItem("musicPlayerOn") === null || localStorage.getItem("musicPlayerOn") === "true"){
        localStorage["musicPlayerOn"] = false;
    }

    // Écouteurs pour passer d'une section à l'autre
    var li_tabs = document.getElementById("navigation").getElementsByTagName("li");
    for (var j = 0; j < li_tabs.length; j++) {
        li_tabs[j].addEventListener("click", showSection);
    }

    // Écouteurs pour le carrousel
    document.getElementById("goLeft").addEventListener("click", changeLeft);
    document.getElementById("goRight").addEventListener("click", changeRight);

    /**
     * Cacher/Montrer les sections quand on clique
     */
    function showSection() {
        var sections = document.getElementsByTagName("section");
        for (var i =0; i<sections.length;i++){
            sections[i].classList.add("notDisplayed");
        }

        for(i=0;i<li_tabs.length;i++){
            li_tabs[i].style.backgroundColor="lightslategray";
        }

        switch (this.textContent.trim()) {
            case ("Jouer"):
                this.style.backgroundColor="cadetblue";
                document.getElementById("settings").classList.remove("notDisplayed");
                break;
            case ("Règlements"):
                this.style.backgroundColor="cadetblue";
                document.getElementById("rules").classList.remove("notDisplayed");
                break;
            case ("À propos"):
                this.style.backgroundColor="cadetblue";
                document.getElementById("about").classList.remove("notDisplayed");
                break;
            case ("Meilleurs scores"):
                this.style.backgroundColor="cadetblue";
                document.getElementById("highscore").classList.remove("notDisplayed");
                break;
        }
    }

    /**
     * récupération des scores dans le localStorage
     */
    var gameScores = JSON.parse(localStorage.getItem('gameScores'));

    /**
     * Fonction de tri selon le score
     */
    gameScores.sort(function (a,b) {
       return parseFloat(b.score) - parseFloat(a.score);
    });

    /* Met à niveau 1 par defaut*/
    var level = 1;
    showHighScore(level);
    $("#goLeftScore").on("click", function () {
        level -=1;
        if (level <1){
            level =20;
        }
        showHighScore(level)
    });
    $("#goRightScore").on("click", function () {
        level +=1;
        if (level >20){
            level =1;
        }
        showHighScore(level)
    });

    /**
     * Affichage des scores selon le niveau
     */
    function showHighScore(level) {
        $("#levelIndication").text("Niveau " + level);
        $("#listeScores tr").not(":first-child").remove();
        var nbLigne =0 ;
        for (var i = 0; i < gameScores.length ; i++) {
            if (gameScores[i].level == level && nbLigne<10) { //Ici, l'utilisation de '==' au lieu de '===' est volontaire
                nbLigne++;
                $("<tr>").html("<td>" + nbLigne + "</td>"
                    + "<td>" + gameScores[i].date.substr(0, 10) + "</td>"
                    + "<td> <strong>" + gameScores[i].playerName + "</strong> </td> "
                    + "<td>" + gameScores[i].time + "</td>"
                    + "<td>" + gameScores[i].nbTry + "</td>"
                    + "<td>" + gameScores[i].score +"</td>")
                    .appendTo($("#listeScores"));
            }
        }
    }
});

/**
 * Changement des images de thème
 */
function changeLeft() {
    var img_src = document.getElementById("img_theme_back");
    var img_src_front = document.getElementById("img_theme_front");
    var img = img_src.src.substr(this.src.indexOf("image"));

    switch (img) {
        case ("images/theme01/card_back.png"):
            img_src.previousElementSibling.textContent = "Princesses Disney";
            img_src.src = "images/theme03/card_back.png";
            img_src_front.src = "images/theme03/card_01.png";
            document.body.style.backgroundImage='url("images/theme03/background.png")';
            break;
        case ("images/theme02/card_back.png"):
            img_src.previousElementSibling.textContent = "Dungeons and Dragons";
            img_src.src = "images/theme01/card_back.png";
            img_src_front.src = "images/theme01/card_01.png";
            document.body.style.backgroundImage='url("images/theme01/background.png")';
            break;
        case ("images/theme03/card_back.png"):
            img_src.previousElementSibling.textContent = "Final Fantasy IX";
            img_src.src = "images/theme02/card_back.png";
            img_src_front.src = "images/theme02/card_01.png";
            document.body.style.backgroundImage='url("images/theme02/background.png")';
            break;
        default:
            img_src.previousElementSibling.textContent = "Dungeons and Dragons";
            img_src.src = "images/theme01/card_back.png";
            img_src_front.src = "images/theme01/card_01.png";
            document.body.style.backgroundImage='url("images/theme01/background.png")';
            break;
    }
}

function changeRight() {
    var img_src = document.getElementById("img_theme_back");
    var img_src_front = document.getElementById("img_theme_front");
    var img = img_src.src.substr(this.src.indexOf("image"));

    switch (img) {
        case ("images/theme01/card_back.png"):
            img_src.previousElementSibling.textContent = "Final Fantasy IX";
            img_src.src = "images/theme02/card_back.png";
            img_src_front.src = "images/theme02/card_01.png";
            document.body.style.backgroundImage='url("images/theme02/background.png")';
            break;
        case ("images/theme02/card_back.png"):
            img_src.previousElementSibling.textContent = "Princesses Disney";
            img_src.src = "images/theme03/card_back.png";
            img_src_front.src = "images/theme03/card_01.png";
            document.body.style.backgroundImage='url("images/theme03/background.png")';
            break;
        case ("images/theme03/card_back.png"):
            img_src.previousElementSibling.textContent = "Dungeons and Dragons";
            img_src.src = "images/theme01/card_back.png";
            img_src_front.src = "images/theme01/card_01.png";
            document.body.style.backgroundImage='url("images/theme01/background.png")';
            break;
        default:
            img_src.previousElementSibling.textContent = "Dungeons and Dragons";
            img_src.src = "images/theme01/card_back.png";
            img_src_front.src = "images/theme01/card_01.png";
            document.body.style.backgroundImage='url("images/theme01/background.png")';
            break;
    }
}