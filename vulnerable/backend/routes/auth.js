const express = require('express');
const router = express.Router();
const db = require('../db'); // Connexion à la base de données
const { generateToken } = require('../utils/jwt');

// Route pour s'inscrire
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'inscription :', err);
      res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    } else {
      res.status(201).json({ message: 'Utilisateur créé avec succès', id: results.insertId });
    }
  });
});

// Route pour se connecter
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Erreur lors de la connexion :', err);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    } else {
      const user = results[0];
      const token = generateToken(user);
      res.json({ message: 'Connexion réussie', token, user });
    }
  });
});

module.exports = router;
