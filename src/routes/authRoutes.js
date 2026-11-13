import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const app = express.Router();

app.use(express.json());

app.post("/register", (req, res) => {
   const { username, password } = req.body;
   
   const hashedPassword = bcrypt.hashSync(password, 8);
try{
   const insertUser = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
   const result = insertUser.run(username, hashedPassword);
   // adding default todo

   const insertTodo = db.prepare("INSERT INTO todos (user_id, task) VALUES (?, ?)");
   insertTodo.run(result.lastInsertRowid, "Welcome to Todo App");
   
   //create token
   const token = jwt.sign({ userId: result.lastInsertRowid }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
   
   res.json({ token });
} catch (error) {
   res.status(503).json({ error: error.message });
}
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
    const user = getUser.get(username);
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
    res.json({ token });
});




export default app;