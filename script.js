//constants
var INTERVAL = 1;
var MAX_TIME = 60;
var TIME_DECREMENT_IF_WRONG = 10;

var questionAnswer1 = {
    question: "Which choice is not a primitive type in JavaScript?",
    answers: ["Number", "Object", "String", "Boolean"],
    correctAnswer: 1
}

var questionAnswer2 = {
    question: "Which of the below functions is not used with DOM elements?",
    answers: ["push", "querySelector", "createElement", "removeChild"],
    correctAnswer: 0
}

var questionAnswer3 = {
    question: "What keyword is used to define a variable?",
    answers: ["for", "function", "if", "var"],
    correctAnswer: 3
}

var questionAnswer4 = {
    question: "Is it required to explicitly define the type of a variable in JavaScript?",
    answers: ["depends", "no", "yes", "N/A"],
    correctAnswer: 1
}

var questionAnswer5 = {
    question: "what symbol typically defines the start of a variable scope in Javascript?",
    answers: ["[", "tab", "{", "="],
    correctAnswer: 2
}

questionAnswers = [questionAnswer1, questionAnswer2, questionAnswer3, questionAnswer4, questionAnswer5];

//quiz object
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
        this.timePassed = 0;
        this.currentQuestionNumber = 0;
        this.score = 0;
        this.highScores = [];
        this.interval = interval;
        this.maxTime = maxTime;
        this.timeDecrementIfWrong =  timeDecrementIfWrong;
        this.numQuestions = questionAnswers.length;
        this.questionAnswers = [];
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

//HTML elements
var highlightsPage = document.querySelector("#highlights-page");
var resultsPage = document.querySelector("#results-page");
var startPage = document.querySelector("#start-page");
var questionPage = document.querySelector("#question-page");
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
var timerElement = document.querySelector("#timer");

//other global variables
var timerHandle = null;

//functions
function clearHighlights() {
    console.log("clearHighlights");
    var highScoresElement = document.querySelector("#high-scores");
    while (highScoresElement.firstChild) {
        highScoresElement.removeChild(highScoresElement.firstChild);
    }
    localStorage.removeItem("highScores");
}

function showHighlights() {
    console.log("show highlights");
    highlightsPage.classList.remove("invisible");
    var highScoresElement = document.querySelector("#high-scores");
    quiz.highScores.sort(function (a, b) {
        return b.score - a.score; //descending
    });

    console.log(quiz.highScores);
    quiz.highScores.forEach((highScore, index) => {
        var scoreElement = document.createElement("h3");
        var rank = index + 1;
        scoreElement.textContent = rank + ". " + highScore.initials + "     " + highScore.score;
        console.log(scoreElement.textContent);
        highScoresElement.appendChild(scoreElement);
    });
}

function submitButtonCb() {
    var initialsElement = document.querySelector("#initials");
    console.log(initialsElement.value);
    var highScore = {initials: initialsElement.value, score: quiz.score};
    quiz.highScores.push(highScore);
    localStorage.setItem("highScores", JSON.stringify(quiz.highScores));
    resultsPage.classList.add("invisible");
    showHighlights();
}

function showResults() {
    console.log("show results");
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
        setTimeout(function () {
            clearInterval(timerHandle);
            showResults();
        }, 1000);
        return;
    }

    //one second pause after clicking on the answer till it shows the next question
    setTimeout(function () {
        quiz.currentQuestionNumber += 1;
        createQuestionElements(quiz.currentQuestionNumber);
    }, 1000);
}

function createQuestionElements(questionNumber) {
    console.log("createQuestionElements" + questionNumber);
    resultElement.textContent = "";
    questionElement.textContent = questionAnswers[questionNumber].question;
    quiz.questionAnswers[questionNumber].answers.forEach(function(answer, index) {
        buttonId = "button-" + index;
        console.log("#" + buttonId);
        buttonElement = document.querySelector("#" + buttonId);
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
        showResults();
    }
    quiz.timePassed++;
    var timeRemaining = quiz.maxTime - quiz.timePassed;
    if (timeRemaining >= 0) {
        timerElement.textContent = timeRemaining;
    } 
}

function startButtonCb() {
    timerHandle = setInterval(timerCb, quiz.interval * 1000);
    startPage.classList.add("invisible");
    questionPage.classList.remove("invisible");
    createQuestionElements(0);
}

function startOver() {
    quiz.initialize(INTERVAL, MAX_TIME, TIME_DECREMENT_IF_WRONG, questionAnswers);
    var highScores = JSON.parse(localStorage.getItem("highScores"));
    console.log(highScores);
    if (highScores) {
        quiz.populateHighScores(highScores);
    }
    if (timerHandle) {
        clearInterval(timerHandle);
    }
    timerElement.textContent = quiz.maxTime;
    clearHighlights();
    highlightsPage.classList.add("invisible");
    startPage.classList.remove("invisible");
}


startButtonElement.addEventListener("click", startButtonCb);
submitElement.addEventListener("click", submitButtonCb);
clearHighlightsElement.addEventListener("click", clearHighlights);
startOverElement.addEventListener("click", startOver);

startOver();







