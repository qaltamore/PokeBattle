//TODO ENERGIE POUR ATTAQUES SPECIALES
function Pokemon(name, nameEvolution, lp, atk, def, attackSpeed, speed, orientation, reverseOrientation, position, positionOnScreen) {
    this.name = name;
    this.nameEvolution = nameEvolution;
    this.lp = lp;
    this.atk = atk;
    this.def = def;
    this.pp = 0;
    this.attackSpeed = attackSpeed;
    this.speed = speed;
    this.orientation = orientation;
    this.reverseOrientation = reverseOrientation;
    this.position = position;
    this.positionOnScreen = positionOnScreen; //Pour savoir s'il est à gauche ou droite

    this.lastAction = null;
    this.attacking = false;
    this.hasEvolve = false;

    //TODO PLUSIEURS TYPES D'ATTAQUE
    this.attack = function(target) {
        if(!this.attacking) {
            this.attacking = true;
            var self = this;
            
            var attack = document.querySelector("#attack"+this.positionOnScreen);
            attack.style.display = "block";

            if(this.position < target.position)
                var i = this.position + 150;
            else
                var i = this.position - 50;

            var initPosAttack = i;

            var interval = setInterval(function() {
                //On déplace l'image de l'attaque
                attack.style.left = i + "px";

                if(self.position < target.position)
                    i += 10;
                else
                    i -= 10;

                //Quand l'attaque arrive sur l'autre
                if((self.position < target.position && i > target.position - 40)
                || (self.position > target.position && i < target.position + 140)) {
                    self.attacking = false;
                    attack.style.left = initPosAttack+"px"; 
                    attack.style.display = "none";
                    if(target.lastAction != "def") {
                        target.isHurted(self.atk);
                    }
                    if(target.lp <= 0) {
                        document.querySelector("#"+target.positionOnScreen+"Life").style.width = "0px";
                        self.isWinner(target);
                        clearInterval(interval);
                    }

                    clearInterval(interval);
                }

            }, this.attackSpeed);
        }
    },

    //PROTECTION
    this.protect = function() {
        var div = document.querySelector("#"+this.positionOnScreen);
        var imgReverse = this.name + this.reverseOrientation;
        var img = this.name + this.orientation;

        div.src = "img/"+imgReverse+".gif";
        
        setTimeout(function() {
            div.src = "img/"+img+".gif";
        }, 200);
    },

    //MOVE
    this.move = function() {
        document.querySelector("#"+this.positionOnScreen).style.left = this.position + "px";
        //document.querySelector("#lifeProgress"+this.name).style.left = this.position + "px";
    },

    //HURTED
    this.isHurted = function(damages) {
        this.lp -= (damages - this.def);
        document.querySelector("#"+this.positionOnScreen+"Life").style.width = this.lp + "%";

        var img = document.querySelector("#"+this.positionOnScreen);
        img.style.display = "none";
        setTimeout(function() {
            img.style.display = "block";
        }, 100);
    },

    //WINNER
    this.isWinner = function(target) {

        document.querySelector("#" + target.positionOnScreen).src = "";
        document.querySelector("#"+ target.positionOnScreen + "Life").style.width = "0px";
        //document.querySelector("#"+ this.name + "Life").style.display = "none";
        var labelWinner = document.querySelector("#labelWinner");
        labelWinner.style.display = "block";
    
        var imgWinner = document.querySelector("#" + this.positionOnScreen);
        imgWinner.style.left = (document.body.clientWidth/2 - 150) + "px";
        if(this.positionOnScreen == "rightPokemon") {
            labelWinner.style.color = "red";
        }
        else {
            imgWinner.style.left = (document.body.clientWidth/2 - 170) + "px";
            labelWinner.style.color = "yellow";
        }
        winnerBlink(labelWinner);
    
        imgWinner.style.width = "300px";
        imgWinner.style.height = "300px";

        function winnerBlink(labelWinner) {
            var i = 1;
            setInterval(function() {
                if(i % 2 == 0) {
                    labelWinner.style.display = "block";
                } else {
                    labelWinner.style.display = "none";
                }
                i++;
            }, 500);
        }
    },

    this.evolution = function() {
        if(!this.hasEvolve) {
            this.hasEvolve = true;
            this.name = this.nameEvolution;
            this.atk += 6;
            if(this.name == "Arcanin") {
                this.def += 2;
            }
            else if(this.name == "Raichu") {
                this.attackSpeed *= 2;
                this.atk *= 2;
                this.def += 2;
                this.speed -= 50;
            }
            var img = document.querySelector("#"+this.positionOnScreen);
            img.src = "img/"+this.name+this.orientation+".gif";
            img.style.width = 200 + "px";
            img.style.height = 200 + "px";
            document.querySelector("#name"+this.positionOnScreen).innerHTML = this.name;
        }
    },

    this.specialAttack = function(target) {
        //if(this.name == this.nameEvolution) {
        var specialAttackImg = document.querySelector("#specialAttack"+this.positionOnScreen);
        specialAttackImg.src = "";
        specialAttackImg.src = "img/specialAttack"+this.name+".gif";
        specialAttackImg.style.left = target.position + "px";
        specialAttackImg.style.display = "block";

        var lastActionTarget = "";
        if(target.lastAction == "def")
            lastActionTarget = "def";

        var self = this;
        setTimeout(function() {
            specialAttackImg.style.display = "none";

            if(lastActionTarget != "def") {
                target.isHurted(self.atk * 2);

                if(target.lp <= 0)
                    self.isWinner(target);
            }
        }, 1000);
        //}
    }
}