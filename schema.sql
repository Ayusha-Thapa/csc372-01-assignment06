/*
 * Name: Ayusha Thapa
 * Date: 11.17.2026
 * CSC 372-01
 *
 * Creates the topics and questions tables for Triviabook.
 */

CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES topics(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    difficulty TEXT NOT NULL
);