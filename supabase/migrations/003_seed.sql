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
  felicidade_id      uuid := gen_random_uuid();
BEGIN

-- ═══ RAIZ ═══
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (root_id, 'Autonomia',
   'A capacidade de ser sujeito da própria vida — não isolamento, mas relação livre e responsável com o outro',
   NULL, 0, 0, '#6366f1');

-- ═══════════════════════════════════════════════════════════════════════
-- GALHO 1: Empatia
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (empatia_id, 'Empatia', 'Compreender e compartilhar os sentimentos dos outros', root_id, 1, 1, '#ec4899');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  -- Pacheco-core
  ('Escuta Ativa',    'Ouvir com atenção plena e presença',                                                        empatia_id, 2, 1),
  ('Compaixão',       'Sentir e agir diante do sofrimento alheio',                                                 empatia_id, 2, 2),
  ('Apoio Mútuo',     'Estar presente para quem precisa',                                                          empatia_id, 2, 3),
  ('Acolhimento',     'Receber o outro sem julgamento',                                                            empatia_id, 2, 4),
  ('Generosidade',    'Dar sem esperar em troca',                                                                  empatia_id, 2, 5),
  ('Tolerância',      'Mover-se do suportar para o genuíno reconhecimento do outro como legítimo na sua diferença', empatia_id, 2, 6),
  -- Novos (lista de valores)
  ('Zeloso/a',        'Eu tenho cuidado, atenção e dedicação nas minhas tarefas e relações',                       empatia_id, 2, 7),
  ('Carinhoso/a',     'Eu demonstro carinho com gestos, palavras e atitudes',                                      empatia_id, 2, 8),
  ('Respeitoso/a',    'Eu trato os outros com consideração e apreço',                                              empatia_id, 2, 9),
  ('Cordial',         'Eu trato as pessoas com simpatia e calor humano',                                           empatia_id, 2, 10),
  ('Compreensivo/a',  'Eu procuro entender o ponto de vista dos outros',                                           empatia_id, 2, 11),
  ('Amado/a',         'Eu cuido das relações onde há carinho e afeto',                                             empatia_id, 2, 12),
  ('Perdoador/a',     'Eu liberto ressentimentos e ofereço benevolência',                                          empatia_id, 2, 13),
  ('Altruísta',       'Eu coloco o bem-estar dos outros acima do meu quando posso',                                empatia_id, 2, 14),
  ('Humilde',         'Eu reconheço meus limites e aprendo com qualquer pessoa',                                   empatia_id, 2, 15),
  ('Acessível',       'Eu faço e escolho coisas fáceis de alcançar e entender',                                    empatia_id, 2, 16);

-- ═══════════════════════════════════════════════════════════════════════
-- GALHO 2: Integridade
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (integridade_id, 'Integridade', 'Agir de acordo com princípios éticos sólidos', root_id, 1, 2, '#f59e0b');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  -- Pacheco-core
  ('Honestidade',      'Falar e agir com verdade',                                                                 integridade_id, 2, 1),
  ('Responsabilidade', 'Assumir as consequências das próprias ações',                                              integridade_id, 2, 2),
  ('Transparência',    'Agir de forma aberta e sem ocultamentos',                                                  integridade_id, 2, 3),
  ('Ética',            'Encarnar princípios morais no modo de ser, não apenas no discurso',                        integridade_id, 2, 4),
  ('Coerência',        'Ser aquilo que se diz: alinhar teoria, atitude e prática quotidiana',                      integridade_id, 2, 5),
  ('Verdade',          'Comprometer-se com a realidade e resistir à distorção, mesmo quando incomoda',             integridade_id, 2, 6),
  -- Novos
  ('Confiável',        'As pessoas podem confiar em mim',                                                          integridade_id, 2, 7),
  ('Genuíno/a',        'Eu ajo de acordo com quem realmente sou',                                                  integridade_id, 2, 8),
  ('Cumpridor/a',      'Eu cumpro minhas obrigações e faço o que precisa ser feito',                               integridade_id, 2, 9),
  ('Fidedigno/a',      'Eu sou alguém de quem se pode depender',                                                  integridade_id, 2, 10),
  ('Assíduo',          'Eu respeito prazos e horários combinados',                                                 integridade_id, 2, 11),
  ('Virtuoso/a',       'Eu busco viver com excelência e retidão moral',                                            integridade_id, 2, 12),
  ('Laborioso/a',      'Eu trabalho com energia e empenho nas tarefas',                                            integridade_id, 2, 13),
  ('Diligente',        'Eu sou cuidadoso/a e meticuloso/a ao trabalhar',                                           integridade_id, 2, 14);

