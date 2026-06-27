'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Participant } from '@/types/app';

interface RawParticipant {
  session_id: string;
  user_id: string;
  display_name: string;
  submitted_at: string | null;
}

function mapRow(r: RawParticipant): Participant {
  return {
    sessionId: r.session_id,
    userId: r.user_id,
    displayName: r.display_name,
    submittedAt: r.submitted_at,
  };
}

export function useParticipants(sessionId: string) {
  const [participants, setParticipants] = useState<Participant[]>([]);

  const fetchParticipants = useCallback(async () => {
    if (!sessionId) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from('session_participants')
      .select('*')
      .eq('session_id', sessionId);
    if (error) console.error('[useParticipants] fetch error:', error);
    if (data) setParticipants((data as RawParticipant[]).map(mapRow));
  }, [sessionId]);

  useEffect(() => {
    fetchParticipants();
    if (!sessionId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`participants:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_participants',
          filter: `session_id=eq.${sessionId}`,
        },
        () => { fetchParticipants(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId, fetchParticipants]);

  return { participants, refetch: fetchParticipants };
}
