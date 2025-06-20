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
