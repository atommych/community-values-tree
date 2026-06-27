DO $$
DECLARE
  root_id            uuid := gen_random_uuid();
  empatia_id         uuid := gen_random_uuid();
  integridade_id     uuid := gen_random_uuid();
  crescimento_id     uuid := gen_random_uuid();
  relacionamentos_id uuid := gen_random_uuid();
  proposito_id       uuid := gen_random_uuid();
  equilibrio_id      uuid := gen_random_uuid();
  coragem_id         uuid := gen_random_uuid();
  justica_id         uuid := gen_random_uuid();
  criatividade_id    uuid := gen_random_uuid();
  abundancia_id      uuid := gen_random_uuid();
BEGIN

-- ═══ RAIZ ═══
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (root_id, 'Respeito', 'O valor fundamental que une e sustenta todos os outros', NULL, 0, 0, '#6366f1');

-- ═══ GALHO 1: Empatia ═══
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (empatia_id, 'Empatia', 'Compreender e compartilhar os sentimentos dos outros', root_id, 1, 1, '#ec4899');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  ('Escuta Ativa',  'Ouvir com atenção plena e presença',         empatia_id, 2, 1),
  ('Compaixão',     'Sentir e agir diante do sofrimento alheio',  empatia_id, 2, 2),
  ('Apoio Mútuo',   'Estar presente para quem precisa',           empatia_id, 2, 3),
  ('Acolhimento',   'Receber o outro sem julgamento',             empatia_id, 2, 4),
  ('Generosidade',  'Dar sem esperar em troca',                   empatia_id, 2, 5);

-- ═══ GALHO 2: Integridade ═══
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (integridade_id, 'Integridade', 'Agir de acordo com princípios éticos sólidos', root_id, 1, 2, '#f59e0b');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  ('Honestidade',      'Falar e agir com verdade',                    integridade_id, 2, 1),
  ('Responsabilidade', 'Assumir as consequências das próprias ações',  integridade_id, 2, 2),
  ('Transparência',    'Agir de forma aberta e sem ocultamentos',      integridade_id, 2, 3),
  ('Ética',            'Guiar-se por princípios morais sólidos',       integridade_id, 2, 4),
  ('Coerência',        'Alinhar palavras, valores e atitudes',         integridade_id, 2, 5);

-- ═══ GALHO 3: Crescimento ═══
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (crescimento_id, 'Crescimento', 'Evoluir contínua e intencionalmente', root_id, 1, 3, '#10b981');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  ('Aprendizado',       'Buscar conhecimento de forma contínua',       crescimento_id, 2, 1),
  ('Resiliência',       'Superar desafios com força interior',         crescimento_id, 2, 2),
  ('Autoconhecimento',  'Entender a si mesmo profundamente',           crescimento_id, 2, 3),
  ('Inovação',          'Criar novas soluções e formas de ser',        crescimento_id, 2, 4),
  ('Curiosidade',       'Questionar e explorar o desconhecido',        crescimento_id, 2, 5);

-- ═══ GALHO 4: Relacionamentos ═══
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (relacionamentos_id, 'Relacionamentos', 'A qualidade dos vínculos com os outros', root_id, 1, 4, '#3b82f6');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  ('Família',       'Amor e compromisso com os laços familiares',  relacionamentos_id, 2, 1),
  ('Amizade',       'Cultivar vínculos de confiança e afeto',      relacionamentos_id, 2, 2),
  ('Comunidade',    'Pertencer e contribuir com o coletivo',       relacionamentos_id, 2, 3),
  ('Colaboração',   'Trabalhar junto em prol de um bem comum',     relacionamentos_id, 2, 4),
  ('Pertencimento', 'Sentir-se parte de algo maior que si mesmo',  relacionamentos_id, 2, 5);

