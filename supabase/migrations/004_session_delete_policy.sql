-- Facilitador pode apagar suas próprias sessões
CREATE POLICY "sessions_delete_own"
  ON sessions FOR DELETE
  USING (facilitator_id = auth.uid());
