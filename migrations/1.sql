
CREATE TABLE bot_library (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trigger_keywords TEXT NOT NULL,
  response_text TEXT NOT NULL,
  coping_tip_title TEXT,
  coping_tip_content TEXT,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  coping_tip_title TEXT,
  coping_tip_content TEXT,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  latest_concern TEXT,
  last_three_messages_summary TEXT,
  overall_risk_level TEXT NOT NULL CHECK (overall_risk_level IN ('Low', 'Medium', 'High')),
  suggested_next_step TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_risk_level ON user_sessions(overall_risk_level);
