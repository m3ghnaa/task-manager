require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/auth");
const path = require("path");



const port = 5000;
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(express.static(path.join(__dirname, "../public")));

// Task Schema
const TaskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean,
    dueDate: Date 
});
const Task = mongoose.model('Task', TaskSchema);


app.set("views", path.join(__dirname, "../views"));

app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(methodOverride('_method'));
app.use(require("./middleware/decodeUserMiddleware"));

app.use((req, res, next) => {
    res.locals.user = req.user || null; // If user is logged in, set it; otherwise, set it to null
    next();
});

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.render("index");
});

app.use("/tasks", authMiddleware);

// Show all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find().sort({ dueDate: 1 });
    res.render('tasks', { tasks });
});

// Show form to add task
app.get('/tasks/new', (req, res) => {
    res.render('add-task');
});

// Add new task
app.post('/tasks', async (req, res) => {
    await Task.create({ 
        title: req.body.title, 
        completed: false, 
        dueDate: req.body.dueDate 
    });
    res.redirect('/tasks');
});

// Show form to edit task
app.get('/tasks/edit/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render('edit-task', { task });
});

// Update task (Edit or Mark Complete/Undo)
app.put('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (req.body.title) {
        task.title = req.body.title;
        task.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
    } else {
        task.completed = !task.completed;
    }

    await task.save();
    res.redirect('/tasks');
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/tasks');
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Task Manager running at http://localhost:${port}`);
});
