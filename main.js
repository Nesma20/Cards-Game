$(document).ready(function () {
    var second = 0,    // timer --> seconds
        minute = 0,    // timer --> seconds
        clicks = 0,    // counter of clicks on cards
        noOfCorrectCards = 0,   // total correct cards number, increased by 1 after each right cards
        totalcards = 12,    // total cards of the level, set for 12(level 1), 20(level 2), and so on.
        interval,   // variable for timer
        firstCard,   // first card 
        secondCard,   // second card
        firstCardSRC,   // varable source for first card
        secondCardSRC,   // varable source for first card
        hasFlippedCard = false,   // check if any card is flipped
        backFaceCard = "images/0-cards.svg",   // back card image source
        divContainer = ("#container"),   // main game container
        btnLevelTwo,   // level 2 start vaiable
        btnLevelThree,   // level 3 start vaiable
        flagLevel = 1,   // flag to check current level
        flagTimer = 0,   // flag to start/ stop timer
        canFlipAgain = true,
        levelOneTotalClicks = 40,   // flag to edit total clicks allowed/ level (1)
        levelTwoTotalClicks = 60,   // flag to edit total clicks allowed/ level (2)
        levelThreeTotalClicks=75,
        clickAudio = new Audio('audio/cardclick.mp3'),   // click audio
        playbackAudio = new Audio('audio/playbackAudio.mp3');   // playback audio
        clickAudio.volume = 1; // setting click audio volume to .5 of max computer volume
        settings.style.display = "none";

    // array for front cards
    var frontFaceCardsSrc = [
        "images/01-chat.svg",
        "images/02-envelope.svg",
        "images/03-headset.svg",
        "images/04-imac.svg",
        "images/05-internet.svg",
        "images/06-letter.svg"
    ];

    // playback audio function
    function playbackfun() {
        playbackAudio.volume = .2;
        playbackAudio.loop = true;
        playbackAudio.play();
    }
    
    // start game function
    startGame();
    function startGame() {
        $("#click").html(+ ("" + levelOneTotalClicks));
        noOfCorrectCards = 0;
        hasFlippedCard = false;
        flagTimer = 0;
        // add customized style for cards in case level 1
        if (flagLevel == 1) {
            $(".memory-card").width('24%');
            $(".memory-card").height('32%');
            clicks = levelOneTotalClicks;
        }
        
        // add two different cards of the same source
        for (var j = 1; j < 3; j++) {
            $.each(frontFaceCardsSrc, function (i, val) {
                $(divContainer).append("<div id=cardDiv" + (j + i) + " class='memory-card' data-dataID=" + i + "> <img src=" + val + " class='card-frontFace' id=card" + j + i + " />" + "<img class='card-backFace' data-dataID=" + i + " src=" + backFaceCard + " />");
            });
            shuffleCards();
        }

        // cards shuffling 
        function getrandomNum(MaxValue, MinValue) {
            return Math.floor(Math.random() * (MaxValue - MinValue) + MinValue);
        }

        function shuffleCards() {
            var allCards = $(".card-frontFace");
            var card = allCards[0];
            var cardArr = new Array();
            for (var i = 0; i < allCards.length; i++) {
                cardArr[i] = $(allCards[i]).attr("src");
            }

            for (var i = 0; i < allCards.length; i++) {
                var card = allCards[i];
                var RandomNum = getrandomNum(0, cardArr.length - 1);

                $(card).attr("src", cardArr[RandomNum]);
                cardArr.splice(RandomNum, 1);
            }
        }

        // cards flipping function including (flipping animation, conditions of same or different cards)
        const cards = document.querySelectorAll('.memory-card');

        function flipCard() {
            clickAudio.play();
            clicks--;
            if (flagTimer == 0) {
                startTimer();
                flagTimer++;
            }
            console.log(totalcards/2);
            console.log(noOfCorrectCards);
            $("#click").html("" + clicks);
            this.classList.toggle('flip');
            
            // check if no remaining clicks and level 1
            if (flagLevel == 1 && clicks == 0) {
                $(divContainer).html("<div class='textTitle' style='margin: auto'><img src='images/gameover.svg' style='width: 180px; margin-bottom: 10px;'><h2 style='color: #ba0000;'>Game Over!</h2><div class='textBody'>Click on Reset Button to play again.</div><div class='headerSpan'></div>");
                clicks = levelOneTotalClicks;
                clearInterval(interval);
            }
            // check if no remaining clicks and level 2
            else if (flagLevel != 1 && clicks == 0) {
                $(divContainer).html("<div class='textTitle' style='margin: auto'><img src='images/gameover.svg' style='width: 180px; margin-bottom: 10px;'><h2 style='color: #ba0000;'>Game Over!</h2><div class='textBody'>If You Want To Play Again, Click on Reset Button to start level1!</div><div class='headerSpan'></div>");
                clicks = levelOneTotalClicks;
                clearInterval(interval);
            }

            // check if any card is flipped
            if (!hasFlippedCard) {
                hasFlippedCard = true;
                firstCard = this;
                firstCardSRC = this.childNodes[1].src;
            } else {
                hasFlippedCard = false;
                secondCard = this;
                secondCardSRC = this.childNodes[1].src;
                if (firstCardSRC === secondCardSRC && firstCard != secondCard) {
                    setTimeout(function () {
                        firstCard.style.visibility = "hidden";
                        secondCard.style.visibility = "hidden";
                    }, 400);
                    noOfCorrectCards++;

                    $("#score").html(+ ("" + Math.round((noOfCorrectCards / totalcards * 2) * 100)) + " %");


                    ////  Winner level 1  ////
                    if (noOfCorrectCards === totalcards / 2 && flagLevel == 1) {
                        document.getElementById("container").innerHTML = "<div class='textTitle' style='margin: auto'><img src='images/lvl01-target.svg' style='width: 130px; margin-bottom: 10px;'><h2>You Passed Level 1</h2><div class='textBody'>Go to level 2</div><div class='headerSpan'><button class='buttonHeader' style='font-size: medium;  width: 170px; height: 40px; background-color: #008cba; margin-top: 5px;' id='Level2btn'>Click Here</button></div></div>";
                        clicks = levelTwoTotalClicks;
                        btnLevelTwo = $("#Level2btn");
                        $(btnLevelTwo).bind("click", LevelTwo);
                        clearInterval(interval);
                    }
                    
                    ////  Winner level 2  ////
                    else if (noOfCorrectCards === totalcards / 2 && flagLevel == 2) {
                        document.getElementById("container").innerHTML = "<div class='textTitle' style='margin: auto'><img src='images/lvl01-target.svg' style='width: 130px; margin-bottom: 10px;'><h2>Horrray!<br/>You Passed Level 2</h2><div class='textBody'>Go to level 3</div><div class='headerSpan'><button class='buttonHeader' style='font-size: medium;  width: 170px; height: 40px; background-color: #008cba; margin-top: 5px;' id='Level3btn'>Click Here</button></div></div>";
                        clicks = levelThreeTotalClicks;
                        btnLevelThree = $("#Level3btn");
                        $(btnLevelThree).bind("click", LevelThree);
                        clearInterval(interval);
                    } else if (noOfCorrectCards === totalcards / 2 && flagLevel == 3) {
                        document.getElementById("container").innerHTML = "<div class='textTitle' style='margin: auto'><img src='images/lvl02-goal.svg' style='width: 130px; margin-bottom: 10px;'><div class='textBody'>You Won</div><h2>Congratualtions!</h2><div class='headerSpan'></div>";
                        clearInterval(interval);
                    }
                } else {
                    setTimeout(function () {
                        firstCard.classList.remove("flip");
                        secondCard.classList.remove("flip");
                    }, 500);
                }
            }
        } // end of card flip function
        
        cards.forEach(card => card.addEventListener('click', flipCard));
    } // end of start game function

    // reset game
    $("#reset").click(resetGame);
    function resetGame() {
        document.getElementById("container").innerHTML = "";
        $("#click").html("" + clicks);
        clicks = levelOneTotalClicks;
        noOfCorrectCards = 0;
        $("#level").html("1");
        clicks = levelOneTotalClicks;
        $("#score").html("00 %");

        if (flagLevel == 2) {
            frontFaceCardsSrc.pop();
            frontFaceCardsSrc.pop();
            frontFaceCardsSrc.pop();
            frontFaceCardsSrc.pop();
        }
        if (flagLevel == 3) {
            frontFaceCardsSrc.pop();
            frontFaceCardsSrc.pop();
            frontFaceCardsSrc.pop();
            frontFaceCardsSrc.pop();
            frontFaceCardsSrc.pop();
            frontFaceCardsSrc.pop();
            frontFaceCardsSrc.pop();
            frontFaceCardsSrc.pop();
            frontFaceCardsSrc.pop();
        }

        flagLevel = 1;
        startGame();
        startTimer();
        flagTimer = 0;
        
    }

    // timer function increase timer by 1 every second
    function startTimer() {
        second = 0, minute = 0;
        clearInterval(interval);
        interval = setInterval(timer, 1000);
    }
    
    // main timer function
    function timer() {
        $("#timer").html(minute + ":" + second);
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
    }

    // level 2
    function LevelTwo() {
        resetGame();
        document.getElementById("container").innerHTML = "";
        frontFaceCardsSrc.push("images/07-megaphone.svg");
        frontFaceCardsSrc.push("images/08-paper-plane.svg");
        frontFaceCardsSrc.push("images/09-smartphone.svg");
        frontFaceCardsSrc.push("images/10-webcam.svg");

        totalcards = 20;
        flagLevel = 2;
        flagTimer = 0;
        clicks = levelTwoTotalClicks;
        $("#level").html("2");
        $("#score").html("00 %");


        startGame();
        $(".memory-card").width('19%');
        $(".memory-card").height('24%');
    }
    
    //level 3
    function LevelThree(){
        resetGame();
        
        document.getElementById("container").innerHTML = "";
        
        frontFaceCardsSrc.push("images/07-megaphone.svg");
        frontFaceCardsSrc.push("images/08-paper-plane.svg");
        frontFaceCardsSrc.push("images/09-smartphone.svg");
        frontFaceCardsSrc.push("images/10-webcam.svg");
        frontFaceCardsSrc.push("images/11-rocket.svg");
        frontFaceCardsSrc.push("images/12-doughnut.svg");
        frontFaceCardsSrc.push("images/13-ship.svg");
        frontFaceCardsSrc.push("images/14-snow-globe.svg");
        frontFaceCardsSrc.push("images/15-umbrella.svg");
        
        totalcards = 30;
        flagLevel = 3;
        flagTimer = 0;
        clicks = levelThreeTotalClicks;
        $("#level").html("3");
        $("#score").html("00 %");
        
        startGame();
        $(".memory-card").width('15.5%');
        $(".memory-card").height('19%');
    }

    //////////////      Menus       //////////////
    // click audio button
    document.getElementById("inputCLickSound").addEventListener("click", cLickSound);
    function cLickSound() {
    if ($('#inputCLickSound').prop('checked') ) {
        clickAudio.volume = 1;
    } else {
        clickAudio.volume = 0;
    }}
    
    // Playback audio button
    document.getElementById("inputPlaybackSound").addEventListener("click", playbackSound);
    function playbackSound() {
    if ($('#inputPlaybackSound').prop('checked') ) {
        playbackAudio.volume = .2;
        playbackAudio.play();
        console.log("1");
    } else {
        console.log("0");
        playbackAudio.pause();
    }}
    
    // start game button
    document.getElementById("btnStart").addEventListener("click", resetGame);
    document.getElementById("btnStart").addEventListener("click", welcomeFun);
    function welcomeFun(){
        document.getElementById("welcome").style.zIndex = "-1";
        playbackfun(); // playback audio function - starts on click
    }
    
    // level 1 button
    document.getElementById("btnlvl1").addEventListener("click", resetGame);
    document.getElementById("btnlvl1").addEventListener("click", settingsFunc);
    
    // level 2 button
    document.getElementById("btnlvl2").addEventListener("click", resetGame);
    document.getElementById("btnlvl2").addEventListener("click", LevelTwo);
    document.getElementById("btnlvl2").addEventListener("click", settingsFunc);
    
    // level 3 button
    document.getElementById("btnlvl3").addEventListener("click", resetGame);
    document.getElementById("btnlvl3").addEventListener("click", LevelThree);
    document.getElementById("btnlvl3").addEventListener("click", settingsFunc);

    // settings button
    document.getElementById("buttonSettings").addEventListener("click", settingsFunc);
    document.getElementById("buttonBack").addEventListener("click", settingsFunc);
    function settingsFunc() {
    var settingsBtn = document.getElementById("buttonSettings");
    if (settings.style.display === "none") {
        settings.style.display = "";
        settingsBtn.setAttribute("class", "rotated-image");
        clearInterval(interval);
    } else {
        settings.style.display = "none";
        settingsBtn.setAttribute("class", "rotated-image");
        //settingsBtn.classList.remove("rotated-image");
        settingsBtn.setAttribute("class", "normal-image");
        setInterval(timer, 1000);
    }}

});


