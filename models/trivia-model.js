/*
 * Name: Ayusha Thapa
 * Date: 11.17.2026
 * CSC 372-01
 *
 * Provides database queries for trivia topics and questions.
 */

import pool from "../db.js";

/**
 * Gets all topics from the database.
 * @return {Promise<Object[]>} The list of topics.
 */
export async function getTopics() {
    let result = await pool.query(
        "SELECT name FROM topics ORDER BY name"
    );

    return result.rows;
}

/**
 * Finds a topic by its name.
 * @param {string} name - The topic name.
 * @return {Promise<Object|undefined>} The topic, if found.
 */
export async function getTopic(name) {
    let result = await pool.query(
        "SELECT id, name FROM topics WHERE name = $1",
        [name]
    );

    return result.rows[0];
}

/**
 * Gets questions for a topic with optional filters.
 * @param {number} topicId - The topic ID.
 * @param {string|undefined} difficulty - Optional difficulty.
 * @param {number|undefined} limit - Optional maximum question count.
 * @return {Promise<Object[]>} The matching questions.
 */
export async function getQuestions(topicId, difficulty, limit) {
    let query = "SELECT id, question, answer, difficulty FROM questions";
    query += " WHERE topic_id = $1";

    let values = [topicId];

    if (difficulty !== undefined) {
        values.push(difficulty);
        query += " AND difficulty = $" + values.length;
    }

    query += " ORDER BY id";

    if (limit !== undefined) {
        values.push(limit);
        query += " LIMIT $" + values.length;
    }

    let result = await pool.query(query, values);
    return result.rows;
}

/**
 * Gets a random question without its answer.
 * @return {Promise<Object|undefined>} A question, if available.
 */
export async function getRandomQuestion() {
    let result = await pool.query(
        "SELECT id, question, difficulty FROM questions ORDER BY RANDOM() LIMIT 1"
    );

    return result.rows[0];
}

/**
 * Finds a question by its ID.
 * @param {number} id - The question ID.
 * @return {Promise<Object|undefined>} The question, if found.
 */
export async function getQuestionById(id) {
    let result = await pool.query(
        "SELECT id, answer FROM questions WHERE id = $1",
        [id]
    );

    return result.rows[0];
}

/**
 * Adds a topic if needed, then adds its new question.
 * @param {string} topicName - The topic name.
 * @param {string} question - The question text.
 * @param {string} answer - The correct answer.
 * @param {string} difficulty - The question difficulty.
 * @return {Promise<Object[]>} The updated questions for the topic.
 */
export async function addQuestion(topicName, question, answer, difficulty) {
    let topic = await getTopic(topicName);

    if (!topic) {
        let result = await pool.query(
            "INSERT INTO topics (name) VALUES ($1) RETURNING id, name",
            [topicName]
        );

        topic = result.rows[0];
    }

    await pool.query(
        `INSERT INTO questions (topic_id, question, answer, difficulty)
         VALUES ($1, $2, $3, $4)`,
        [topic.id, question, answer, difficulty]
    );

    return getQuestions(topic.id);
}