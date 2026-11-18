/*
 * Name: Ayusha Thapa
 * Date: 11.17.2026
 * CSC 372-01
 *
 * Loads trivia topics and random questions from the API.
 */

"use strict";

let currentQuestionId;

window.addEventListener("load", init);

/**
 * Sets up the page and loads topics.
 */
function init() {
    document.getElementById("random-button")
        .addEventListener("click", loadRandomQuestion);

    document.getElementById("answer-form")
        .addEventListener("submit", submitAnswer);

    document.getElementById("search-form")
        .addEventListener("submit", searchQuestions);

    document.getElementById("question-form")
        .addEventListener("submit", submitQuestion);

    loadTopics();
}

/**
 * Loads and displays all topic names.
 * @return {Promise<void>} Resolves after loading topics.
 */
async function loadTopics() {
    let list = document.getElementById("topic-list");
    list.innerHTML = "";

    try {
        let response = await fetch("/triviabook/topics");

        if (!response.ok) {
            throw new Error("Could not load topics.");
        }

        let topics = await response.json();

        topics.forEach(function (topic) {
            let item = document.createElement("li");
            item.textContent = topic;
            list.appendChild(item);
        });
    } catch (error) {
        let item = document.createElement("li");
        item.textContent = error.message;
        list.appendChild(item);
    }
}

/**
 * Loads a random question and remembers its ID.
 * @return {Promise<void>} Resolves after loading a question.
 */
async function loadRandomQuestion() {
    let display = document.getElementById("random-question");

    currentQuestionId = undefined;
    document.getElementById("answer-result").textContent = "";
    document.getElementById("answer-form").reset();

    try {
        let response = await fetch("/triviabook/random");
        let data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        currentQuestionId = data.id;
        display.textContent = data.question;
    } catch (error) {
        display.textContent = error.message;
    }
}

/**
 * Submits a guess and displays the answer result.
 * @param {Event} event - The form submission event.
 * @return {Promise<void>} Resolves after checking the answer.
 */
async function submitAnswer(event) {
    event.preventDefault();

    let display = document.getElementById("answer-result");

    if (currentQuestionId === undefined) {
        display.textContent = "Get a question first.";
        return;
    }

    let guess = document.getElementById("guess").value;

    try {
        let response = await fetch("/triviabook/answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: currentQuestionId,
                guess: guess
            })
        });

        let data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        if (data.correct) {
            display.textContent = "Correct! The answer is " + data.answer + ".";
        } else {
            display.textContent = "Not quite! The answer is " + data.answer + ".";
        }
    } catch (error) {
        display.textContent = error.message;
    }
}

/**
 * Searches for questions using the selected filters.
 * @param {Event} event - The form submission event.
 * @return {Promise<void>} Resolves after loading the results.
 */
async function searchQuestions(event) {
    event.preventDefault();

    let topic = document.getElementById("search-topic")
        .value.trim().toLowerCase();
    let difficulty = document.getElementById("search-difficulty").value;
    let limit = document.getElementById("search-limit").value;
    let message = document.getElementById("search-message");

    document.getElementById("question-list").innerHTML = "";
    message.textContent = "Loading questions...";

    let url = "/triviabook/topic/" + encodeURIComponent(topic);
    let filters = [];

    if (difficulty !== "") {
        filters.push("difficulty=" + encodeURIComponent(difficulty));
    }

    if (limit !== "") {
        filters.push("limit=" + encodeURIComponent(limit));
    }

    if (filters.length > 0) {
        url += "?" + filters.join("&");
    }

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        displayQuestions(data);
        message.textContent = data.length + " question(s) found.";
    } catch (error) {
        message.textContent = error.message;
    }
}

/**
 * Displays a list of trivia questions.
 * @param {Object[]} questions - The questions to display.
 */
function displayQuestions(questions) {
    let container = document.getElementById("question-list");
    container.innerHTML = "";

    questions.forEach(function (question) {
        let article = document.createElement("article");

        let heading = document.createElement("h3");
        heading.textContent = question.question;

        let difficulty = document.createElement("p");
        difficulty.textContent = "Difficulty: " + question.difficulty;

        let answer = document.createElement("p");
        answer.textContent = "Answer: " + question.answer;

        article.appendChild(heading);
        article.appendChild(difficulty);
        article.appendChild(answer);
        container.appendChild(article);
    });
}

/**
 * Adds a question and displays the topic's updated questions.
 * @param {Event} event - The form submission event.
 * @return {Promise<void>} Resolves after submitting the question.
 */
async function submitQuestion(event) {
    event.preventDefault();

    let form = document.getElementById("question-form");
    let message = document.getElementById("add-message");

    let topic = document.getElementById("new-topic").value.trim();
    let question = document.getElementById("new-question").value.trim();
    let answer = document.getElementById("new-answer").value.trim();
    let difficulty = document.getElementById("new-difficulty").value;

    message.textContent = "Adding question...";

    try {
        let response = await fetch("/triviabook/question/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                topic: topic,
                question: question,
                answer: answer,
                difficulty: difficulty
            })
        });

        let data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        displayQuestions(data);

        document.getElementById("search-topic").value =
            topic.toLowerCase();
        document.getElementById("search-difficulty").value = "";
        document.getElementById("search-limit").value = "";
        document.getElementById("search-message").textContent =
            data.length + " question(s) in this topic.";

        message.textContent = "Question added!";
        form.reset();
        await loadTopics();
    } catch (error) {
        message.textContent = error.message;
    }
}