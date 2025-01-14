const express = require('express');
const router = express.Router();
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcrypt');

// Route pour s'inscrire
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const checkSql = 'SELECT * FROM users WHERE email = ? OR username = ?';
  const insertSql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  try {
    const [existingUsers] = await req.db.execute(checkSql, [email, username]);
    if (existingUsers.length > 0) {
      // ajoute d'une temporisation pour éviter les attaques par force brute
      await new Promise(resolve => setTimeout(resolve, 2000));
      return res.status(400).json({ error: 'Email ou nom d\'utilisateur déjà utilisé' });
    }
    const [results] = await req.db.execute(insertSql, [username, email, hashedPassword]);
    res.status(201).json({ message: 'Utilisateur créé avec succès', id: results.insertId });
  } catch (err) {
    console.error('Erreur lors de l\'inscription :', err);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// Route pour se connecter
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT id, username, email, password FROM users WHERE email = ?';
  try {
    const [results] = await req.db.execute(sql, [email]);

    if (results.length === 0) {
      // ajoute d'une temporisation pour éviter les attaques par force brute
      await new Promise(resolve => setTimeout(resolve, 2000));
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    const user = results[0];

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Erreur lors de la connexion :', err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

module.exports = router;
