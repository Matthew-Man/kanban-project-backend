import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pg from "pg";

const { Client } = pg;
const app = express();
dotenv.config();
app.use(cors());


const client = new Client({
    database: "kanbanproject"
    // connectionstring: process.env.DATABASE_URI
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

app.get("/tasks/:columnId", async (req, res) => {
    const columnId = req.params.columnId;
    const response = await client.query("SELECT * FROM tasks WHERE stage_id = $1;", [columnId]);
    const arrayOfTasks = response.rows;
    res.json({
        "status": "success",
        "data": arrayOfTasks
    })
})

app.post("/tasks/:taskId/:newStageId", async (req, res) => {
    const taskId = req.params.taskId;
    const newStageId = req.params.newStageId;
    // console.log(newStageId, taskId)
    await client.query("UPDATE tasks SET stage_id = $1 WHERE id = $2;", [newStageId, taskId])
    res.status(201).json({
        "status": "success",
    })
})

app.delete("/tasks/:taskId")




app.listen(4000, () => console.log("Server listening on port 4000"))