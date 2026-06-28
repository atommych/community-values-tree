'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  fallback?: string;
  label?: string;
  alwaysUseFallback?: boolean;
}

export function BackButton({ fallback = '/dashboard', label = '← Voltar', alwaysUseFallback = false }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (!alwaysUseFallback && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleBack}>
      {label}
    </Button>
  );
}
