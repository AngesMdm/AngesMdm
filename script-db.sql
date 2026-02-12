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
  created_at TIMESTAMP DEFAULT NOW(),
  parent_id INTEGER,
  media_count INTEGER DEFAULT 0      -- Compteur de fichiers dans le dossier
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

-- Fonction déclenchée à chaque insert/delete sur media_files
CREATE OR REPLACE FUNCTION update_folder_media_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE folders SET media_count = media_count + 1 WHERE id = NEW.folder_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE folders SET media_count = media_count - 1 WHERE id = OLD.folder_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Le trigger en lui-même
CREATE TRIGGER trg_update_media_count
AFTER INSERT OR DELETE ON media_files
FOR EACH ROW
EXECUTE FUNCTION update_folder_media_count();

/*
TODO
-- Ajouter la colonne updated_at aux dossiers
ALTER TABLE folders
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Déclencheur pour mettre à jour updated_at à chaque modification
CREATE OR REPLACE FUNCTION update_folders_self_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_folders_self_updated_at
BEFORE UPDATE ON folders
FOR EACH ROW
EXECUTE FUNCTION update_folders_self_updated_at();

//
CREATE OR REPLACE FUNCTION touch_parent_on_folder_change()
RETURNS TRIGGER AS $$
BEGIN
  -- si le dossier a un parent, mettre à jour updated_at du parent
  IF (TG_OP = 'INSERT') THEN
    UPDATE folders SET updated_at = NOW() WHERE id = NEW.parent_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE folders SET updated_at = NOW() WHERE id = OLD.parent_id;
  ELSIF (TG_OP = 'UPDATE') THEN
    -- si le parent change, toucher l’ancien et le nouveau
    IF NEW.parent_id IS DISTINCT FROM OLD.parent_id THEN
      UPDATE folders SET updated_at = NOW() WHERE id = OLD.parent_id;
      UPDATE folders SET updated_at = NOW() WHERE id = NEW.parent_id;
    END IF;
  END IF;
  RETURN NULL; -- on ne modifie pas la ligne enfant
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_parent_updated_on_folder_change
AFTER INSERT OR UPDATE OR DELETE ON folders
FOR EACH ROW
EXECUTE FUNCTION touch_parent_on_folder_change();

//
CREATE OR REPLACE FUNCTION touch_parent_on_file_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE folders SET updated_at = NOW() WHERE id = NEW.folder_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE folders SET updated_at = NOW() WHERE id = OLD.folder_id;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF NEW.folder_id IS DISTINCT FROM OLD.folder_id THEN
      UPDATE folders SET updated_at = NOW() WHERE id = OLD.folder_id;
      UPDATE folders SET updated_at = NOW() WHERE id = NEW.folder_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_parent_updated_on_file_change
AFTER INSERT OR UPDATE OR DELETE ON media_files
FOR EACH ROW
EXECUTE FUNCTION touch_parent_on_file_change();

*/