const express = require('express');
const router = express.Router();
const db = require('../db'); // Connexion à la base de données
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// Route pour lister les commentaires d'un article
router.get('/articles/:id/comments', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM comments WHERE article_id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des commentaires :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des commentaires' });
    } else {
      res.json(results);
    }
  });
});

// Route pour récupérer un commentaire spécifique
router.get('/comments/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM comments WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du commentaire :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération du commentaire' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Commentaire introuvable' });
    } else {
      res.json(results[0]);
    }
  });
});

// Route pour ajouter un commentaire
router.post('/articles/:id/comments', authenticate, (req, res) => {
  const { id } = req.params;
  const { content, user_id } = req.body;
  const sql = 'INSERT INTO comments (content, user_id, article_id) VALUES (?, ?, ?)';
  db.query(sql, [content, user_id, id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la création du commentaire :', err);
      res.status(500).json({ error: 'Erreur lors de la création du commentaire' });
    } else {
      res.status(201).json({ message: 'Commentaire créé avec succès', id: results.insertId });
    }
  });
});

// Route pour supprimer un commentaire (admin seulement)
router.delete('/comments/:id', authenticate, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM comments WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression du commentaire :', err);
      res.status(500).json({ error: 'Erreur lors de la suppression du commentaire' });
    } else {
      res.json({ message: 'Commentaire supprimé avec succès' });
    }
  });
});

module.exports = router;