-- ═══════════════════════════════════════════════════════════════════════
-- GALHO 3: Crescimento
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (crescimento_id, 'Crescimento', 'Evoluir contínua e intencionalmente', root_id, 1, 3, '#10b981');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  -- Pacheco-core
  ('Aprendizado',       'Buscar conhecimento de forma contínua',                                                   crescimento_id, 2, 1),
  ('Resiliência',       'Superar desafios com força interior',                                                     crescimento_id, 2, 2),
  ('Autoconhecimento',  'Entender a si mesmo profundamente',                                                       crescimento_id, 2, 3),
  ('Inovação',          'Criar novas formas de ser e de fazer, sempre ancoradas num compromisso ético',            crescimento_id, 2, 4),
  ('Curiosidade',       'Questionar e explorar o desconhecido',                                                    crescimento_id, 2, 5),
  ('Prudência',         'Agir com discernimento e sabedoria prática, ponderando consequências',                    crescimento_id, 2, 6),
  -- Novos
  ('Sábio/a',           'Eu aplico experiência e conhecimento com bom senso',                                      crescimento_id, 2, 7),
  ('Aberto/a',          'Eu recebo novas ideias e experiências com curiosidade',                                   crescimento_id, 2, 8),
  ('Adaptável',         'Eu consigo mudar quando é preciso',                                                       crescimento_id, 2, 9),
  ('Flexível',          'Eu ajusto-me facilmente quando é preciso',                                                crescimento_id, 2, 10),
  ('Dedicado/a',        'Eu mantenho compromisso intenso e consistente',                                           crescimento_id, 2, 11),
  ('Maduro/a',          'Eu ajo com responsabilidade emocional e critério',                                        crescimento_id, 2, 12),
  ('Competente',        'Eu executo bem o que me proponho a fazer',                                                crescimento_id, 2, 13),
  ('Focado/a',          'Eu presto atenção no que estou a fazer',                                                  crescimento_id, 2, 14),
  ('Realista',          'Eu vejo as coisas como elas são e penso no que dá para fazer',                            crescimento_id, 2, 15),
  ('Racional',          'Eu penso antes de decidir',                                                               crescimento_id, 2, 16),
  ('Organizado/a',      'Eu mantenho processos e espaços em ordem',                                                crescimento_id, 2, 17),
  ('Preciso/a',         'Eu faço as coisas com cuidado para não errar',                                            crescimento_id, 2, 18),
  ('Prático/a',         'Eu prefiro soluções simples e viáveis',                                                   crescimento_id, 2, 19),
  ('Eficiente',         'Eu alcanço resultados usando bem os recursos',                                            crescimento_id, 2, 20),
  ('Eficaz',            'Eu faço o que realmente precisa ser feito para atingir o objetivo',                       crescimento_id, 2, 21),
  ('Perfeccionista',    'Eu busco padrões muito altos de qualidade',                                               crescimento_id, 2, 22);

