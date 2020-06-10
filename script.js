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

var TIME_DECREMENT_IF_WRONG = 10;
var MAX_TIME = 60;
var question = 0;
var timerHandle = null;
var state = {
    questionNumber: 0
}

var questionAnswer1 = {
    question: "question 1?",
    answers: ["answer11", "answer12", "answer13", "answer14"],
    correctAnswer: 0
}

var questionAnswer2 = {
    question: "question 2?",
    answers: ["answer21", "answer22", "answer23", "answer24"],
    correctAnswer: 1
}

var questionAnswer3 = {
    question: "question 3?",
    answers: ["answer31", "answer32", "answer33", "answer34"],
    correctAnswer: 3
}

var questionAnswer4 = {
    question: "question 4?",
    answers: ["answer41", "answer42", "answer43", "answer44"],
    correctAnswer: 2
}

var questionAnswer5 = {
    question: "question 5?",
    answers: ["answer51", "answer52", "answer53", "answer54"],
    correctAnswer: 3
}

questionAnswers = [questionAnswer1, questionAnswer2, questionAnswer3, questionAnswer4, questionAnswer5];

var quiz = {
    questionAnswers: [],
    maxTime: 60, //60 seconds
    timeDecrementIfWrong: 5, //seconds
    numQuestions: 5,
    currentQuestionNumber: 0,
    highScores: [],
    initialize: function (timeDecrementIfWrong, maxTime, questionAnswers) {
        this.numQuestions = questionAnswers.length;
        questionAnswers.forEach(element => {
            this.questionAnswers.push(element);
        });
        this.questionAnswers = questionAnswers;
        this.timeDecrementIfWrong =  timeDecrementIfWrong;
        this.maxTime = maxTime;
    }

}

var bodyElement = document.querySelector("body");
var startButtonElement = document.querySelector("#start-button");
var questionAnswerElement = document.querySelector("#question-answer");
var questionElement = document.querySelector("#question");
var answersElement = document.querySelector("#answers");
var resultElement = document.querySelector("#result");
var buttonElement = null;

function verifyAnswer(currentQuestion, providedAnswer) {
    var correctAnswer = quiz.questionAnswers[currentQuestion].correctAnswer;
    if (quiz.questionAnswers[currentQuestion].answers[correctAnswer] === providedAnswer) {
        return true;
    }

    return false;
}

function answerButtonCb(event) {
    var providedAnswer = event.target.textContent;
    var bCorrect = verifyAnswer(quiz.currentQuestionNumber, providedAnswer);
    if (bCorrect) {
        resultElement.textContent = "Correct";
    }
    else {
        resultElement.textContent = "Wrong";
        //change timeout
    }

    state.questionNumber += 1;
    /*
    questionAnswerElement.removeChild(questionElement);
    questionElement = null;
    questionAnswerElement.removeChild(answersElement);
    answersElement = null;
    createQuestionElements(state.questionNumber);
    */
}

function createQuestionElements(questionNumber) {
    state.questionNumber = questionNumber;
    if (questionElement == null) {
        questionElement = document.createElement("div");
        questionElement.setAttribute("id", "question");
    }

    if (answersElement == null) {
        answersElement = document.createElement("div");
        answersElement.setAttribute("id", "answers");
    }

    questionElement.textContent = questionAnswers[questionNumber].question;
    quiz.questionAnswers[questionNumber].answers.forEach(function(answer, index) {
        //buttonElement = document.createElement("button");
        buttonId = "button-" + index;
        console.log("#" + buttonId);
        //buttonElement = document.querySelectorAll("data-button=" + buttonId);
        //buttonElement = $("[data-button=" + buttonId + "]");
        buttonElement = document.querySelector("#" + buttonId);
        console.log(buttonElement);
        buttonElement.classList.remove("invisible");
        buttonElement.setAttribute("data-button", buttonId);
        buttonElement.setAttribute("class", "btn btn-secondary");
        buttonElement.textContent = answer;
        buttonElement.addEventListener("click", answerButtonCb);
        answersElement.appendChild(buttonElement);
    });
}

function timerCb() {
    console.log("end of test");
}

function startButtonCb() {
    timerHandle = setTimeout(timerCb, quiz.maxTime * 1000);
    bodyElement.removeChild(startButtonElement);
    createQuestionElements(0);
}

quiz.initialize(TIME_DECREMENT_IF_WRONG, MAX_TIME, questionAnswers);
startButtonElement.addEventListener("click", startButtonCb);






