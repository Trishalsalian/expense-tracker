require('dns').setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---------- Models ----------
const DEFAULT_BUDGETS = {
  Food: 5000, Transport: 2000, Shopping: 3000, Bills: 4000,
  Entertainment: 1500, Health: 1000, Other: 1000,
};

// makes Mongo's _id appear as "id", so the React pages need no changes
const clean = {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    delete ret.password;
    return ret;
  },
};

const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
}, { toJSON: clean }));

const Expense = mongoose.model('Expense', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  note: { type: String, default: '' },
}, { timestamps: true, toJSON: clean }));

const Budget = mongoose.model('Budget', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  limits: { type: mongoose.Schema.Types.Mixed, default: () => ({ ...DEFAULT_BUDGETS }) },
}, { minimize: false }));

// ---------- Auth helpers ----------
const makeToken = (user) =>
  jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });

const auth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Please log in' });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ error: 'Session expired, please log in again' });
  }
};

// ---------- Auth routes ----------
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    await Budget.create({ user: user._id });
    res.status(201).json({ token: makeToken(user), user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password)))
      return res.status(401).json({ error: 'Wrong email or password' });
    res.json({ token: makeToken(user), user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Expense routes (logged-in only) ----------
app.get('/api/expenses', auth, async (req, res) => {
  const list = await Expense.find({ user: req.userId }).sort({ date: -1, createdAt: -1 });
  res.json(list);
});

app.post('/api/expenses', auth, async (req, res) => {
  const { title, amount, category, date, note } = req.body;
  if (!title || !amount || !category || !date)
    return res.status(400).json({ error: 'Missing required fields' });
  const expense = await Expense.create({
    user: req.userId, title, amount: Number(amount), category, date, note: note || '',
  });
  res.status(201).json(expense);
});

app.put('/api/expenses/:id', auth, async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, amount: Number(amount), category, date, note: note || '' },
      { new: true }
    );
    if (!expense) return res.status(404).json({ error: 'Not found' });
    res.json(expense);
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/expenses/:id', auth, async (req, res) => {
  try {
    await Expense.deleteOne({ _id: req.params.id, user: req.userId });
    res.json({ success: true });
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

// ---------- Budget routes (logged-in only) ----------
app.get('/api/budgets', auth, async (req, res) => {
  let b = await Budget.findOne({ user: req.userId });
  if (!b) b = await Budget.create({ user: req.userId });
  res.json(b.limits);
});

app.put('/api/budgets', auth, async (req, res) => {
  const limits = {};
  Object.keys(DEFAULT_BUDGETS).forEach((c) => (limits[c] = Number(req.body[c]) || 0));
  const b = await Budget.findOneAndUpdate(
    { user: req.userId }, { limits }, { new: true, upsert: true }
  );
  res.json(b.limits);
});

// ---------- Serve React build (production) ----------
const clientPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientPath));
app.use((req, res) => res.sendFile(path.join(clientPath, 'index.html')));

// ---------- Start ----------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection failed:', err.message));