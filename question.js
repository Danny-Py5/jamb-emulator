import { getDefaultQuestions } from "./default-questions.js";

let questionsData =
    JSON.parse(localStorage.getItem("questions")) || getDefaultQuestions();

const selectedOptions = [];
let currentQuestionIndex = 0;

generateQuestionHTML();

function generateQuestionHTML() {
    const question = questionsData.find((data) => {
        if (data.index === currentQuestionIndex) {
            return data;
        }
    });
    // console.log(question);
    let html = `
        <strong> <p>Question ${question.index + 1}</p></strong>
        <p class="question">
            ${question.question}
        </p>
        <hr />
        <br />
        <div class="options">
            <label>
                <input data-index="${
                    question.index
                }" class="answer" type="radio" name="answer" value="A" ${
        question.optionId === 0 ? "checked" : ""
    }/>
                A. ${question.options.a} </label>
            <br />


            <label>
                <input data-index="${
                    question.index
                }" class="answer" type="radio"  name="answer" value="B" ${
        question.optionId === 1 ? "checked" : ""
    } />
                B. ${question.options.b}</label>
            <br />


            <label>
                <input data-index="${
                    question.index
                }" class="answer" type="radio" name="answer" value="C" ${
        question.optionId === 2 ? "checked" : ""
    }/>
                C. ${question.options.c}</label><br />


            <label>
                <input  data-index="${
                    question.index
                }" class="answer" type="radio" name="answer" value="D" ${
        question.optionId === 3 ? "checked" : ""
    }/>
                D. ${question.options.d}
            </label>
        </div>
    `;
    document.querySelector(".js-question-cont").innerHTML = html;
    // select answer listener
    document.querySelectorAll(".answer").forEach((answer) => {
        answer.addEventListener("click", function () {
            // answer.checked = true;
            questionsData = questionsData.map((data) => {
                if (answer.dataset.index == data.index) {
                    data.optionId = getOptionId(answer.value);
                    data.chooses = answer.value;
                    // console.log(data);
                }
                return data;
            });
            saveToLocalStorage();
        });
    });
}
const submitModal = document.querySelector(".submit-dialog");
const resetDialog = document.querySelector(".reset-dialog");

const statusBar = document.querySelector(".status");
const submit = document.querySelector(".submit");
const reset = document.querySelector(".header__button-reset");

submit.addEventListener("click", () => {
    submitModal.showModal();
});

reset.addEventListener("click", (e) => {
    resetDialog.showModal();
});

document.getElementById("yesSubmitQuestions").addEventListener("click", () => {
    let scores = 0;
    let losses = 0;
    let unattendedQuestions = 0;

    const examResult = questionsData.forEach((question) => {
        const choose = question.chooses.toLowerCase();
        const answer = Object.keys(question.answer)[0];
        if (choose == answer) {
            scores += 1;
        }
        if (choose && choose != answer) {
            losses += 1;
        }
        if (!choose) {
            unattendedQuestions += 1;
        }
    });
    updateResultElements(scores, losses, unattendedQuestions);
    // show the result to examiner
    document.querySelector(".result-dialog").showModal();
});

document
    .querySelector(".js-understood-and-restart")
    .addEventListener("click", () => {
        document.querySelector(".submit-dialog").close();
        document.querySelector(".result-dialog").close();
        questionsData = getDefaultQuestions();
        saveToLocalStorage();
        currentQuestionIndex = 0;
        generateQuestionHTML();
        showStatus("Exam done and dusted!");
    });

document.getElementById("yesResetQuestions").addEventListener("click", () => {
    questionsData = getDefaultQuestions();
    saveToLocalStorage();
    resetDialog.close();
    generateQuestionHTML();
    showStatus("Questions reset!");
});

function updateResultElements(scores, looses, unattendedQuestions) {
    const got = document.querySelector(".js-got");
    const lost = document.querySelector(".js-lost");
    const unattempt = document.querySelector(".js-unattempt");

    got.textContent = scores;
    lost.textContent = looses;
    unattempt.textContent = unattendedQuestions;
}

function showStatus(text) {
    statusBar.textContent = text;
    statusBar.classList.add("slideIn");
    setTimeout(() => {
        statusBar.classList.remove("slideIn");
    }, 5001);
}

function getOptionId(option) {
    const optionId = {
        A: 0,
        B: 1,
        C: 2,
        D: 3,
    };
    return optionId[option];
}
// saveToLocalStorage();
function saveToLocalStorage() {
    localStorage.setItem("questions", JSON.stringify(questionsData));
}

const prevElem = document.querySelector(".prev");
const nextElem = document.querySelector(".next");

function prev() {
    if (currentQuestionIndex === 0) {
        prevElem.disabled = true;
        prevElem.style.cursor = " not-allowed";
        return;
    }
    // enable the button if diasabled
    if (nextElem.disabled == true) {
        nextElem.disabled = false;
        nextElem.style.cursor = "default";
    }
    currentQuestionIndex -= 1;
    generateQuestionHTML();
}

function next() {
    if (currentQuestionIndex === questionsData.length - 1) {
        nextElem.disabled = true;
        nextElem.style.cursor = " not-allowed";
        return;
    }
    // enable the button if diasabled
    if (prevElem.disabled == true) {
        prevElem.disabled = false;
        prevElem.style.cursor = "default";
    }
    currentQuestionIndex += 1;
    generateQuestionHTML();
}

nextElem.addEventListener("click", next);
prevElem.addEventListener("click", prev);
