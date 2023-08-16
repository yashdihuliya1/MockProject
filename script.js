const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const registrationform = document.getElementsByClassName("registration-form");
const quizcontainer = document.getElementsByClassName("quiz-container");

var numberOfQuestions = document.getElementById("number-question");
var level = document.getElementById("difficulty");
var questionCategory = document.getElementById("category");

// const timerEle = document.getElementsByClassName("card");
// timerEle.style.display='none';

let correctAnswer = "",
  correctScore = 0,
  askedCount = 0;
let totalQuestion;

// load question from API
async function loadQuestion() {
  var numberOfQuestionsvalue = numberOfQuestions.value;
  var levelvalue = level.value;
  var questionCategoryvalue = questionCategory.value;
  totalQuestion = numberOfQuestionsvalue;
  const APIUrl =
    "https://opentdb.com/api.php?amount=" +
    numberOfQuestionsvalue +
    " &category= " +
    questionCategoryvalue +
    "&difficulty=" +
    levelvalue +
    "&type=" +
    "multiple";
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  _result.innerHTML = "";
  showQuestion(data.results[0]);
  timerEle.style.display='unset';
  startTimer(20);
}

// event listeners
function eventListeners() {
  _checkBtn.addEventListener("click", checkAnswer);
  _playAgainBtn.addEventListener("click", restartQuiz);
}

registrationform[0].addEventListener("submit", function (event) {
  event.preventDefault();
  loadQuestion();
  eventListeners();
  registrationform[0].classList.add("hide");
  quizcontainer[0].classList.remove("hide");
  quizcontainer[0].classList.add("show");
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

// display question and options
function showQuestion(data) {
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );
  // console.log(correctAnswer);

  _question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
  _options.innerHTML = `
        ${optionsList
          .map(
            (option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `
          )
          .join("")}
    `;
  selectOption();
}

// options selection
function selectOption() {
  _options.querySelectorAll("li").forEach(function (option) {
    option.addEventListener("click", function () {
      if (_options.querySelector(".selected")) {
        const activeOption = _options.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
}

var timeInSecs;
var ticker;

function startTimer(secs) {
timeInSecs = parseInt(secs);
ticker = setInterval("tick()", 1000); 
}

function tick( ) {
var secs = timeInSecs;
if (secs > 0) {
timeInSecs--; 
}
else {
clearInterval(ticker);
startTimer(20); // 4 minutes in seconds
}

var mins = Math.floor(secs/60);
secs %= 60;
var pretty = ( (mins < 10) ? "0" : "" ) + mins + ":" + ( (secs < 10) ? "0" : "" ) + secs;

document.getElementById("countdown").innerHTML = pretty;
}

// yeh timer k liye function dala hai
// function timer(){
//   var sec = 20;
//   var timer = setInterval(function(){
//       document.getElementById('safeTimerDisplay').innerHTML='00:'+sec;
//       sec--;
//       if (sec < 0) {
//           clearInterval(timer);
//       }
//   }, 1000);
// } 
// answer checking
function checkAnswer() {
  _checkBtn.disabled = true;
  if (_options.querySelector(".selected")) {
    let selectedAnswer = _options.querySelector(".selected span").textContent;
    if (selectedAnswer == HTMLDecode(correctAnswer)) {
      correctScore++;
      _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
    } else {
      _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
    }
    checkCount();
  } else {
    _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
    _checkBtn.disabled = false;
  }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

function checkCount() {
  askedCount++;
  setCount();
  if (askedCount == totalQuestion) {
    setTimeout(function () {
      console.log("");
    }, 5000);

    _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
    _playAgainBtn.style.display = "block";
    _checkBtn.style.display = "none";
  } else {
    setTimeout(function () {
      loadQuestion();
    }, 300);
  }
}

function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = askedCount;
}

function restartQuiz() {
  correctScore = askedCount = 0;
  _playAgainBtn.style.display = "none";
  _checkBtn.style.display = "block";
  _checkBtn.disabled = false;
  setCount();
  loadQuestion();
}




