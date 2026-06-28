'use client';

import type { Session, Participant } from '@/types/app';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SessionCardProps {
  session: Session;
  participants: Participant[];
  isOwner?: boolean;
}

export function SessionCard({ session, participants, isOwner = true }: SessionCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const submittedCount = participants.filter(p => p.submittedAt).length;
  const total = participants.length;
  const progress = total > 0 ? (submittedCount / total) * 100 : 0;

  const copyLink = async () => {
    const url = `${window.location.origin}/sessao/${session.code}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deactivateSession = async () => {
    if (!window.confirm('Deseja desativar esta sessão? Novos participantes não poderão entrar.')) return;
    setIsDeactivating(true);
    try {
      const res = await fetch(`/api/sessao/${session.id}/desativar`, { method: 'PATCH' });
      if (res.ok) router.refresh();
    } finally {
      setIsDeactivating(false);
    }
  };

  const deleteSession = async () => {
    if (!window.confirm('Tem certeza que deseja apagar esta sessão? Esta ação não pode ser desfeita.')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/sessao/${session.id}`, { method: 'DELETE' });
      if (res.ok) router.refresh();
    } finally {
      setIsDeleting(false);
    }
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
        <div className="flex items-center gap-2">
          {!isOwner && (
            <Badge variant="secondary" className="text-xs">Participante</Badge>
          )}
          <Badge variant={session.isActive ? 'default' : 'secondary'}>
            {session.isActive ? 'Ativa' : 'Encerrada'}
          </Badge>
        </div>
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
      <CardFooter className="gap-2 flex-wrap">
        {isOwner && (
          <Button variant="outline" size="sm" onClick={copyLink}>
            {copied ? '✓ Copiado!' : 'Copiar link'}
          </Button>
        )}
        {isOwner && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/sessao/${session.code}`}>Novo participante</Link>
          </Button>
        )}
        {session.isActive ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/sessao/${session.code}?editar=1`}>Editar respostas</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled title="Sessão encerrada">
            Editar respostas
          </Button>
        )}
        <Button asChild size="sm">
          <Link href={`/sessao/${session.code}/resultado`}>Ver resultado</Link>
        </Button>
        {isOwner && session.isActive && (
          <Button
            variant="outline"
            size="sm"
            onClick={deactivateSession}
            disabled={isDeactivating}
          >
            {isDeactivating ? 'Desativando...' : 'Desativar sessão'}
          </Button>
        )}
        {isOwner && (
          <Button
            variant="destructive"
            size="sm"
            onClick={deleteSession}
            disabled={isDeleting}
          >
            {isDeleting ? 'Apagando...' : 'Apagar sessão'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
