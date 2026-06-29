-- Migration 005: Allow multiple participants per OAuth account
-- Introduces participant_id as the primary key for session_participants,
-- decoupling participant identity from the Supabase auth user_id so the
-- same Google account can join a session multiple times under different names.

-- Step 1: add participant_id column to session_participants
ALTER TABLE session_participants
  ADD COLUMN IF NOT EXISTS participant_id uuid DEFAULT gen_random_uuid();

-- Ensure all existing rows have a value
UPDATE session_participants SET participant_id = gen_random_uuid() WHERE participant_id IS NULL;
ALTER TABLE session_participants ALTER COLUMN participant_id SET NOT NULL;

-- Step 2: swap the primary key
ALTER TABLE session_participants DROP CONSTRAINT session_participants_pkey;
ALTER TABLE session_participants ADD PRIMARY KEY (participant_id);

-- Retain a useful index for lookups by (session_id) and (session_id, user_id)
CREATE INDEX IF NOT EXISTS idx_participants_session_user
  ON session_participants(session_id, user_id);

-- Step 3: add participant_id to user_values
ALTER TABLE user_values
  ADD COLUMN IF NOT EXISTS participant_id uuid
    REFERENCES session_participants(participant_id) ON DELETE CASCADE;

-- Step 4: backfill participant_id in user_values from session_participants
-- (matches the old (session_id, user_id) identity)
UPDATE user_values uv
  SET participant_id = sp.participant_id
  FROM session_participants sp
  WHERE uv.session_id = sp.session_id
    AND uv.user_id = sp.user_id
    AND uv.participant_id IS NULL;

-- Step 5: replace the old unique constraint with a participant-scoped one
ALTER TABLE user_values
  DROP CONSTRAINT IF EXISTS user_values_session_id_user_id_value_id_key;
ALTER TABLE user_values
  ADD CONSTRAINT user_values_participant_value_unique
    UNIQUE (participant_id, value_id);
