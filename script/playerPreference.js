
// Saisie des préférences de l'utilisateur
function Player() {
}

document.addEventListener("DOMContentLoaded", function () {

    var btnJouer = document.getElementById("startGame");
    if(btnJouer !== null){
        btnJouer.addEventListener("click", function() {

            var player = new Player();

            //Nom du joueur
            player.name = document.getElementById("name").value;

            //Niveau de difficulté
            player.difficulty = document.getElementById("settingDifficulty").value;
            if (player.difficulty>20){
                player.difficulty=20;
            }

            // thème
            var imgSelected = document.getElementById("img_theme_back").src;
            player.theme = imgSelected.substring(imgSelected.indexOf("theme"), imgSelected.indexOf("/card"));

            // Son
            var radiosSound = document.getElementsByName("settingSound");
            for (var i =0; i<radiosSound.length; i++){
                if (radiosSound[i].checked){
                    player.sound = radiosSound[i].value;
                }
            }

            console.log(player.name, player.difficulty, player.sound, player.theme);

            // Sérialisation de l'objet player
            localStorage["playerPreference"] = JSON.stringify(player);
            console.log(JSON.stringify(player));

            // Passage à l'autre page
           window.location.href = "game.html" ;

        });
    }
});
