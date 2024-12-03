-- Création de la base de données
SET NAMES 'utf8mb4' COLLATE 'utf8mb4_general_ci';
CREATE DATABASE IF NOT EXISTS blog CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE blog;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des articles
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des commentaires
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertion de données par défaut
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@example.com', 'adminpassword', 'admin'),
('user', 'user@example.com', 'userpassword', 'user');

INSERT INTO articles (title, content, author_id) VALUES
('Les Meilleures Pratiques pour la Sécurité du Web', "<p>Assurez la sécurité de vos applications web en adoptant ces pratiques essentielles.</p><section><h2>1. Protéger les données sensibles</h2><p>La protection des données sensibles, telles que les mots de passe et les informations personnelles des utilisateurs, est cruciale. Utilisez des algorithmes de hachage robustes, comme bcrypt ou Argon2, pour stocker les mots de passe. Ne jamais transmettre des données sensibles en clair : implémentez des connexions sécurisées avec HTTPS grâce à TLS. Enfin, veillez à limiter l'accès aux données sensibles uniquement aux parties autorisées.</p></section><section><h2>2. Prévenir les injections</h2><p>Les attaques par injection, notamment l'injection SQL et l'injection de commandes, figurent parmi les vulnérabilités les plus courantes. Pour les prévenir, utilisez des requêtes préparées et des ORM (Object-Relational Mapping) dans vos interactions avec les bases de données. Validez et nettoyez toujours les entrées des utilisateurs afin d'empêcher l'injection de code malveillant dans vos systèmes.</p></section><section><h2>3. Protéger contre les attaques XSS</h2><p>Les attaques XSS (Cross-Site Scripting) consistent à injecter des scripts malveillants dans les pages web d'un site. Pour les éviter, encodez les données de sortie (comme le HTML ou le JavaScript) avant de les afficher dans le navigateur. Utilisez également des Content Security Policies (CSP) pour limiter l'exécution des scripts et minimiser les risques associés.</p></section><section><h2>4. Mettre en œuvre une authentification robuste</h2><p>Une authentification robuste est essentielle pour protéger vos utilisateurs. Implémentez des politiques de mots de passe fortes, exigeant des combinaisons de caractères complexes. Encouragez ou imposez l'utilisation de l'authentification multi-facteurs (MFA) pour ajouter une couche de sécurité supplémentaire. Enfin, limitez le nombre de tentatives de connexion pour prévenir les attaques par force brute.</p></section><section><h2>5. Suivre les mises à jour et surveiller les vulnérabilités</h2><p>Les logiciels obsolètes et les bibliothèques non maintenues représentent des risques majeurs pour la sécurité. Assurez-vous de maintenir votre système à jour en appliquant régulièrement les correctifs de sécurité. De plus, surveillez activement les vulnérabilités dans vos dépendances et mettez en place des outils d'analyse pour identifier les failles potentielles dans votre code.</p></section>"
, 1),
('Les Failles de Sécurité les Plus Communes', "<p>Comprendre les failles de sécurité les plus courantes est essentiel pour mieux protéger vos applications web.</p><section><h2>1. Injection SQL</h2><p>L'injection SQL se produit lorsque des requêtes non sécurisées permettent à un attaquant d'exécuter des commandes malveillantes dans la base de données. Cela peut conduire à un accès non autorisé ou à la modification des données. La prévention passe par l'utilisation de requêtes préparées et d'ORM.</p></section><section><h2>2. Cross-Site Scripting (XSS)</h2><p>Les attaques XSS consistent à injecter des scripts malveillants dans des pages web consultées par d'autres utilisateurs. Ces scripts peuvent voler des cookies ou rediriger les utilisateurs vers des sites malveillants. Pour les éviter, encodez les sorties et utilisez des Content Security Policies (CSP).</p></section><section><h2>3. Falsification de Requêtes Inter-Sites (CSRF)</h2><p>Les attaques CSRF forcent les utilisateurs authentifiés à exécuter des actions non désirées sur un site où ils sont connectés. La meilleure défense consiste à utiliser des jetons CSRF et à valider les requêtes côté serveur.</p></section><section><h2>4. Exposition de Données Sensibles</h2><p>Lorsque des données sensibles, comme des mots de passe ou des informations personnelles, sont mal protégées, elles peuvent être exposées lors d'une violation. Utilisez des connexions sécurisées (HTTPS), cryptez les données sensibles, et implémentez des politiques de gestion des accès rigoureuses.</p></section><section><h2>5. Contrôle d'Accès Inadéquat</h2><p>Un contrôle d'accès inadéquat permet aux utilisateurs d'accéder à des ressources ou fonctionnalités non autorisées. Implémentez des mécanismes de vérification au niveau du serveur et appliquez le principe du moindre privilège.</p></section>", 1);

INSERT INTO comments (content, article_id, user_id) VALUES
('Great article!', 1, 2),
('Thanks for the info.', 1, 2);
