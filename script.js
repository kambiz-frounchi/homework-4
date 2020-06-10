/*GIVEN I am taking a code quiz
WHEN I click the start button
THEN a timer starts and I am presented with a question
WHEN I answer a question
THEN I am presented with another question
WHEN I answer a question incorrectly
THEN time is subtracted from the clock
WHEN all questions are answered or the timer reaches 0
THEN the game is over
WHEN the game is over
THEN I can save my initials and score*/

var INTERVAL = 1;
var MAX_TIME = 20;
var TIME_DECREMENT_IF_WRONG = 10;
var question = 0;
var timerHandle = null;

var questionAnswer1 = {
    question: "question 1?",
    answers: ["answer11", "answer12", "answer13", "answer14"],
    correctAnswer: 0
}

var questionAnswer2 = {
    question: "question 2?",
    answers: ["answer21", "answer22", "answer23", "answer24"],
    correctAnswer: 0
}

var questionAnswer3 = {
    question: "question 3?",
    answers: ["answer31", "answer32", "answer33", "answer34"],
    correctAnswer: 0
}

var questionAnswer4 = {
    question: "question 4?",
    answers: ["answer41", "answer42", "answer43", "answer44"],
    correctAnswer: 0
}

var questionAnswer5 = {
    question: "question 5?",
    answers: ["answer51", "answer52", "answer53", "answer54"],
    correctAnswer: 0
}

questionAnswers = [questionAnswer1, questionAnswer2, questionAnswer3, questionAnswer4, questionAnswer5];

var quiz = {
    questionAnswers: [],
    maxTime: 60, //60 seconds
    timeDecrementIfWrong: 5, //seconds
    numQuestions: 5,
    currentQuestionNumber: 0,
    timePassed: 0, //seconds
    interval: 1,//seconds
    score: 0,
    scoreIncrement: 20,
    highScores: [],
    initialize: function (interval, maxTime, timeDecrementIfWrong, questionAnswers) {
        this.interval = interval;
        this.maxTime = maxTime;
        this.timeDecrementIfWrong =  timeDecrementIfWrong;
        this.numQuestions = questionAnswers.length;
        questionAnswers.forEach(element => {
            this.questionAnswers.push(element);
        });
        this.questionAnswers = questionAnswers;        
    },
    processWrongAnswer: function() {
        this.timePassed += this.timeDecrementIfWrong;
    },
    populateHighScores: function(highScores) {
        highScores.forEach(highScore => {
            this.highScores.push(highScore);
        });
    }
}

var bodyElement = document.querySelector("body");
var startButtonElement = document.querySelector("#start-button");
var questionAnswerElement = document.querySelector("#question-answer");
var questionElement = document.querySelector("#question");
var answersElement = document.querySelector("#answers");
var resultElement = document.querySelector("#result");
var buttonElement = null;
var submitElement = document.querySelector("#submit-button");
var clearHighlightsElement = document.querySelector("#clear-highlights");
var startOverElement = document.querySelector("#start-over");
var highlightsPage = document.querySelector("#highlights-page");
var resultsPage = document.querySelector("#results-page");
var startPage = document.querySelector("#start-page");

function clearHighlights() {
    console.log("clearHighlights");
    var highScoresElement = document.querySelector("#high-scores");
    var parentElement = highScoresElement.parentElement;
    //parentElement.removeChild(highScoresElement);
    highScoresElement.classList.add("invisible");
    localStorage.removeItem("highScores");
}

function showHighlights() {
    console.log("show highlights");
    highlightsPage.classList.remove("invisible");
    var highScoresElement = document.querySelector("#high-scores");
    quiz.highScores.sort(function (a, b) {
        return a.score - b.score;
    });

    quiz.highScores.forEach((highScore, index) => {
        var scoreElement = document.createElement("h3");
        var rank = index + 1;
        scoreElement.textContent = rank + "." + highScore.initials + " " + highScore.score;
        console.log(scoreElement.textContent);
        highScoresElement.prepend(scoreElement);
    });
}

function submitButtonCb() {
    var initialsElement = document.querySelector("#initials");
    console.log(initialsElement.value);
    var highScore = {initials: initialsElement.value, score: quiz.score};
    quiz.highScores.push(highScore);
    localStorage.setItem("highScores", JSON.stringify(quiz.highScores));
    var parentElement = resultsPage.parentElement;
    //parentElement.removeChild(resultsPage);
    resultsPage.classList.add("invisible");
    showHighlights();
}

function showResults() {
    console.log("show results");
    var questionPage = document.querySelector("#question-page");
    //questionPage.classList.add("invisible");
    var parentElement = questionPage.parentElement;
    //parentElement.removeChild(questionPage);
    questionPage.classList.add("invisible");
    var finalScore = document.querySelector("#final-score");
    finalScore.textContent = quiz.score;
    resultsPage.classList.remove("invisible");
}

function verifyAnswer(currentQuestion, providedAnswer) {
    var correctAnswer = quiz.questionAnswers[currentQuestion].correctAnswer;
    if (quiz.questionAnswers[currentQuestion].answers[correctAnswer] === providedAnswer) {
        quiz.score += quiz.scoreIncrement;
        return true;
    }

    return false;
}

function answerButtonCb(event) {
    console.log(quiz.currentQuestionNumber);

    var providedAnswer = event.target.textContent;
    var bCorrect = verifyAnswer(quiz.currentQuestionNumber, providedAnswer);
    if (bCorrect) {
        resultElement.textContent = "Correct";
    }
    else {
        resultElement.textContent = "Wrong";
        quiz.processWrongAnswer();
    }

    if (quiz.currentQuestionNumber >= (quiz.numQuestions - 1)) {
        clearInterval(timerHandle);
        showResults();
        return;
    }    

    quiz.currentQuestionNumber += 1;

    createQuestionElements(quiz.currentQuestionNumber);
}

function createQuestionElements(questionNumber) {
    questionElement.textContent = questionAnswers[questionNumber].question;
    quiz.questionAnswers[questionNumber].answers.forEach(function(answer, index) {
        buttonId = "button-" + index;
        console.log("#" + buttonId);
        buttonElement = document.querySelector("#" + buttonId);
        buttonElement.classList.remove("invisible");
        buttonElement.setAttribute("class", "btn btn-secondary");
        buttonElement.textContent = answer;
        buttonElement.addEventListener("click", answerButtonCb);
        answersElement.appendChild(buttonElement);
    });
}

function timerCb() {
    console.log("interval passed");
    if (quiz.timePassed >= quiz.maxTime) {
        console.log("time out!");
        clearInterval(timerHandle);
    }
    quiz.timePassed++;

}

function startButtonCb() {
    timerHandle = setInterval(timerCb, quiz.interval * 1000);
    //var parentElement = startButtonElement.parentElement;
    //parentElement.removeChild(startButtonElement);
    startPage.classList.add("invisible");
    createQuestionElements(0);
}

function startOver() {
    highlightsPage.classList.add("invisible");
    startPage.classList.remove("invisible");
    quiz.initialize(INTERVAL, MAX_TIME, TIME_DECREMENT_IF_WRONG, questionAnswers);
    var highScores = JSON.parse(localStorage.getItem("highScores"));
    if (highScores) {
        quiz.populateHighScores(highScores);
    }
}


startButtonElement.addEventListener("click", startButtonCb);
submitElement.addEventListener("click", submitButtonCb);
clearHighlightsElement.addEventListener("click", clearHighlights);
startOverElement.addEventListener("click", startOver);

startOver();







