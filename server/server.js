const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const writeData = (d) =>
  fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2));

// ---- Expenses ----
app.get('/api/expenses', (req, res) => res.json(readData().expenses));

app.post('/api/expenses', (req, res) => {
  const { title, amount, category, date, note } = req.body;
  if (!title || !amount || !category || !date)
    return res.status(400).json({ error: 'Missing required fields' });
  const data = readData();
  const expense = {
    id: Date.now().toString(),
    title,
    amount: Number(amount),
    category,
    date,
    note: note || '',
  };
  data.expenses.unshift(expense);
  writeData(data);
  res.status(201).json(expense);
});

app.put('/api/expenses/:id', (req, res) => {
  const data = readData();
  const i = data.expenses.findIndex((e) => e.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  data.expenses[i] = {
    ...data.expenses[i],
    ...req.body,
    amount: Number(req.body.amount),
    id: req.params.id,
  };
  writeData(data);
  res.json(data.expenses[i]);
});

app.delete('/api/expenses/:id', (req, res) => {
  const data = readData();
  data.expenses = data.expenses.filter((e) => e.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

// ---- Budgets ----
app.get('/api/budgets', (req, res) => res.json(readData().budgets));

app.put('/api/budgets', (req, res) => {
  const data = readData();
  data.budgets = req.body;
  writeData(data);
  res.json(data.budgets);
});

// ---- Serve React build (production) ----
const clientPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientPath));
app.use((req, res) => res.sendFile(path.join(clientPath, 'index.html')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));