-- ═══════════════════════════════════════════════════════════════════════
-- GALHO 4: Relacionamentos
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (relacionamentos_id, 'Relacionamentos', 'A qualidade dos vínculos com os outros', root_id, 1, 4, '#3b82f6');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  -- Pacheco-core
  ('Família',       'Amor e compromisso com os laços familiares',                                                  relacionamentos_id, 2, 1),
  ('Amizade',       'Cultivar vínculos de confiança e afeto',                                                      relacionamentos_id, 2, 2),
  ('Comunidade',    'Pertencer e contribuir com o coletivo, superando o isolamento',                               relacionamentos_id, 2, 3),
  ('Colaboração',   'Trabalhar junto em prol de um bem comum',                                                     relacionamentos_id, 2, 4),
  ('Pertencimento', 'Sentir-se parte de algo maior que si mesmo',                                                  relacionamentos_id, 2, 5),
  ('Lealdade',      'Manter fidelidade a princípios e pessoas mesmo sob pressão, nunca confundida com obediência', relacionamentos_id, 2, 6),
  -- Novos
  ('Sociável',      'Eu gosto de estar com pessoas e fazer amigos',                                                relacionamentos_id, 2, 7),
  ('Íntimo/a',      'Eu partilho meu mundo interno com quem confio',                                              relacionamentos_id, 2, 8),
  ('Monogâmico/a',  'Eu valorizo uma relação amorosa exclusiva',                                                   relacionamentos_id, 2, 9),
  ('Tradicional',   'Eu honro costumes e rituais do passado',                                                      relacionamentos_id, 2, 10),
  ('Próximo/a',     'Eu gosto de estar perto de quem amo',                                                         relacionamentos_id, 2, 11),
  ('Popular',       'Eu gosto de ser conhecido/a e apreciado/a por muitos',                                        relacionamentos_id, 2, 12),
  ('Aceito/a',      'Eu valorizo ser acolhido/a como sou',                                                         relacionamentos_id, 2, 13);

-- ═══════════════════════════════════════════════════════════════════════
-- GALHO 5: Propósito
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (proposito_id, 'Propósito', 'Viver com sentido e intenção', root_id, 1, 5, '#8b5cf6');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  -- Pacheco-core
  ('Contribuição',    'Fazer diferença na vida dos outros',                                                        proposito_id, 2, 1),
  ('Espiritualidade', 'Conectar-se com algo transcendente',                                                        proposito_id, 2, 2),
  ('Legado',          'Deixar algo valioso para o futuro',                                                         proposito_id, 2, 3),
  ('Vocação',         'Alinhar o que se faz com o que se é, não com o que se ganha',                               proposito_id, 2, 4),
  ('Significado',     'Encontrar sentido profundo na vida',                                                        proposito_id, 2, 5),
  ('Esperança',       'Sustentar a crença na transformação possível mesmo quando os resultados imediatos decepcionam', proposito_id, 2, 6),
  -- Novos
  ('Devoto/a',        'Eu busco, acredito e obedeço à vontade divina',                                             proposito_id, 2, 7),
  ('Crente',          'Eu acredito e confio em algo divino',                                                        proposito_id, 2, 8);

