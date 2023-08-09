const express = require('express');
const medicationData = require('../data/medications.json');

const app = express();
const PORT = 3000; 

// API GET brandNames
app.get('/api/brandNames', (req, res) => {
  const drugName = req.query.name;

  if (!drugName) {
    return res.status(400).json({ error: 'Please provide a valid drug name.' });
  }

  const medication = medicationData.medications.find(
    (med) => med.name.toLowerCase() === drugName.toLowerCase()
  );

  if (!medication) {
    return res.status(404).json({ error: 'Drug not found.' });
  }

  res.json({ brandNames: medication.brandNames });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});