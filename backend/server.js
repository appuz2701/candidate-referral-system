
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const candidatesRoutes = require('./routes/candidates');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/candidates', candidatesRoutes);

app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});


mongoose
  .connect('mongodb://localhost:27017/candidatesDB')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error('MongoDB Error:', err));