-- ═══════════════════════════════════════════════════════════════════════
-- GALHO 6: Equilíbrio
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (equilibrio_id, 'Equilíbrio', 'Harmonia entre as dimensões da vida', root_id, 1, 6, '#06b6d4');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  -- Pacheco-core
  ('Saúde',            'Cuidar do corpo, mente e espírito',                                                        equilibrio_id, 2, 1),
  ('Paz Interior',     'Cultivar serenidade e calma genuína',                                                      equilibrio_id, 2, 2),
  ('Bem-estar',        'Viver com qualidade genuína, distinguindo satisfação real de consumo hedonista',           equilibrio_id, 2, 3),
  ('Descanso',         'Reconhecer o valor do repouso e da pausa',                                                 equilibrio_id, 2, 4),
  ('Presença',         'Estar plenamente no momento presente',                                                     equilibrio_id, 2, 5),
  ('Desapego',         'Soltar o que não serve, sem renunciar ao amor; condição para não gerar dependência crónica no outro', equilibrio_id, 2, 6),
  -- Novos
  ('Hedónico/a',       'Eu permito-me sentir bem-estar sensorial e emocional',                                     equilibrio_id, 2, 7),
  ('Higiénico/a',      'Eu mantenho limpeza e bons hábitos de higiene',                                            equilibrio_id, 2, 8),
  ('Contente',         'Eu aprecio e fico satisfeito/a com o que tenho',                                           equilibrio_id, 2, 9),
  ('Moderado/a',       'Eu evito excessos e busco o meio-termo',                                                   equilibrio_id, 2, 10),
  ('Estável',          'Eu valorizo consistência e previsibilidade',                                               equilibrio_id, 2, 11),
  ('Harmonioso/a',     'Eu busco viver em acordo comigo e com os outros',                                          equilibrio_id, 2, 12),
  ('Confortável',      'Eu crio ambientes acolhedores e agradáveis',                                               equilibrio_id, 2, 13),
  ('Longevo/a',        'Eu cuido para viver muito e bem',                                                          equilibrio_id, 2, 14),
  ('Simples',          'Eu vivo com o essencial, evitando excessos',                                               equilibrio_id, 2, 15),
  ('Autocontrolado/a', 'Eu regulo emoções e impulsos para agir com sabedoria',                                     equilibrio_id, 2, 16),
  ('Paciente',         'Eu espero e suporto contratempos sem irritação',                                           equilibrio_id, 2, 17),
  ('Libertino/a',      'Eu valorizo uma vida sexual saudável',                                                     equilibrio_id, 2, 18),
  ('Autoaceitante',    'Eu acolho quem eu sou, com qualidades e limites',                                          equilibrio_id, 2, 19);

-- ═══════════════════════════════════════════════════════════════════════
-- GALHO 7: Coragem
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (coragem_id, 'Coragem', 'Agir apesar do medo e da incerteza', root_id, 1, 7, '#ef4444');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  -- Pacheco-core
  ('Determinação',     'Persistir diante dos obstáculos',                                                          coragem_id, 2, 1),
  ('Vulnerabilidade',  'Abrir-se autenticamente ao outro',                                                         coragem_id, 2, 2),
  ('Ousadia',          'Arriscar em prol do crescimento',                                                          coragem_id, 2, 3),
  ('Compromisso',      'Assumir coletivamente um rumo ético e sustentá-lo até às últimas consequências',           coragem_id, 2, 4),
  ('Iniciativa',       'Agir sem esperar permissão',                                                               coragem_id, 2, 5),
  ('Indignação',       'Recusar a resignação diante da injustiça e converter o inconformismo em ação transformadora', coragem_id, 2, 6),
  -- Novos
  ('Corajoso/a',       'Eu enfrento medos e adversidades com firmeza',                                             coragem_id, 2, 7),
  ('Aventureiro/a',    'Eu procuro experiências novas e emocionantes',                                             coragem_id, 2, 8),
  ('Desafiador/a',     'Eu busco e encaro tarefas difíceis para crescer',                                          coragem_id, 2, 9),
  ('Ambicioso/a',      'Eu quero ir longe e alcançar grandes feitos',                                              coragem_id, 2, 10),
  ('Entusiasmado/a',   'Eu vivo com energia e alegria pelo que faço',                                              coragem_id, 2, 11),
  ('Apaixonado/a',     'Eu vivo com intensidade e amor pelo que valorizo',                                         coragem_id, 2, 12),
  ('Motivado/a',       'Eu tenho impulso interno para agir e realizar',                                            coragem_id, 2, 13),
  ('Poderoso/a',       'Eu exerço influência para fazer acontecer o que acredito',                                 coragem_id, 2, 14),
  ('Dinâmico/a',       'Eu gosto de estar em movimento e agir',                                                    coragem_id, 2, 15),
  ('Autoestima',       'Eu valorizo quem sou e reconheço o meu valor',                                             coragem_id, 2, 16),
  ('Autoconfiante',    'Eu confio na minha capacidade de agir e aprender',                                         coragem_id, 2, 17),
  ('Assertivo/a',      'Eu digo o que penso com clareza e respeito',                                               coragem_id, 2, 18);

