'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  fallback?: string;
  label?: string;
}

export function BackButton({ fallback = '/dashboard', label = '← Voltar' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
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
