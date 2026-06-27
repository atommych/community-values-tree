-- Habilitar RLS em todas as tabelas
ALTER TABLE values               ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_values          ENABLE ROW LEVEL SECURITY;

-- ── values: qualquer um pode ler, ninguém escreve pelo cliente ──
CREATE POLICY "values_public_read"
  ON values FOR SELECT USING (true);

-- ── sessions ──
-- Qualquer autenticado lê sessões ativas (para entrar pelo código)
CREATE POLICY "sessions_read_active"
  ON sessions FOR SELECT
  USING (is_active = true AND auth.role() = 'authenticated');

-- Facilitador lê todas as suas sessões (inclusive inativas)
CREATE POLICY "sessions_read_own"
  ON sessions FOR SELECT
  USING (facilitator_id = auth.uid());

-- Apenas autenticados criam sessões
CREATE POLICY "sessions_insert"
  ON sessions FOR INSERT
  WITH CHECK (facilitator_id = auth.uid() AND auth.role() = 'authenticated');

-- Apenas o facilitador atualiza/encerra sua sessão
CREATE POLICY "sessions_update_own"
  ON sessions FOR UPDATE
  USING (facilitator_id = auth.uid());

-- ── session_participants ──
-- Participante vê sua própria linha; facilitador vê todos da sessão;
-- outros participantes da mesma sessão também veem (para a lista ao vivo)
CREATE POLICY "participants_read"
  ON session_participants FOR SELECT
  USING (
    auth.uid() = user_id
    OR session_id IN (
      SELECT id FROM sessions WHERE facilitator_id = auth.uid()
    )
    OR session_id IN (
      SELECT session_id FROM session_participants WHERE user_id = auth.uid()
    )
  );

-- Usuário só insere ele mesmo
CREATE POLICY "participants_insert_self"
  ON session_participants FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Usuário atualiza só sua linha (para marcar submitted_at)
CREATE POLICY "participants_update_self"
  ON session_participants FOR UPDATE
  USING (user_id = auth.uid());

-- ── user_values ──
-- Facilitador vê todos da sessão; participante vê só os seus
CREATE POLICY "user_values_read"
  ON user_values FOR SELECT
  USING (
    user_id = auth.uid()
    OR session_id IN (
      SELECT id FROM sessions WHERE facilitator_id = auth.uid()
    )
  );

-- Usuário insere só para si mesmo
CREATE POLICY "user_values_insert"
  ON user_values FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Usuário pode remover seus valores antes de submeter
CREATE POLICY "user_values_delete"
  ON user_values FOR DELETE
  USING (user_id = auth.uid());