-- ═══════════════════════════════════════════════════════════════════════
-- GALHO 8: Justiça
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (justica_id, 'Justiça', 'Tratar a todos com equidade e dignidade', root_id, 1, 8, '#f97316');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  -- Pacheco-core
  ('Equidade',      'Dar a cada um o que é seu',                                                                   justica_id, 2, 1),
  ('Diversidade',   'Valorizar as diferenças como riqueza',                                                        justica_id, 2, 2),
  ('Inclusão',      'Garantir que todos tenham espaço',                                                            justica_id, 2, 3),
  ('Solidariedade', 'Lutar estruturalmente junto aos mais vulneráveis, substituindo a competição pela cooperação', justica_id, 2, 4),
  ('Dignidade',     'Reconhecer o valor inerente de todo ser',                                                     justica_id, 2, 5),
  ('Não Violência', 'Construir a paz de forma ativa e exigente, recusando a violência como resposta ao conflito', justica_id, 2, 6),
  -- Novos
  ('Sustentável',   'Eu cuido do ambiente e dos recursos para o futuro',                                           justica_id, 2, 7),
  ('Democrático/a', 'Eu escuto as pessoas e ajo com igualdade e justiça',                                          justica_id, 2, 8);

-- ═══════════════════════════════════════════════════════════════════════
-- GALHO 9: Criatividade
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (criatividade_id, 'Criatividade', 'Expressar-se e criar com liberdade', root_id, 1, 9, '#d946ef');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  -- Pacheco-core
  ('Expressão',     'Manifestar a própria essência livremente',                                                    criatividade_id, 2, 1),
  ('Beleza',        'Cultivar o sentido estético como caminho para o amor, a liberdade e a sabedoria',             criatividade_id, 2, 2),
  ('Imaginação',    'Sonhar e conceber novas possibilidades',                                                      criatividade_id, 2, 3),
  ('Arte',          'Usar a arte como forma de comunicação e de ser',                                              criatividade_id, 2, 4),
  ('Jogo',          'Explorar com leveza e brincadeira',                                                           criatividade_id, 2, 5),
  ('Sensibilidade', 'Cultivar a capacidade de ser tocado pelo belo, pelo outro e pelo mundo',                      criatividade_id, 2, 6),
  -- Novos
  ('Intuitivo/a',   'Eu confio nos meus sentimentos quando faço escolhas',                                         criatividade_id, 2, 7),
  ('Criativo/a',    'Eu tenho ideias diferentes e gosto de criar',                                                  criatividade_id, 2, 8);

-- ═══════════════════════════════════════════════════════════════════════
-- GALHO 10: Felicidade
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO values (id, name, description, parent_id, level, sort_order, color_hex) VALUES
  (felicidade_id, 'Felicidade',
   'Viver com gratidão, alegria genuína e sentido — não como direito adquirido, mas como fruto do bom uso do que se tem',
   root_id, 1, 10, '#84cc16');
INSERT INTO values (name, description, parent_id, level, sort_order) VALUES
  -- Pacheco-core
  ('Gratidão',          'Reconhecer as bênçãos do dia a dia',                                                      felicidade_id, 2, 1),
  ('Florescimento',     'Criar condições para o desenvolvimento humano pleno, além da acumulação material',        felicidade_id, 2, 2),
  ('Alegria',           'A alegria genuína que nasce de fazer o que tem sentido, de contribuir e de pertencer',     felicidade_id, 2, 3),
  ('Otimismo',          'Ver possibilidades além dos desafios, sem negar a dificuldade — complemento da esperança', felicidade_id, 2, 4),
  ('Liberdade',         'Viver autenticamente, como sujeito — expressão concreta da autonomia na vida quotidiana', felicidade_id, 2, 5),
  ('Qualidade de Vida', 'Escolher conscientemente como se vive e consome, priorizando o essencial sobre o supérfluo', felicidade_id, 2, 6),
  -- Novos
  ('Bem-sucedido/a',    'Eu alcanço metas que têm significado para mim',                                           felicidade_id, 2, 7);

END $$;