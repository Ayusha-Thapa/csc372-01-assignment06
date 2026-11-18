/*
 * Name: Ayusha Thapa
 * Date: 11.17.2026
 * CSC 372-01
 *
 * Handles trivia requests and sends JSON responses.
 */

import * as triviaModel from "../models/trivia-model.js";

/**
 * Sends the list of trivia topic names.
 * @param {Object} req - The incoming request.
 * @param {Object} res - The outgoing response.
 * @return {Promise<void>} Resolves after sending the response.
 */
export async function listTopics(req, res) {
    try {
        let topics = await triviaModel.getTopics();
        let names = topics.map(function (topic) {
            return topic.name;
        });

        res.json(names);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Could not load topics."
        });
    }
}

/**
 * Sends questions for a topic with optional filters.
 * @param {Object} req - The incoming request.
 * @param {Object} res - The outgoing response.
 * @return {Promise<void>} Resolves after sending the response.
 */
export async function listQuestions(req, res) {
    let topicName = req.params.topic.trim().toLowerCase();
    let difficulty = req.query.difficulty;
    let limit = req.query.limit;

    if (difficulty !== undefined &&
        !["easy", "medium", "hard"].includes(difficulty)) {
        res.status(400).json({
            error: "Difficulty must be easy, medium, or hard."
        });
        return;
    }

    if (limit !== undefined) {
        if (typeof limit !== "string" ||
            !Number.isInteger(Number(limit)) || Number(limit) < 1) {
            res.status(400).json({
                error: "Limit must be a positive whole number."
            });
            return;
        }

        limit = Number(limit);
    }

    try {
        let topic = await triviaModel.getTopic(topicName);

        if (!topic) {
            res.status(404).json({
                error: "Topic not found."
            });
            return;
        }

        let questions = await triviaModel.getQuestions(
            topic.id, difficulty, limit
        );

        res.json(questions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Could not load questions."
        });
    }
}

/**
 * Sends one random trivia question without its answer.
 * @param {Object} req - The incoming request.
 * @param {Object} res - The outgoing response.
 * @return {Promise<void>} Resolves after sending the response.
 */
export async function showRandomQuestion(req, res) {
    try {
        let question = await triviaModel.getRandomQuestion();

        if (!question) {
            res.status(404).json({
                error: "No questions found."
            });
            return;
        }

        res.json(question);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Could not load a random question."
        });
    }
}

/**
 * Checks a guess and sends the correct answer.
 * @param {Object} req - The incoming request.
 * @param {Object} res - The outgoing response.
 * @return {Promise<void>} Resolves after sending the response.
 */
export async function checkAnswer(req, res) {
    if (!req.body ||
        req.body.id === undefined ||
        req.body.guess === undefined) {
        res.status(400).json({
            error: "Question ID and guess are required."
        });
        return;
    }

    let id = req.body.id;
    let guess = req.body.guess;

    if ((typeof id !== "number" && typeof id !== "string") ||
        !Number.isInteger(Number(id)) || Number(id) < 1) {
        res.status(400).json({
            error: "Question ID must be a positive whole number."
        });
        return;
    }

    if (typeof guess !== "string" || guess.trim() === "") {
        res.status(400).json({
            error: "Guess must be nonempty text."
        });
        return;
    }

    try {
        let question = await triviaModel.getQuestionById(Number(id));

        if (!question) {
            res.status(404).json({
                error: "Question not found."
            });
            return;
        }

        let correct = guess.trim().toLowerCase() ===
            question.answer.trim().toLowerCase();

        res.json({
            correct: correct,
            answer: question.answer
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Could not check the answer."
        });
    }
}

/**
 * Adds a question and sends the topic's updated questions.
 * @param {Object} req - The incoming request.
 * @param {Object} res - The outgoing response.
 * @return {Promise<void>} Resolves after sending the response.
 */
export async function createQuestion(req, res) {
    if (!req.body) {
        res.status(400).json({
            error: "Topic, question, answer, and difficulty are required."
        });
        return;
    }

    let { topic, question, answer, difficulty } = req.body;
    let fields = [topic, question, answer, difficulty];

    let validFields = fields.every(function (field) {
        return typeof field === "string" && field.trim() !== "";
    });

    if (!validFields) {
        res.status(400).json({
            error: "Topic, question, answer, and difficulty must be nonempty text."
        });
        return;
    }

    topic = topic.trim().toLowerCase();
    question = question.trim();
    answer = answer.trim();
    difficulty = difficulty.trim();

    if (!["easy", "medium", "hard"].includes(difficulty)) {
        res.status(400).json({
            error: "Difficulty must be easy, medium, or hard."
        });
        return;
    }

    try {
        let questions = await triviaModel.addQuestion(
            topic, question, answer, difficulty
        );

        res.status(201).json(questions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Could not add the question."
        });
    }
}