//console.log(document.querySelector("#leftWizzard").name);
var lastActionLW = null;
var lastActionRW = null;

var nbAttacksDispoLeft = fulmine.nbAttacks;
var nbAttacksDispoRight = fuoco.nbAttacks;

var posLeft = 100;
var posRight = 100;

/*var tabLeftAttacks = [];
var tabRightAttacks = [];*/

var endGame = false;


document.addEventListener("keydown", function(evt) {
    console.log(evt.key);
    if(!endGame) {
        var leftWizzard = document.querySelector("#leftWizzard");
        var leftWizzardLife = document.querySelector("#leftWizzardLife");

        var rightWizzard = document.querySelector("#rightWizzard");
        var rightWizzardLife = document.querySelector("#rightWizzardLife");

        if(evt.key == "Shift") {
            lastActionLW = "def";
            protect(leftWizzard, "FulmineLeft", "FulmineRight");
        } else if(evt.key == "x" || evt.key == "X") {
            lastActionLW = "atk";
        }

        if(evt.key == ":" || evt.key == "/") {
            lastActionRW = "def";
            protect(rightWizzard, "FuocoRight", "FuocoLeft");
        } else if(evt.key == ";" || evt.key == ".") {
            lastActionRW = "atk";
        }

        //TODO PLUS ON EST PROCHE DE L'ADVERSAIRE, PLUS LES COUPS SONT PUISSANTS ?
        //DEPLACEMENTS CANINOS
        console.log("start");
        console.log(posRight);
        if(evt.key == "ArrowLeft") {
            if(posRight < 200)
                posRight += 50;
            rightWizzard.style.right = posRight + "px";
        }
        else if(evt.key == "ArrowRight") {
            if(posRight > 0)
                posRight -= 50;
            rightWizzard.style.right = posRight + "px";
        }
        console.log(posRight);
        console.log("stop");

        //DEPLACEMENTS PIKACHU
        if(evt.key == "q" || evt.key == "Q") {
            if(posLeft > 0)
                posLeft -= 50;
            leftWizzard.style.left = posLeft + "px";
        }
        else if(evt.key == "d" || evt.key == "D") {
            if(posLeft < 200)
                posLeft += 50;
            leftWizzard.style.left = posLeft + "px";
        }

        if(lastActionLW == "atk" && nbAttacksDispoLeft > 0) {
            lastActionLW = null;
            var leftAttack = document.querySelector("#leftAttack"+nbAttacksDispoLeft);
            nbAttacksDispoLeft--;

            leftAttack.style.display = "block";
            var i = posLeft+150;
            var leftInterval = setInterval(function() {
                //On déplace l'image de l'attaque
                leftAttack.style.left = i + "px";
                i += 10;
                
                //Quand l'attaque arrive sur l'autre
                console.log("width body : " + document.body.clientWidth);
                console.log("position : " + posRight);
                if(i > document.body.clientWidth - (posRight + 170)) {
                    leftAttack.style.display = "none";
                    leftAttack.style.left = (posLeft+150) + "px";
                    //si son adversaire se s'est pas défendu
                    if(lastActionRW != "def") {
                        fuoco.lp -= fulmine.atk;
                        rightWizzardLife.style.width = fuoco.lp + "%";
                        blink(rightWizzard);
                        if(fuoco.lp < 0) {
                            victory("leftWizzard", "rightWizzard");
                            endGame = true;
                            clearInterval(leftInterval);
                        }
                    }
                    nbAttacksDispoLeft++;
                    clearInterval(leftInterval);
                }
            }, fulmine.speed);
        }

        if(lastActionRW == "atk" && nbAttacksDispoRight > 0) {
            lastActionRW = null;
            //tabRightAttacks[3 - nbAttacksDispoRight] = document.querySelector("#rightAttack"+nbAttacksDispoRight);
            var rightAttack = document.querySelector("#rightAttack"+nbAttacksDispoRight);
            nbAttacksDispoRight--;
        
            //tabRightAttacks[2 - nbAttacksDispoRight].style.display = "block";
            rightAttack.style.display = "block";
            var i = posRight+120;
            var rightInterval = setInterval(function() {
                //On déplace l'image de l'attaque
                //tabRightAttacks[2 - nbAttacksDispoRight].style.right = i + "px";
                rightAttack.style.right = i + "px";
                i += 10;

                //Quand l'attaque arrive sur l'autre
                if(i > document.body.clientWidth - (posLeft + 220)) {
                    //tabRightAttacks[2 - nbAttacksDispoRight].style.display = "none";
                    //tabRightAttacks[2 - nbAttacksDispoRight].style.right = "150px";
                    rightAttack.style.display = "none";
                    rightAttack.style.right = (posRight+120) + "px";
                    //si son adversaire se s'est pas défendu
                    if(lastActionLW != "def") {
                        fulmine.lp -= fuoco.atk;
                        leftWizzardLife.style.width = fulmine.lp + "%";
                        blink(leftWizzard);
                        if(fulmine.lp < 0) {
                            victory("rightWizzard", "leftWizzard");
                            endGame = true;
                            clearInterval(rightInterval);
                        }
                    }
                    nbAttacksDispoRight++;
                    clearInterval(rightInterval);
                }
            }, fuoco.speed);
        }

        setTimeout(function() {

            lastActionLW = null;
            lastActionRW = null;
        },200);

        console.log("Fulmine : " + fulmine.lp);
        console.log("Fuoco : " + fuoco.lp);
    }
});

function blink(div) {
    div.style.display = "none";
    setTimeout(function() {
        div.style.display = "block";
    }, 100);
}

function blinkInterval(div) {
    var i = 1;
    setInterval(function() {
        if(i % 2 == 0) {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
        i++;
    }, 500);
}

function protect(div, reverse, back) {
    div.src = "img/"+reverse+".gif";

    setTimeout(function() {
        div.src = "img/"+back+".gif";
    }, 200);
}

function victory(winner, looser) {
    document.querySelector("#" + looser).src = "";
    document.querySelector("#"+ looser + "Life").style.display = "none";
    document.querySelector("#"+ winner + "Life").style.display = "none";
    var labelWinner = document.querySelector("#labelWinner");
    labelWinner.style.display = "block";

    var imgWinner = document.querySelector("#" + winner);
    if(winner == "rightWizzard") {
        imgWinner.style.right = "40vw";
        labelWinner.style.color = "red";
    }
    else {
        imgWinner.style.left = "35vw";
        labelWinner.style.color = "yellow";
    }
    blinkInterval(labelWinner);

    imgWinner.style.width = "300px";
    imgWinner.style.height = "300px";
}