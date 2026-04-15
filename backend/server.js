const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  const query = 'INSERT INTO User (name, email, password, role) VALUES (?, ?, ?, "nurse")';

  db.query(query, [name, email, password], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('User registered');
  });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM User WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).send('Error logging in');
    }

    if (results.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).send('Invalid password');
    }

    res.json({
      message: 'Login successful',
      user_id: user.user_id
    });

  });
});

app.post('/patients', (req, res) => {
  const { name, age, gender, room_number, emergency_contact, user_id } = req.body;

  const query = `
    INSERT INTO Patient (name, age, gender, room_number, emergency_contact, user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [name, age, gender, room_number, emergency_contact, user_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding patient');
    }
    res.send('Patient added successfully');
  });
});

app.get('/patients', (req, res) => {
  const user_id = req.query.user_id;

  db.query(
    'SELECT * FROM Patient WHERE user_id = ?',
    [user_id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

app.post('/health', (req, res) => {
  console.log("BODY:", req.body);

  const {
    patient_id,
    user_id,
    date,
    blood_pressure,
    sugar_level,
    heart_rate,
    temperature,
    oxygen_level
  } = req.body;

  const query = `
    INSERT INTO Daily_Health_Record
    (patient_id, user_id, date, blood_pressure, sugar_level, heart_rate, temperature, oxygen_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    patient_id,
    user_id,
    date,
    blood_pressure,
    sugar_level,
    heart_rate,
    temperature,
    oxygen_level
  ], (err) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).send(err);
    }

    res.send("Health record added");
  });
});

app.get('/health/:patient_id', (req, res) => {
  const { patient_id } = req.params;

  db.query(
    `SELECT * FROM Daily_Health_Record 
     WHERE patient_id = ? 
     ORDER BY date DESC LIMIT 1`,
    [patient_id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

app.get('/patient/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'SELECT name, age, gender, room_number FROM Patient WHERE patient_id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results[0]);
    }
  );
});

app.get('/history/:patient_id', (req, res) => {
  const { patient_id } = req.params;

  db.query(
    'SELECT * FROM Medical_History WHERE patient_id = ?',
    [patient_id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

app.get('/medication/:patient_id', (req, res) => {
  const { patient_id } = req.params;

  db.query(
    'SELECT * FROM Medication WHERE patient_id = ?',
    [patient_id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

app.post('/history', (req, res) => {
  const { patient_id, disease, notes } = req.body;

  const query = `
    INSERT INTO Medical_History (patient_id, disease, notes)
    VALUES (?, ?, ?)
  `;

  db.query(query, [patient_id, disease, notes], (err) => {
    if (err) return res.status(500).send(err);
    res.send('History added');
  });
});

app.post('/medication', (req, res) => {
  const { patient_id, medicine_name, dosage, timing } = req.body;

  const query = `
    INSERT INTO Medication (patient_id, medicine_name, dosage, timing)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [patient_id, medicine_name, dosage, timing], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Medication added');
  });
});

app.get('/health-history/:patient_id', (req, res) => {
  const { patient_id } = req.params;
  const { days } = req.query;

  db.query(
    `SELECT date, blood_pressure, sugar_level, heart_rate, temperature, oxygen_level
     FROM Daily_Health_Record
     WHERE patient_id = ?
     ORDER BY date DESC
     LIMIT ?`,
    [patient_id, parseInt(days)],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results.reverse());
    }
  );
});


/* add more APIs here later */

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
