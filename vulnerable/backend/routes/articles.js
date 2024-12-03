const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// Route pour récupérer tous les articles
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM articles';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des articles :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
    } else {
      res.json(results);
    }
  });
});

// Route pour récupérer un article spécifique
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM articles WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'article :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Article introuvable' });
    } else {
      res.json(results[0]);
    }
  });
});

// Route pour créer un nouvel article
router.post('/', authenticate, authorizeAdmin, (req, res) => {
  const { title, content, author_id } = req.body;
  const sql = 'INSERT INTO articles (title, content, author_id) VALUES (?, ?, ?)';
  db.query(sql, [title, content, author_id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la création de l\'article :', err);
      res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
    } else {
      const newArticle = {
        id: results.insertId,
        title,
        content,
        author_id
      };
      res.status(201).json({ message: 'Article créé avec succès', article: newArticle });
    }
  });
});

// Route pour modifier un article
router.put('/:id', authenticate, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const { title, content, author_id } = req.body;
  const sql = 'UPDATE articles SET title = ?, content = ?, author_id = ? WHERE id = ?';
  db.query(sql, [title, content, author_id, id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la modification de l\'article :', err);
      res.status(500).json({ error: 'Erreur lors de la modification de l\'article' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Article introuvable' });
    } else {
      const updatedArticle = {
        id,
        title,
        content,
        author_id
      };
      res.json({ message: 'Article modifié avec succès', article: updatedArticle });
    }
  });
});

// Route pour supprimer un article
router.delete('/:id', authenticate, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM articles WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'article :', err);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Article introuvable' });
    } else {
      res.json({ message: 'Article supprimé avec succès' });
    }
  });
});

module.exports = router;
