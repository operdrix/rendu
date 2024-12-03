const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const initializeDbConnection = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const startServer = async () => {
  try {
    // Attente que la base de données soit prête
    const db = await initializeDbConnection();
    console.log('Base de données initialisée avec succès.');

    // Injection de la connexion DB dans les routes
    app.use((req, res, next) => {
      req.db = db; // Ajout de la connexion à l'objet requête
      next();
    });

    // Importation des routes
    const authRoutes = require('./routes/auth');
    const userRoutes = require('./routes/users');
    const articleRoutes = require('./routes/articles');
    const commentRoutes = require('./routes/comments');

    // Utilisation des routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/articles', articleRoutes);
    app.use('/api/', commentRoutes);

    const PORT = 5100;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (error) {
    console.error('Erreur lors de l\'initialisation du serveur :', error);
    process.exit(1); // Arrêt en cas d'erreur critique
  }
};

startServer();