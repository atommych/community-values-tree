'use client';

import type { Participant } from '@/types/app';
import { Badge } from '@/components/ui/badge';

interface ParticipantListProps {
  participants: Participant[];
}

export function ParticipantList({ participants }: ParticipantListProps) {
  const submitted = participants.filter(p => p.submittedAt);
  const waiting = participants.filter(p => !p.submittedAt);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">
        Participantes ({participants.length})
      </h3>
      {participants.length === 0 && (
        <p className="text-sm text-slate-400 italic">Aguardando participantes...</p>
      )}
      {submitted.map(p => (
        <div key={p.userId} className="flex items-center justify-between">
          <span className="text-sm text-slate-700">{p.displayName}</span>
          <Badge variant="success">Enviado ✓</Badge>
        </div>
      ))}
      {waiting.map(p => (
        <div key={p.userId} className="flex items-center justify-between">
          <span className="text-sm text-slate-500">{p.displayName}</span>
          <Badge variant="secondary">Selecionando...</Badge>
        </div>
      ))}
    </div>
  );
}
