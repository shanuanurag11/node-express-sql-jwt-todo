import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const app = express.Router();

app.get("/", (req, res) => {
    const todos = db.prepare("SELECT * FROM todos WHERE user_id = ?");
    const result = todos.all(req.userId);
    res.json(result);
});



export default app;