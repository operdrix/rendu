const mysql = require('mysql2/promise');

const waitForDatabaseConnection = async () => {
  const retryInterval = 2000; // Intervalle en millisecondes (2 secondes)
  while (true) {
    try {
      console.log('Tentative de connexion à la base de données...');
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      console.log('Connecté à la base de données MySQL');
      connection.end(); // Ferme la connexion temporaire
      break; // Si la connexion réussit, on sort de la boucle
    } catch (err) {
      console.error('Base de données non prête, nouvelle tentative dans 2 secondes...');
      await new Promise((resolve) => setTimeout(resolve, retryInterval)); // Attente avant de réessayer
    }
  }
};

// Crée une instance réutilisable de connexion MySQL
const createDbConnection = () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
};

// Fonction principale pour attendre puis exporter la connexion
const initializeDbConnection = async () => {
  await waitForDatabaseConnection();
  return createDbConnection();
};

// Exportation de l'initialisation pour utilisation dans d'autres fichiers
module.exports = initializeDbConnection;
