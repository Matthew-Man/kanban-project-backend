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

app.get("/tasks", (req, res) => {
    res.json({
        "status": "success",
        "data": [{
            "id": 1,
            "stage_id": 1,
            "task_description": "demo task description"
            },{
            "id": 2,
            "stage_id": 1,
            "task_description": "demo task description 2"
        }]
    })
})

app.post("/tasks")

app.delete("/tasks/:id")




app.listen(4000, () => console.log("Server listening on port 4000"))