PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS terms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  "case" INTEGER DEFAULT 0,
  pos INTEGER,
  notes TEXT DEFAULT '',
  pps TEXT DEFAULT '["", "", "", "", "", ""]'
);

CREATE TABLE IF NOT EXISTS group_detail (
  group_id INTEGER NOT NULL,
  term_id INTEGER NOT NULL,
  FOREIGN KEY (group_id) REFERENCES groups (id)
  FOREIGN KEY (term_id) REFERENCES terms (id)
);
