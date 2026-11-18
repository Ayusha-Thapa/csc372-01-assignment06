<!--
    Name: Ayusha Thapa
    Date: 11.17.2026
    CSC 372-01

    Explains how to set up and use Triviabook.
-->

# Triviabook

This is my trivia app for CSC 372 Assignment 6. It uses Node.js,
Express, and Neon Postgres.

You can view topics, search for questions, get a random question,
check your answer, and add a question.

## Live App

https://csc372-01-assignment06.onrender.com/


## Setup

1. Clone this repository and open the project folder.
2. Run `npm install`.
3. Create a Neon Postgres project.
4. Run `schema.sql` in Neon's SQL Editor to create the tables.
5. Run `seed.sql` once to add the sample questions.
6. Create a `.env` file in the main project folder and add:

   ```dotenv
   DATABASE_URL="your-neon-connection-string"
   ```

7. Run `npm run dev`.
8. Open http://localhost:3000.


## Database

The database has two tables. Each question belongs to one topic.

| Table | Columns |
|---|---|
| topics | id (primary key), name (unique topic name) |
| questions | id (primary key), topic_id (references topics.id), question, answer, difficulty |

Difficulty must be `easy`, `medium`, or `hard`.

## API Endpoints

| Method | Endpoint | What it does |
|---|---|---|
| GET | /triviabook/topics | Gets all topics |
| GET | /triviabook/topic/:topic | Gets questions for a topic |
| GET | /triviabook/random | Gets a random question without the answer |
| POST | /triviabook/answer | Checks a guess and returns the correct answer |
| POST | /triviabook/question/add | Adds a question and creates the topic if needed |

Topic searches can include `difficulty` and `limit`.

Example: `/triviabook/topic/science?difficulty=easy&limit=2`

### Checking an Answer

Send `id` and `guess` in a JSON body:

```json
{
  "id": 1,
  "guess": "Mars"
}
```

### Adding a Question

Send `topic`, `question`, `answer`, and `difficulty` in a JSON body:

```json
{
  "topic": "geography",
  "question": "What is the largest ocean on Earth?",
  "answer": "Pacific Ocean",
  "difficulty": "easy"
}
```
The server returns the updated list of questions for that topic.
