-- Árvore de valores hierárquica (pré-populada, read-only para usuários)
CREATE TABLE IF NOT EXISTS values (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  parent_id   uuid REFERENCES values(id) ON DELETE SET NULL,
  level       int  NOT NULL CHECK (level BETWEEN 0 AND 2),
  sort_order  int  DEFAULT 0,
  color_hex   text
);

CREATE INDEX IF NOT EXISTS idx_values_parent ON values(parent_id);
CREATE INDEX IF NOT EXISTS idx_values_level ON values(level);

-- Sessões de dinâmica de grupo
CREATE TABLE IF NOT EXISTS sessions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code            text UNIQUE NOT NULL,
  name            text NOT NULL,
  facilitator_id  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz DEFAULT now(),
  is_active       boolean DEFAULT true,
  max_participants int DEFAULT 50
);

CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);
CREATE INDEX IF NOT EXISTS idx_sessions_facilitator ON sessions(facilitator_id);

-- Participantes por sessão
CREATE TABLE IF NOT EXISTS session_participants (
  session_id   uuid REFERENCES sessions(id) ON DELETE CASCADE,
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  submitted_at timestamptz,
  PRIMARY KEY (session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_participants_session ON session_participants(session_id);

-- Valores selecionados por usuário em cada sessão
CREATE TABLE IF NOT EXISTS user_values (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid REFERENCES sessions(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  value_id    uuid REFERENCES values(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now(),
  UNIQUE(session_id, user_id, value_id)
);

CREATE INDEX IF NOT EXISTS idx_user_values_session ON user_values(session_id);
CREATE INDEX IF NOT EXISTS idx_user_values_user    ON user_values(user_id, session_id);
