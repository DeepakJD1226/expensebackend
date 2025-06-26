const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Expense = require('./models/Expense');
const app = express();


const PORT = process.env.PORT || 3001;

const MONGO_URL = "mongodb+srv://DeepakJ:23adr024@cluster0.7paa4z1.mongodb.net/JD?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(express.json());


mongoose
  .connect(MONGO_URL, { ssl: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error(' MongoDB Connection Error:', err));



app.get('/', (req, res) => {
  res.send('Expense Tracker API is running');
});

app.post('/Expense', async (req, res) => {
  try {
    const { title, amount, date } = req.body;
    const newExpense = new Expense({ title, amount, date });
    await newExpense.save();
    res.status(201).json({ message: 'Expense Success', expense: newExpense });
  } catch (error) {
    console.error('Error saving expense:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/get_Expense', async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.status(200).json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/Expense/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (deletedExpense) {
      res.status(200).json({ message: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
