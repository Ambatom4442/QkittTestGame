CREATE TABLE IF NOT EXISTS save_slots (
  id INTEGER PRIMARY KEY,
  profile_id INTEGER NOT NULL,
  slot_name TEXT NOT NULL,
  scene_id TEXT,
  position_json TEXT,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES profiles(id)
);
