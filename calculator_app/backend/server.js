
const express = require('express');
const cors = require('cors');
const math = require('mathjs');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/calculate', (req, res) => {
  try {
    const { expression } = req.body;
    
    if (!expression || typeof expression !== 'string') {
      return res.status(400).json({ error: 'Expression is required' });
    }

    const result = math.evaluate(expression);
    res.json({ result });
    
  } 
  catch (error) {
    res.status(400).json({ 
      error: 'Calculation failed',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});