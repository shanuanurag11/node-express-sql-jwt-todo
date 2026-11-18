import express from "express";
// import db from "../db.js";
import prisma from "../prismaClient.js";

const router = express.Router();

// Get all todos for logged-in user
router.get('/', async (req, res) => {
    try {
        const todos = await prisma.todo.findMany({
            where: {
                userId: req.userId
            }
        })
        res.json(todos)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch todos" })
    }
})

// Create a new todo
router.post('/', async (req, res) => {
    const { task } = req.body
    // const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
    // const result = insertTodo.run(req.userId, task)
    try {
        const insertTodo = await prisma.todo.create({
            data: {
                task,
                userId: req.userId
            }
        })
        res.json({ id: insertTodo.id, task, completed: insertTodo.completed })
    } catch (err) {
        res.status(500).json({ error: "Failed to create todo" })
    }
})

// Update a todo
router.put('/:id', async (req, res) => {
  try{
     const { completed } = req.body
    const { id } = req.params

    // const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?')
    // updatedTodo.run(completed, id)

    const updatedTodo = await prisma.todo.update({
        where: {
            id: parseInt(id)
        },
        data: {
            completed: completed
        }
    })

    res.json({ message: "Todo completed" }) 
  }catch(err){
    res.status(500).json({ error: "Failed to update todo" })
  }
})

// Delete a todo
router.delete('/:id', async (req, res) => {

    // const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    // deleteTodo.run(id, userId)
    try {
        const { id } = req.params
        const userId = req.userId;
        const deleteTodo = await prisma.todo.delete({
            where: {
                id: parseInt(id),
                userId: userId
            }
        })

        res.send({ message: "Todo deleted" })
    }
    catch {
        res.status(500).json({ error: "Failed to delete todo" })
    }
})

export default router;