-- ═══ GALHO 5: Propósito ═══
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (proposito_id, 'Propósito', 'Viver com sentido e intenção', root_id, 1, 5, '#8b5cf6');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  ('Contribuição',    'Fazer diferença na vida dos outros',         proposito_id, 2, 1),
  ('Espiritualidade', 'Conectar-se com algo transcendente',         proposito_id, 2, 2),
  ('Legado',          'Deixar algo valioso para o futuro',          proposito_id, 2, 3),
  ('Vocação',         'Alinhar trabalho e chamado interior',        proposito_id, 2, 4),
  ('Significado',     'Encontrar sentido profundo na vida',         proposito_id, 2, 5);

-- ═══ GALHO 6: Equilíbrio ═══
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (equilibrio_id, 'Equilíbrio', 'Harmonia entre as dimensões da vida', root_id, 1, 6, '#06b6d4');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  ('Saúde',        'Cuidar do corpo, mente e espírito',           equilibrio_id, 2, 1),
  ('Paz Interior', 'Cultivar serenidade e calma genuína',         equilibrio_id, 2, 2),
  ('Bem-estar',    'Viver com qualidade e satisfação',            equilibrio_id, 2, 3),
  ('Descanso',     'Reconhecer o valor do repouso e da pausa',    equilibrio_id, 2, 4),
  ('Presença',     'Estar plenamente no momento presente',        equilibrio_id, 2, 5);

-- ═══ GALHO 7: Coragem ═══
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (coragem_id, 'Coragem', 'Agir apesar do medo e da incerteza', root_id, 1, 7, '#ef4444');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  ('Determinação',    'Persistir diante dos obstáculos',            coragem_id, 2, 1),
  ('Vulnerabilidade', 'Abrir-se autenticamente ao outro',           coragem_id, 2, 2),
  ('Ousadia',         'Arriscar em prol do crescimento',            coragem_id, 2, 3),
  ('Liderança',       'Inspirar e guiar com responsabilidade',      coragem_id, 2, 4),
  ('Iniciativa',      'Agir sem esperar permissão',                 coragem_id, 2, 5);

-- ═══ GALHO 8: Justiça ═══
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (justica_id, 'Justiça', 'Tratar a todos com equidade e dignidade', root_id, 1, 8, '#f97316');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  ('Equidade',      'Dar a cada um o que é seu',                  justica_id, 2, 1),
  ('Diversidade',   'Valorizar as diferenças como riqueza',       justica_id, 2, 2),
  ('Inclusão',      'Garantir que todos tenham espaço',           justica_id, 2, 3),
  ('Solidariedade', 'Lutar junto pelos mais vulneráveis',         justica_id, 2, 4),
  ('Dignidade',     'Reconhecer o valor inerente de todo ser',    justica_id, 2, 5);

-- ═══ GALHO 9: Criatividade ═══
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (criatividade_id, 'Criatividade', 'Expressar-se e criar com liberdade', root_id, 1, 9, '#d946ef');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  ('Expressão',   'Manifestar a própria essência livremente',     criatividade_id, 2, 1),
  ('Beleza',      'Apreciar e criar o que é estético',            criatividade_id, 2, 2),
  ('Imaginação',  'Sonhar e conceber novas possibilidades',       criatividade_id, 2, 3),
  ('Arte',        'Usar a arte como forma de comunicação',        criatividade_id, 2, 4),
  ('Jogo',        'Explorar com leveza e brincadeira',            criatividade_id, 2, 5);

-- ═══ GALHO 10: Abundância ═══
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (abundancia_id, 'Abundância', 'Viver com gratidão e prosperidade interior', root_id, 1, 10, '#84cc16');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  ('Gratidão',     'Reconhecer as bênçãos do dia a dia',          abundancia_id, 2, 1),
  ('Prosperidade', 'Criar condições de florescimento',            abundancia_id, 2, 2),
  ('Alegria',      'Cultivar leveza e felicidade genuína',        abundancia_id, 2, 3),
  ('Otimismo',     'Ver as possibilidades além dos desafios',     abundancia_id, 2, 4),
  ('Liberdade',    'Viver autenticamente e com autonomia',        abundancia_id, 2, 5);

END $$;
