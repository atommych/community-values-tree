'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!sessionId) return;

    const supabase = createClient();

    supabase
      .from('session_participants')
      .select('*')
      .eq('session_id', sessionId)
      .then(({ data }) => {
        if (data) setParticipants((data as RawParticipant[]).map(mapRow));
      });

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
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setParticipants(prev => [...prev, mapRow(payload.new as RawParticipant)]);
          }
          if (payload.eventType === 'UPDATE') {
            setParticipants(prev =>
              prev.map(p =>
                p.userId === (payload.new as RawParticipant).user_id
                  ? mapRow(payload.new as RawParticipant)
                  : p
              )
            );
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  return participants;
}
