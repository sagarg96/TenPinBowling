TenPinBowl = function() {

    this.finalScore = 0;
    this.frames = null;
    this.pinsKnocked = 0;    
};

Frame = function (game) { //Frame object holding its pins knocked per ball and frame score
    this.ball = [];
    this.score = 0;
}

TenPinBowl.prototype.getPinsKnocked = function(pinsKnockedStr){
    // store pinsKocked as integer array
    var pinsKnocked = pinsKnockedStr.split(",");
    for (var i = 0; i < pinsKnocked.length; i++) {
        pinsKnocked[i] = parseInt(pinsKnocked[i]);
    }
    this.pinsKnocked = pinsKnocked; //number of pins knocked in a ball
}

TenPinBowl.prototype.makeFrames = function(){

    //instantiate 10 frames
    var frames = [];
    for (var i = 0; i < 10; i++) {
        frames.push(new Frame(this)); //add empty frames
    }

    this.frames = frames;

    //fill the  frames with input values
    var index = 0;
    var lastIndex = 0;
    pinsKnocked = this.pinsKnocked;
    for (var i = 0; i < pinsKnocked.length; i++) { //iterate through the given list of pins knocked

        this.frames[index].ball.push(pinsKnocked[i]); //add the throw to the frame

        if (index != 9) { //first 9 frames
            if (this.frames[index].ball.length == 2) { //first 9 frames hold 2 balls
                index++;
            }

            else if (pinsKnocked[i] == 10) { //10th frame holds 3 balls
                this.frames[index].ball.push(0);
                index++;
            }
        }

    }

    for (var i = index; i < 10; i++) { //fill remaining frames with dummy values
        this.frames[i].fillRemainingFrames(i);
    }

}

TenPinBowl.prototype.calcFinalScore = function () {

    for (var i = 1; i < this.frames.length; i++) {  //sum scores from the previous frame
        this.frames[i].score += this.frames[i - 1].score;
    }
    this.finalScore = this.frames[9].score;
}

TenPinBowl.prototype.calcFrameScores = function () {

    var ballIndex = 0;
    for (var i = 0; i < this.frames.length; i++) {

        if (i == 9) {// 10th frame simply add the balls together
            this.frames[i].score = this.frames[i].ball[0] + this.frames[i].ball[1] + this.frames[i].ball[2];
            break;
        }

        // In case of first 9 frames check for strike/spare
        for (var j = 0; j < 2; j++) {
            if (this.frames[i].isStrike(j)) {
                //console.log("Strike"); 
                this.frames[i].addStrike(j, this.frames[i + 1], this.frames[i + 2]);
                j++;
            }

            else if (this.frames[i].isSpare(j)) {
                //console.log("Spare");
                this.frames[i].addSpare(j, this.frames[i + 1]);
            }
            else {
                this.frames[i].score += this.frames[i].ball[j];
            }
        }
    }
}


Frame.prototype.fillRemainingFrames = function (index) { //Initialize score of non existent throws to 0

    nballs = this.ball.length;

    for (var i = nballs; i < 2 + index / 9; i++) { // to allow for 2 balls in frames 1-9 and 3 balls in frame 10
        this.ball[i] = 0;
    }
}

Frame.prototype.isStrike = function (index) { //Strike
    return this.ball[index] == 10;
}

Frame.prototype.isSpare = function (index) {//Spare

    if (index >= 1) {
        if (this.ball[index] + this.ball[index - 1] == 10)
            return true;
    }
    return false;
}

Frame.prototype.addStrike = function (index, nextFrame, nextToNextFrame) {

    this.score += 10; //Points for the strike

    // then current frame is the 9th one and nextToNextFrame will be undefined.
    if (typeof (nextToNextFrame) == 'undefined' || typeof (nextToNextFrame) == 'null') {
        this.score += nextFrame.ball[0] + nextFrame.ball[1]; //add first 2 balls of the 10th frame
    }

    else {

        //Points for the next ball
        if (nextFrame.isStrike(0)) { //If next frame is a strike skip a frame
            this.score += 10 + nextToNextFrame.ball[0];
        }

        else { //else add scores of the next frame
            this.score += nextFrame.ball[0] + nextFrame.ball[1];
        }
    }

}

Frame.prototype.addSpare = function (index, nextFrame) {

    this.score = 10 + nextFrame.ball[0]; // 10 points plus points scored in the next ball
}


var inputStr = "5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5"; //test input
const game = new TenPinBowl(); //game object
game.getPinsKnocked(inputStr);
game.makeFrames();
game.calcFrameScores();
game.calcFinalScore();
console.log("Final Score is " + game.finalScore);



