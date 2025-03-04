require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const path = require("path");

const decodeUserMiddleware = require("./middleware/decodeUserMiddleware");

const port = 5000;
const app = express();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err));

app.use(express.static(path.join(__dirname, "public")));


const TaskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean,
    dueDate: Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});
const Task = mongoose.model("Task", TaskSchema);


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));


app.use(decodeUserMiddleware);

app.use((req, res, next) => {
    res.locals.user = req.user || null; 
    next();
});


const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);


app.get("/", (req, res) => {
    res.render("index");
});


app.use("/tasks", (req, res, next) => {
    if (!req.user) {
        return res.status(401).send("Unauthorized: Please log in");
    }
    next();
});


app.get("/tasks", async (req, res) => {
    const tasks = await Task.find({ user: req.user.userId }).sort({ dueDate: 1 });
    console.log("Fetched Tasks for User:", req.user.userId, tasks);
    res.render("tasks", { tasks });
});


app.get("/tasks/new", (req, res) => {
    res.render("add-task");
});

app.post("/tasks", async (req, res) => {
    try {
        console.log("Creating task for user:", req.user.userId);
        const task = await Task.create({
            title: req.body.title,
            completed: false,
            dueDate: req.body.dueDate,
            user: req.user.userId 
        });
        res.redirect("/tasks");
    } catch (error) {
    }
});


app.get("/tasks/edit/:id", async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render("edit-task", { task });
});


app.put("/tasks/:id", async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (req.body.title) {
        task.title = req.body.title;
        task.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
    } else {
        task.completed = !task.completed;
    }

    await task.save();
    res.redirect("/tasks");
});


app.delete("/tasks/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect("/tasks");
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, () => {
    console.log(`Task Manager running at http://localhost:${port}`);
});
