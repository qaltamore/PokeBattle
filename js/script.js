var rightEvolution = 0; //On doit atteindre 3 pour faire évoluer un pokémon
var leftEvolution = 0;
var inAnimation = true;

var patternSecretAttackLeftPokemon = ["S", "S", "S", "Z"];
var patternSecretAttackRightPokemon = ["ArrowDown", "ArrowDown", "ArrowDown", "ArrowUp"];

var patternLeftPlayer = [];
var patternRightPlayer = [];

var muted = false;

document.addEventListener("keydown", function(evt) {

    if(evt.key == " ") {
        if(muted) {
            muted = false;
            document.querySelector("#audio").play();
        }
        else {
            muted = true;
            document.querySelector("#audio").pause();
        }
    }

    if(leftPokemon.lp > 0 && rightPokemon.lp > 0 && !inAnimation) {

        if(evt.key == "ArrowUp") {
            patternRightPlayer.push(evt.key);

            if(rightEvolution >= 3 && rightPokemon.lp < 30)
                rightPokemon.evolution();
            else 
                rightEvolution++;

            setTimeout(function() {
                rightEvolution = 0;
            }, 500);
        }

        if(evt.key == "ArrowDown") {
            patternRightPlayer.push(evt.key);
        }

        if(evt.key == "z" || evt.key == "Z") {
            patternLeftPlayer.push(evt.key.toUpperCase());
            if(leftEvolution >= 3 && leftPokemon.lp < 30)
                leftPokemon.evolution();
            else 
                leftEvolution++;

            setTimeout(function() {
                leftEvolution = 0;
            }, 500);
        }

        if(evt.key == "s" || evt.key == "S") {
            patternLeftPlayer.push(evt.key.toUpperCase());
        }

        //leftPokemon ACTIONS
        if(evt.key == "<" || evt.key == ">") {
            patternLeftPlayer.push(evt.key);
            leftPokemon.lastAction = "def";
            leftPokemon.protect();
        } else if(evt.key == "x" || evt.key == "X") {
            leftPokemon.lastAction = "atk";
            leftPokemon.attack(rightPokemon);
        }

        //leftPokemon MOVES
        if(evt.key == "q" || evt.key == "Q") {
            patternLeftPlayer.push(evt.key);
            if(leftPokemon.position > 0)
                leftPokemon.position -= leftPokemon.speed;
            leftPokemon.move();
            ;
        }
        else if(evt.key == "d" || evt.key == "D") {
            patternLeftPlayer.push(evt.key);
            if(leftPokemon.position < (document.body.clientWidth/4))
                leftPokemon.position += leftPokemon.speed;
            leftPokemon.move();
        }

        //rightPokemon ACTIONS
        if(evt.key == ":" || evt.key == "/") {
            patternRightPlayer.push(evt.key);
            rightPokemon.lastAction = "def";
            rightPokemon.protect();
        } else if(evt.key == ";" || evt.key == ".") {
            rightPokemon.lastAction = "atk";
            rightPokemon.attack(leftPokemon);
        }

        //TODO PLUS ON EST PROCHE DE L'ADVERSAIRE, PLUS LES COUPS SONT PUISSANTS ?
        //rightPokemon MOVES
        if(evt.key == "ArrowLeft") {
            patternRightPlayer.push(evt.key);
            //-150 = largeur de l'image
            if(rightPokemon.position > (document.body.clientWidth - (document.body.clientWidth/4) - 150))
                rightPokemon.position -= rightPokemon.speed;
            rightPokemon.move();
        }
        else if(evt.key == "ArrowRight") {
            patternRightPlayer.push(evt.key);
            //-150 = largeur de l'image
            if(rightPokemon.position < document.body.clientWidth - 150)
                rightPokemon.position += rightPokemon.speed;
            rightPokemon.move();
        }

        //SECRET ATTACK RIGHT POKEMON
        if(arraysEqual(patternRightPlayer, patternSecretAttackRightPokemon)) {
            if(rightPokemon.name == rightPokemon.nameEvolution) {
                inAnimation = true;
                rightPokemon.specialAttack(leftPokemon);
                setTimeout(function() {
                    inAnimation = false;
                }, 1200);
            }
            patternRightPlayer = [];
        }

        //SECRET ATTACK LEFT POKEMON
        if(arraysEqual(patternLeftPlayer, patternSecretAttackLeftPokemon)) {
            if(leftPokemon.name == leftPokemon.nameEvolution) {
                inAnimation = true;
                leftPokemon.specialAttack(rightPokemon);
                setTimeout(function() {
                    inAnimation = false;
                }, 1200);
            }
            patternLeftPlayer = [];
        }

        setTimeout(function() {
            leftPokemon.lastAction = null;
            rightPokemon.lastAction = null;
        },100);

        setTimeout(function() {
            patternRightPlayer = [];
            patternLeftPlayer = [];
        },1000);

        
    } else if(leftPokemon.lp == 0 || rightPokemon.lp == 0) {

        document.querySelector("#audio").src = "./win.mp3";
        if(muted) {
            document.querySelector("#audio").pause();
        }
        setTimeout(function() {
            var tmpI = 0;
            var tmpInterval = setInterval(function() {
                var leftDiv = document.querySelector("#leftDivStart");
                var rightDiv = document.querySelector("#rightDivStart");
                tmpI += 0.07;
                leftDiv.style.width = tmpI+"%";
                rightDiv.style.width = tmpI+"%";
            }, 1);
        }, 28000);

        setTimeout(function() {
            document.location = "./index.html";
        }, 31000);
    }
});

setTimeout(function() {
    if(document.querySelector("#audio").src.substr(-9) == "start.mp3")
        document.querySelector("#audio").src = "battle.mp3";
    if(muted)
        document.querySelector("#audio").pause();
}, 14950);

setTimeout(function() {
    var tmpI = 50.00;
    var tmpInterval = setInterval(function() {
        var leftDiv = document.querySelector("#leftDivStart");
        var rightDiv = document.querySelector("#rightDivStart");
        tmpI -= 0.07;
        leftDiv.style.width = tmpI+"%";
        rightDiv.style.width = tmpI+"%";
        if(tmpI == 0) {
            clearInterval(tmpInterval);
        }
    }, 1);
}, 1000);

setTimeout(function() {
    self.inAnimation = false;
}, 4000);

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  