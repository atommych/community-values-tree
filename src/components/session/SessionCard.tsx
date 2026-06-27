'use client';

import type { Session, Participant } from '@/types/app';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

interface SessionCardProps {
  session: Session;
  participants: Participant[];
}

export function SessionCard({ session, participants }: SessionCardProps) {
  const [copied, setCopied] = useState(false);
  const submittedCount = participants.filter(p => p.submittedAt).length;
  const total = participants.length;
  const progress = total > 0 ? (submittedCount / total) * 100 : 0;

  const copyLink = async () => {
    const url = `${window.location.origin}/sessao/${session.code}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{session.name}</CardTitle>
          <p className="text-slate-500 text-sm mt-1">
            Código:{' '}
            <span className="font-mono font-bold tracking-widest text-indigo-600">
              {session.code}
            </span>
          </p>
        </div>
        <Badge variant={session.isActive ? 'default' : 'secondary'}>
          {session.isActive ? 'Ativa' : 'Encerrada'}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 mb-2">
          {submittedCount} de {total} participante{total !== 1 ? 's' : ''} enviou seus valores
        </p>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" onClick={copyLink}>
          {copied ? '✓ Copiado!' : 'Copiar link'}
        </Button>
        <Button asChild size="sm">
          <Link href={`/sessao/${session.code}/resultado`}>Ver resultado</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
