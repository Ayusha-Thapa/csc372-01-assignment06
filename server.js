/*
 * Name: Ayusha Thapa
 * Date: 11.17.2026
 * CSC 372-01
 *
 * Starts the Express server and checks the database connection.
 */

import express from "express";
import pool from "./db.js";
import triviaRouter from "./routes/trivia-routes.js";


let app = express();
let port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));
app.use("/triviabook", triviaRouter);

/**
 * Checks the database connection and starts the server.
 * @return {Promise<void>} Resolves when startup finishes.
 */
async function startServer() {
    try {
        await pool.query("SELECT 1");
        console.log("Connected to the database.");

        app.listen(port, function () {
            console.log("Server running on http://localhost:" + port);
        });
    } catch (error) {
        console.error("Could not start the server:", error.message);
        process.exitCode = 1;
        await pool.end();
    }
}

startServer();