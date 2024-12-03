const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// Route pour lister les commentaires d'un article
router.get('/articles/:id/comments', async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM comments WHERE article_id = ?';
  console.log(sql);

  try {
    const [results] = await req.db.execute(sql, [id]);
    res.json(results);
  } catch (err) {
    console.error('Erreur lors de la récupération des commentaires :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des commentaires' });
  }
});

// Route pour récupérer un commentaire spécifique
router.get('/comments/:id', async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM comments WHERE id = ?';
  try {
    const [results] = await req.db.execute(sql, [id]);
    if (results.length === 0) {
      res.status(404).json({ error: 'Commentaire introuvable' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('Erreur lors de la récupération du commentaire :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération du commentaire' });
  }
});

// Route pour ajouter un commentaire
router.post('/articles/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { content, user_id } = req.body;
  //const sql = 'INSERT INTO comments (content, user_id, article_id) VALUES (?, ?, ?)';
  const sql = `INSERT INTO comments (user_id, article_id, content) VALUES (${user_id}, ${id}, '${content}')`;
  //const sql = `SELECT * FROM comments WHERE user_id = ${user_id}`;
  try {
    //const [results] = await req.db.execute(sql, [content, user_id, id]);
    const [results] = await req.db.query(sql);
    const newComment = {
      id: results.insertId,
      content,
      user_id,
      article_id: id
    };
    res.status(201).json({ message: "Commentaire ajouté à l'article", comment: newComment });
  } catch (err) {
    console.error('Erreur lors de la création du commentaire :', err);
    res.status(500).json({ error: 'Erreur lors de la création du commentaire' });
  }
});

// Route pour supprimer un commentaire (admin seulement)
router.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM comments WHERE id = ?';
  try {
    await req.db.execute(sql, [id]);
    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du commentaire :', err);
    res.status(500).json({ error: 'Erreur lors de la suppression du commentaire' });
  }
});

module.exports = router;
