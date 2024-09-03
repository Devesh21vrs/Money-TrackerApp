const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/MoneyList')
    .then(() => console.log("Connected to Database"))
    .catch(err => console.error("Error connecting to the Database:", err));

const db = mongoose.connection;

const expenseSchema = new mongoose.Schema({
    Category: String,
    Amount: Number,
    Info: String,
    Date: String
});

const Expense = mongoose.model('Expense', expenseSchema);

app.post("/add", async (req, res) => {
    const { category_select, amount_input, info, date_input } = req.body;
    
    const newExpense = new Expense({
        Category: category_select,
        Amount: amount_input,
        Info: info,
        Date: date_input
    });

    try {
        await newExpense.save();
        console.log("Record Inserted Successfully");
        res.status(201).json({ message: "Record Inserted Successfully", expense: newExpense });
    } catch (err) {
        console.error("Error inserting record:", err);
        res.status(500).json({ message: "Error inserting record", error: err.message });
    }
});

app.get("/records", async (req, res) => {
    try {
        const records = await Expense.find();
        res.json(records);
    } catch (err) {
        console.error("Error fetching records:", err);
        res.status(500).json({ message: "Error fetching records", error: err.message });
    }
});

app.delete("/delete/:id", async (req, res) => {
    try {
        const result = await Expense.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.json({ message: "Expense deleted successfully" });
    } catch (err) {
        console.error("Error deleting record:", err);
        res.status(500).json({ message: "Error deleting record", error: err.message });
    }
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));