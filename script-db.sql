-- Table des adresses autorisées à se connecter via Google
CREATE TABLE authorized_emails (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL       -- L'email autorisé à se connecter
);

-- Table des utilisateurs (liée à l'authentification Google)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,      -- L'email utilisé pour se connecter (identifiant principal)
  name VARCHAR,                       -- Nom ou pseudo récupéré depuis Google
  image_url VARCHAR,                  -- Photo de profil (facultatif)
  admin BOOLEAN DEFAULT FALSE         -- Pour déterminer si l'utilisateur est admin
);

-- Table des dossiers (pour organiser les vidéos et images)
CREATE TABLE folders (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,              -- Nom du dossier (ex: "cours", "exercices", etc.)
  created_by INTEGER,                 -- Optionnel : ID de l'utilisateur qui a créé le dossier
  created_at TIMESTAMP DEFAULT NOW(),
  parent_id INTEGER,
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Table des fichiers média (vidéos ou images)
CREATE TABLE media_files (
  id SERIAL PRIMARY KEY,
  url VARCHAR NOT NULL,               -- URL du fichier (stocké dans un bucket S3, dossier Vercel, etc.)
  type VARCHAR CHECK (type IN ('video', 'image')),  -- Type du fichier
  name VARCHAR,                       -- Nom affiché pour le fichier
  folder_id INTEGER,                 -- Dossier auquel le fichier appartient
  uploaded_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_folder_id FOREIGN KEY (folder_id) REFERENCES folders(id),
);

-- Table des questions FAQ posées par les utilisateurs
CREATE TABLE faq_questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,                   -- Contenu de la question
  created_by INTEGER NOT NULL,              -- Utilisateur qui pose la question
  created_at TIMESTAMP DEFAULT NOW(),       -- Date de création de la question

  CONSTRAINT fk_question_user FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Table des réponses FAQ rédigées par un admin
CREATE TABLE faq_answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER UNIQUE NOT NULL,      -- Lien avec la question (une seule réponse par question)
  answer TEXT NOT NULL,                     -- Contenu de la réponse
  answered_by INTEGER NOT NULL,             -- Admin qui répond
  answered_at TIMESTAMP DEFAULT NOW(),      -- Date de réponse

  CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES faq_questions(id) ON DELETE CASCADE,
  CONSTRAINT fk_answer_user FOREIGN KEY (answered_by) REFERENCES users(id)
);
