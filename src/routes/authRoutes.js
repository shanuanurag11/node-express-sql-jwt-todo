import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import db from "../db.js"; 
import prisma from "../prismaClient.js";

const app = express.Router();

app.use(express.json());

app.post("/register", async (req, res) => {
   const { username, password } = req.body;
   
   const hashedPassword = bcrypt.hashSync(password, 8);
try{
   const user = await prisma.user.create({
    data: {
        username,
        password: hashedPassword
    }
   })
   // adding default todo

   const task = await prisma.todo.create({
    data:{
        userId: user.id,
        task: "Welcome to Todo App"
    }
   })
   
   //create token
   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
   
   res.json({ token });
} catch (error) {
   res.status(503).json({ error: error.message });
}
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    // const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
    // const user = getUser.get(username);
    try {

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
        res.json({ token });
    } catch (error) {
        res.status(503).json({ error: error.message });
    }


});




export default app;