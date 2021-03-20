import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pg from "pg";

const { Client } = pg;
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json()) //Parse JSON body in requests


const client = new Client({
    // database: "kanbanproject"
    connectionString: process.env.DATABASE_URI,
    ssl: {
        rejectUnauthorized: false
    }
})
client.connect();


app.get("/", (req, res) => {
    res.json({
        "message": "this works"
    })
});

app.get("/columns", async (req, res) => {
    const response = await client.query("SELECT * FROM stages");
    const arrayOfColumns = response.rows;
    res.json({
        "message": "user columns",
        "data": arrayOfColumns
    });
})

// app.get("/tasks/:columnId", async (req, res) => {
//     const columnId = req.params.columnId;
//     const response = await client.query("SELECT * FROM tasks WHERE stage_id = $1;", [columnId]);
//     const arrayOfTasks = response.rows;
//     res.json({
//         "status": "success",
//         "data": arrayOfTasks
//     });
// })

app.get("/tasks/all", async (req, res) => {
    const response = await client.query("SELECT * FROM tasks ORDER BY id");
    const arrayOfAllTasks = response.rows;
    res.json({
        "status": "success",
        "data": arrayOfAllTasks
    });
})

app.put("/tasks/:taskId/:newStageId", async (req, res) => {
    const taskId = req.params.taskId;
    const newStageId = req.params.newStageId;
    // console.log(newStageId, taskId)
    await client.query("UPDATE tasks SET stage_id = $1 WHERE id = $2;", [newStageId, taskId])
    res.status(201).json({
        "status": "success",
    })
})

app.put("/tasks/new", async (req, res) => {
    const {taskDescription, stageId} = req.body
    await client.query("INSERT INTO tasks(stage_id, task_description) VALUES($1, $2);", [stageId, taskDescription])
    res.json({
        "message": "Insert requested",
        "description": taskDescription,
        "stageId": stageId
    })
})

app.delete("/tasks/:taskId", async (req, res) => {
    const taskIdToDelete = req.params.taskId;
    await client.query("DELETE FROM tasks WHERE id = $1;", [taskIdToDelete])
    res.json({
        "message": "Delete requested",
        "taskId": taskIdToDelete
    })
})



const port = parseInt(process.env.DB_PORT);
app.listen(port, () => console.log(`Server listening on port ${port}`))