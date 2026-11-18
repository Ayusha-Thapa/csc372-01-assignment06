/*
 * Name: Ayusha Thapa
 * Date: 11.17.2026
 * CSC 372-01
 *
 * Defines the routes for the Triviabook API.
 */

import express from "express";
import {
    listTopics,
    listQuestions,
    showRandomQuestion,
    checkAnswer,
    createQuestion
} from "../controllers/trivia-controller.js";

let router = express.Router();

router.get("/topics", listTopics);
router.get("/topic/:topic", listQuestions);
router.get("/random", showRandomQuestion);
router.post("/answer", checkAnswer);
router.post("/question/add", createQuestion);

export default router;