const express = require('express');
const router = express.Router();
const db = require('../db'); // Connexion à la base de données
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// Route pour lister les utilisateurs
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    } else {
      res.json(results);
    }
  });
});

// Route pour récupérer un utilisateur spécifique
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Utilisateur introuvable' });
    } else {
      res.json(results[0]);
    }
  });
});

// Route pour supprimer un utilisateur
router.delete('/:id', authenticate, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', err);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    } else {
      res.json({ message: 'Utilisateur supprimé avec succès' });
    }
  });
});

// Route pour modifier un utilisateur
router.put('/:id', authenticate, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  const sql = 'UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?';
  db.query(sql, [username, email, password, role, id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la modification de l\'utilisateur :', err);
      res.status(500).json({ error: 'Erreur lors de la modification de l\'utilisateur' });
    } else {
      const updatedUserSql = 'SELECT * FROM users WHERE id = ?';
      db.query(updatedUserSql, [id], (err, updatedResults) => {
        if (err) {
          console.error('Erreur lors de la récupération de l\'utilisateur modifié :', err);
          res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur modifié' });
        } else {
          res.json(updatedResults[0]);
        }
      });
    }
  });
});

module.exports = router;
