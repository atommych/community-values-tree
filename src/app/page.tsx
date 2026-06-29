import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
          🌳 Team Building · Família · Comunidade
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          Descubra os valores<br />
          <span className="text-indigo-600">que nos unem</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Cada membro seleciona seus valores pessoais. O sistema encontra o{' '}
          <strong>tronco comum</strong> — o que verdadeiramente sustenta a todos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-base px-8">
            <Link href="/login">Começar agora</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base px-8">
            <Link href="/sessao/entrar">Tenho um código</Link>
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          {[
            {
              step: '1',
              title: 'Crie uma sessão',
              desc: 'O facilitador cria uma sessão e compartilha o código com o grupo.',
              color: '#6366f1',
            },
            {
              step: '2',
              title: 'Selecione valores',
              desc: 'Cada membro escolhe de 5 a 10 valores que mais o representam.',
              color: '#ec4899',
            },
            {
              step: '3',
              title: 'Veja o tronco comum',
              desc: 'O sistema revela a árvore de valores e o ancestral comum a todos.',
              color: '#10b981',
            },
          ].map(({ step, title, desc, color }) => (
            <div key={step} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4"
                style={{ backgroundColor: color }}
              >
                {step}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-white border border-slate-200 shadow-lg p-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Exemplo de resultado
          </p>
          <pre className="text-sm text-left text-slate-700 font-mono leading-loose overflow-x-auto">
{`[ Escuta ]  [ Apoio ]  [ Honestidade ]   ← Valores pessoais
     \\         /              |
  [ Empatia ]         [ Integridade ]     ← Tronco Comum
        \\                  /
           [ Autonomia ]                  ← Objetivo comum`}
          </pre>
        </div>
      </div>
    </main>
  );
}
