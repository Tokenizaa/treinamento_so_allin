import { ModuleData } from '../types';

export const modulesData: ModuleData[] = [
  {
    id: 1,
    title: "Conhecendo a Fábrica",
    objective: "Apresentar a estrutura física de uma indústria de colchões e entender como o fluxo de valor é distribuído no espaço físico.",
    concepts: [
      {
        title: "Estrutura Física Industrial",
        description: "Uma fábrica não é apenas um prédio. É uma estrutura lógica organizada em Unidades, Galpões, Almoxarifados e Docas para garantir que as matérias-primas entrem, se transformem e saiam de forma eficiente."
      },
      {
        title: "Fluxo de Entrada e Saída",
        description: "Todo fluxo físico se inicia no Recebimento (Docas de entrada), passa pelo Almoxarifado para armazenamento, segue para as Linhas de Produção e termina na Expedição (Docas de saída)."
      }
    ],
    illustratedExplanation: "As Docas de Recebimento ficam separadas da Expedição para evitar contaminação cruzada de materiais. Os galpões de Espumação, Corte e Montagem são interligados para minimizar a movimentação.",
    flowchartSteps: [
      { label: "Doca de Recebimento", description: "Entrada de rolos de tecido e produtos químicos.", arrow: true },
      { label: "Almoxarifado de MP", description: "Estocagem de tecidos, cola, fitilhos e molas.", arrow: true },
      { label: "Galpão Produtivo", description: "Área de transformação: corte, costura e colagem.", arrow: true },
      { label: "Expedição", description: "Estocagem de produtos acabados prontos para despacho." }
    ],
    practicalExample: "Na fábrica 'Colchões Bonsucesso', o recebimento de blocos de espuma maciça é feito na Doca Norte. Eles são rotulados e encaminhados para o galpão de cura antes de irem para a linha de corte.",
    systemApplication: "No Allin-SO, você cadastra a Empresa, vincula as Unidades Físicas (Fábrica Principal, Filial), e desenha a estrutura de Galpões e Almoxarifados para que o estoque saiba exatamente onde cada lote está fisicamente guardado.",
    commonErrors: [
      "Confundir 'Galpão Físico' com 'Setor'. Um galpão pode abrigar vários setores.",
      "Cadastrar almoxarifados sem definir suas docas de vínculo, gerando gargalo no recebimento físico."
    ],
    summary: [
      "A estrutura física define os limites e caminhos da produção.",
      "O recebimento e a expedição devem ser otimizados para evitar movimentação desnecessária.",
      "No sistema, a estrutura física é a base de todo o endereçamento de estoque."
    ],
    quiz: {
      questions: [
        {
          id: "q1_1",
          text: "Qual a função primária das Docas em uma indústria?",
          options: [
            "Apenas guardar maquinários que não estão sendo utilizados.",
            "Pontos de interface para carga e descarga de matérias-primas e produtos acabados.",
            "Locais onde os operadores costuram as laterais dos colchões.",
            "Áreas destinadas aos escritórios de vendas."
          ],
          correctAnswerIndex: 1,
          explanation: "As docas são as portas de entrada e saída de materiais na fábrica, conectando o transporte rodoviário aos estoques internos."
        },
        {
          id: "q1_2",
          text: "Por que as docas de recebimento e expedição costumam ser separadas?",
          options: [
            "Para evitar colisões e confusão de fluxos (contaminação cruzada de materiais).",
            "Porque os caminhões de saída são muito maiores que os de entrada.",
            "Por exigência estética do prédio.",
            "Para reduzir a quantidade de funcionários trabalhando juntos."
          ],
          correctAnswerIndex: 0,
          explanation: "Manter fluxos de entrada e saída separados evita cruzamento de mercadorias, reduz erros de carregamento e otimiza a logística interna."
        }
      ]
    },
    exercise: {
      type: 'drag_drop_layout',
      title: "Desafio de Estrutura Física",
      instruction: "Posicione as áreas industriais no fluxo lógico correto para garantir que a matéria-prima flua sem retrocessos.",
      data: {
        zones: [
          { id: "recebimento", label: "Doca de Recebimento", correctIndex: 0 },
          { id: "almoxarifado", label: "Almoxarifado de Matéria-Prima", correctIndex: 1 },
          { id: "producao", label: "Galpão de Produção", correctIndex: 2 },
          { id: "expedicao", label: "Estoque e Doca de Expedição", correctIndex: 3 }
        ]
      },
      successCondition: (answer: string[]) => {
        const correct = ["recebimento", "almoxarifado", "producao", "expedicao"];
        const isCorrect = answer.every((val, index) => val === correct[index]);
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Excelente! Você estruturou o fluxo linear perfeito, minimizando perdas de transporte interno!" 
            : "Algumas áreas estão fora de ordem. Lembre-se: recebemos as mercadorias, estocamos no almoxarifado, transformamos na produção e despachamos na expedição."
        };
      }
    }
  },
  {
    id: 2,
    title: "Layout Industrial",
    objective: "Compreender que o arranjo físico das máquinas e setores dita o ritmo produtivo e impacta diretamente nos custos de movimentação.",
    concepts: [
      {
        title: "O que é Layout?",
        description: "Arranjo físico de homens, máquinas, materiais e serviços. Um bom layout minimiza percursos, evita gargalos e reduz acidentes de trabalho."
      },
      {
        title: "Tipos de Layout",
        description: "Pode ser Linear (fluxo contínuo como montagem em série), Funcional/Processo (máquinas agrupadas por função, como setor de costura), ou Celular (combinação para flexibilidade)."
      }
    ],
    illustratedExplanation: "Na fabricação de colchões, o layout ideal é linear-funcional: a espuma flui da cura para as serras, o tecido para as costuras, e ambos se encontram na mesa de colagem, avançando para o fechamento e embalagem.",
    flowchartSteps: [
      { label: "Corte (Serras)", description: "Corte das espumas nos tamanhos do colchão.", arrow: true },
      { label: "Costura / Quilting", description: "Bordado do tampo e costura das faixas laterais.", arrow: true },
      { label: "Montagem / Colagem", description: "União das camadas de espuma e molejo.", arrow: true },
      { label: "Fechamento (Tape Edge)", description: "Costura do fitilho unindo tampo e lateral.", arrow: true },
      { label: "Embalagem (Prensa/Roll Pack)", description: "Compactação e proteção plástica do produto." }
    ],
    practicalExample: "Uma fábrica mal desenhada tinha o setor de costura a 150 metros do setor de montagem. Os operadores perdiam 2 horas por dia empurrando carrinhos de tampos. Ao aproximar os setores, a produtividade diária subiu 12%.",
    systemApplication: "No Allin-SO, mapeamos o fluxo de layout definindo as rotas de transferência de materiais e associando os locais de estoque intermediário (WIP) a cada etapa produtiva.",
    commonErrors: [
      "Ignorar distâncias de transporte de materiais pesados (ex: blocos de molas).",
      "Posicionar o setor de colagem (que gera névoa de adesivo) colado ao setor de inspeção visual, sujando tampos prontos."
    ],
    summary: [
      "Layout é a rota física do valor agregado.",
      "Menos movimentação é sinônimo de maior produtividade.",
      "O layout de colchões deve convergir as partes (espuma, lateral, tampo) para o posto de colagem central."
    ],
    quiz: {
      questions: [
        {
          id: "q2_1",
          text: "Qual dos seguintes problemas de fábrica é diretamente causado por um layout ineficiente?",
          options: [
            "Aumento excessivo do tempo de transporte interno de materiais (WIP).",
            "Quebra constante de agulhas na máquina de costura.",
            "Falta de energia elétrica na cidade.",
            "Erro de faturamento na nota fiscal do cliente."
          ],
          correctAnswerIndex: 0,
          explanation: "O tempo gasto transportando materiais entre setores distantes é um desperdício clássico gerado por um layout inadequado."
        },
        {
          id: "q2_2",
          text: "Qual a sequência lógica correta de montagem física de um colchão de espuma?",
          options: [
            "Embalar -> Cortar -> Costurar -> Colar.",
            "Cortar espuma -> Costurar tampo -> Colar camadas -> Fechar/Costurar bordas -> Embalar.",
            "Fechar bordas -> Colar camadas -> Cortar espuma -> Embalar.",
            "Costurar tampo -> Embalar -> Cortar espuma -> Colar camadas."
          ],
          correctAnswerIndex: 1,
          explanation: "A sequência lógica inicia no corte das matérias-primas e preparação dos tampos, passa pela colagem estrutural, fechamento final e termina na embalagem protetora."
        }
      ]
    },
    exercise: {
      type: 'process_sequencing',
      title: "Desafio de Otimização de Layout",
      instruction: "Ordene as etapas produtivas do colchão na ordem sequencial correta para eliminar perdas de transporte.",
      data: {
        steps: ["Corte", "Costura", "Montagem", "Fechamento", "Embalagem"]
      },
      successCondition: (answer: string[]) => {
        const correct = ["Corte", "Costura", "Montagem", "Fechamento", "Embalagem"];
        const isCorrect = answer.every((val, index) => val === correct[index]);
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Sequenciamento perfeito! O material flui de forma otimizada sem retornos desnecessários!" 
            : "A ordem está incorreta. Lembre-se: corte a espuma, prepare a costura, cole/monte, feche as bordas (Tape Edge) e embale no final."
        };
      }
    }
  },
  {
    id: 3,
    title: "Setores",
    objective: "Diferenciar os setores organizacionais, entendendo como eles interagem e trocam informações na rotina industrial.",
    concepts: [
      {
        title: "O que é um Setor?",
        description: "É uma divisão administrativa da fábrica com responsabilidades específicas. Setores não produzem peças físicas diretamente, mas organizam as atividades."
      },
      {
        title: "Setores Típicos",
        description: "PCP (planeja e programa), Compras (adquire insumos), Qualidade (inspecciona), Almoxarifado (armazena), Manutenção (conserta) e Produção (executa)."
      }
    ],
    illustratedExplanation: "O PCP envia a programação de produção. O Almoxarifado separa as molas e tecidos. A Produção monta o colchão. A Qualidade inspeciona as costuras. Se uma máquina quebrar, a Manutenção é acionada.",
    flowchartSteps: [
      { label: "PCP", description: "Emite as ordens e prazos.", arrow: true },
      { label: "Almoxarifado", description: "Fornece matérias-primas.", arrow: true },
      { label: "Produção", description: "Transforma os materiais.", arrow: true },
      { label: "Qualidade", description: "Aprova ou reprova o produto acabado." }
    ],
    practicalExample: "Se o setor de Compras não avisa o PCP que a cola adesiva vai atrasar, o PCP agenda a colagem e a produção para na quarta-feira por falta de insumo. A falta de comunicação entre setores gera paradas caras.",
    systemApplication: "No Allin-SO, cada usuário é vinculado a um setor. Isso define quais telas eles visualizam (ex: o operador vê a tela de apontamentos da Produção; o analista vê a tela de programação do PCP).",
    commonErrors: [
      "Operador apontar parada de máquina na tela de produção mas não abrir o chamado para o setor de Manutenção no sistema.",
      "Qualidade reprovar um lote de tecido e não notificar o Almoxarifado para bloquear o saldo."
    ],
    summary: [
      "Setores são barreiras organizacionais que precisam de comunicação contínua.",
      "A harmonia entre PCP, Produção e Qualidade garante o cumprimento de prazos.",
      "O sistema Allin-SO unifica os dados de todos esses setores em tempo real."
    ],
    quiz: {
      questions: [
        {
          id: "q3_1",
          text: "Qual setor é responsável por planejar o que será produzido e garantir que haja capacidade de máquina disponível?",
          options: [
            "Qualidade",
            "Manutenção",
            "PCP (Planejamento e Controle da Produção)",
            "Expedição"
          ],
          correctAnswerIndex: 2,
          explanation: "O PCP é o cérebro da fábrica, responsável por programar ordens de produção e sequenciar o trabalho nas máquinas."
        },
        {
          id: "q3_2",
          text: "Se uma máquina de bordar colchões quebra no meio do turno, qual setor deve ser acionado imediatamente?",
          options: [
            "Compras",
            "Manutenção",
            "Qualidade",
            "Recursos Humanos"
          ],
          correctAnswerIndex: 1,
          explanation: "A Manutenção é o setor responsável por reparar ativos e garantir a disponibilidade física das máquinas."
        }
      ]
    },
    exercise: {
      type: 'setores_matching',
      title: "Desafio de Integração de Setores",
      instruction: "Associe cada tarefa diária ao setor correto responsável pela sua execução.",
      data: {
        pairs: [
          { task: "Comprar 200kg de cola quente para colchões", sector: "Compras" },
          { task: "Liberar ordens de produção para a próxima semana", sector: "PCP" },
          { task: "Auditar o diâmetro do arame das molas recebidas", sector: "Qualidade" },
          { task: "Trocar as correias gastas da serra de espuma", sector: "Manutenção" }
        ]
      },
      successCondition: (answer: Record<string, string>) => {
        const correct: Record<string, string> = {
          "Comprar 200kg de cola quente para colchões": "Compras",
          "Liberar ordens de produção para a próxima semana": "PCP",
          "Auditar o diâmetro do arame das molas recebidas": "Qualidade",
          "Trocar as correias gastas da serra de espuma": "Manutenção"
        };
        const isCorrect = Object.keys(correct).every(key => answer[key] === correct[key]);
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Excelente! Você conhece perfeitamente as responsabilidades e papéis de cada setor!" 
            : "Algumas associações de tarefas estão incorretas. Reveja as atribuições do PCP, Qualidade, Compras e Manutenção."
        };
      }
    }
  },
  {
    id: 4,
    title: "Centros de Trabalho",
    objective: "Compreender que setores organizam, mas quem transforma os produtos são as capacidades chamadas Centros de Trabalho (CTs).",
    concepts: [
      {
        title: "O que é um Centro de Trabalho?",
        description: "Uma unidade de produção composta por uma ou mais máquinas, pessoas ou postos de trabalho que realizam uma operação específica e compartilham capacidade."
      },
      {
        title: "Capacidade e Gargalos",
        description: "A capacidade de um CT é medida em horas disponíveis ou peças por hora. O CT com a menor capacidade na linha dita o ritmo de toda a fábrica (gargalo)."
      }
    ],
    illustratedExplanation: "O 'Setor Costura' possui 3 Centros de Trabalho: CT-Quilting (máquina automática de bordar), CT-Costura-Laterais (2 máquinas overlock) e CT-Fechamento (1 máquina Tape Edge manual).",
    flowchartSteps: [
      { label: "CT Quilting", description: "Capacidade: 20 tampos/hora.", arrow: true },
      { label: "CT Costura Lateral", description: "Capacidade: 15 faixas/hora.", arrow: true },
      { label: "CT Tape Edge (Fechamento)", description: "Capacidade: 8 colchões/hora (GARGALO!)." }
    ],
    practicalExample: "Se o CT de colagem consegue fazer 30 colchões por hora, mas o CT de fechamento (Tape Edge) consegue fechar apenas 10 por hora, a colagem terá que parar ou acumulará uma pilha gigante de colchões semiacabados.",
    systemApplication: "No Allin-SO, você cria os Centros de Trabalho e define sua capacidade diária. Isso permite ao PCP calcular automaticamente se a fábrica conseguirá entregar um pedido a tempo (Carga Máquina).",
    commonErrors: [
      "Cadastrar o setor inteiro como um único Centro de Trabalho, impedindo a identificação de qual máquina específica é o gargalo.",
      "Ignorar o tempo de setup (preparação) ao planejar a capacidade de um CT."
    ],
    summary: [
      "Setores não produzem; Centros de Trabalho realizam as tarefas.",
      "Todo Centro de Trabalho possui capacidade finita.",
      "Identificar e proteger o gargalo da fábrica é a regra nº 1 da Engenharia de Produção."
    ],
    quiz: {
      questions: [
        {
          id: "q4_1",
          text: "Se um setor de costura tem 3 máquinas idênticas trabalhando em paralelo que podem ser operadas por qualquer costureira, como devemos cadastrá-las no Allin-SO para otimizar o sequenciamento?",
          options: [
            "Como 3 setores diferentes.",
            "Como um único Centro de Trabalho com capacidade multiplicada por 3 (grupo de máquinas).",
            "Não cadastrar, pois costura é processo manual.",
            "Como almoxarifados virtuais."
          ],
          correctAnswerIndex: 1,
          explanation: "Máquinas idênticas e intercambiáveis formam um grupo homogêneo e podem ser cadastradas como um único Centro de Trabalho com capacidade consolidada."
        },
        {
          id: "q4_2",
          text: "O que acontece se ignorarmos a capacidade finita de um Centro de Trabalho ao liberar ordens de produção?",
          options: [
            "A fábrica produzirá mais rápido espontaneamente.",
            "Ocorrerá acúmulo de pilhas de material em processo (WIP), atrasando entregas e bagunçando o layout.",
            "As máquinas sofrerão menos desgaste.",
            "O custo de matéria-prima diminuirá."
          ],
          correctAnswerIndex: 1,
          explanation: "Liberar mais trabalho do que a capacidade do CT suporta cria filas gigantescas (WIP), atrasos nas entregas e caos no chão de fábrica."
        }
      ]
    },
    exercise: {
      type: 'ct_capacity_balance',
      title: "Desafio de Balanceamento de Carga de Trabalho",
      instruction: "Distribua uma demanda de 30 colchões entre dois Centros de Trabalho de colagem de forma a equilibrar a ocupação física sem estourar a capacidade limite de 20 colchões por CT.",
      data: {
        totalDemand: 30,
        ct1_capacity: 20,
        ct2_capacity: 20
      },
      successCondition: (answer: { ct1: number; ct2: number }) => {
        const { ct1, ct2 } = answer;
        const total = ct1 + ct2;
        const correct = total === 30 && ct1 <= 20 && ct2 <= 20 && Math.abs(ct1 - ct2) <= 5;
        return {
          success: correct,
          feedback: correct 
            ? "Parabéns! Carga balanceada com maestria, mantendo ambos os postos ocupados sem sobrecarga!" 
            : `Sua distribuição (CT1: ${ct1}, CT2: ${ct2}) falhou. Garanta que a soma seja 30, nenhum exceda 20 e a diferença entre eles seja pequena para equilibrar a fábrica.`
        };
      }
    }
  },
  {
    id: 5,
    title: "Máquinas",
    objective: "Conhecer as máquinas específicas que compõem o processo de fabricação de colchões e gerenciar seus tempos de operação.",
    concepts: [
      {
        title: "Ativos Produtivos (Máquinas)",
        description: "São os equipamentos físicos estacionários que realizam transformações mecânicas, térmicas ou químicas nos materiais."
      },
      {
        title: "Máquinas de Colchões",
        description: "Serra Vertical (corta blocos de espuma), Pantógrafo/Quilting (borda tampos), Tape Edge (fecha bordas) e Prensa Roll-Pack (compacta o colchão para envio)."
      }
    ],
    illustratedExplanation: "A máquina de 'Tape Edge' possui um cabeçote de costura montado sobre um trilho que gira em torno da mesa de montagem. O operador acompanha a máquina a pé, guiando o fitilho nas bordas.",
    flowchartSteps: [
      { label: "Serra Vertical CNC", description: "Corta bloco mãe de espuma em placas.", arrow: true },
      { label: "Quilting Automática", description: "Borda padrões no tecido do tampo continuamente.", arrow: true },
      { label: "Tape Edge", description: "Costura de fechamento final do colchão.", arrow: true },
      { label: "Prensa de Roll-Pack", description: "Prensa, enrola e sela o colchão em filme plástico." }
    ],
    practicalExample: "A prensa de Roll-Pack permite reduzir o volume de um colchão de molas em até 80%, viabilizando o transporte de 5x mais colchões no mesmo caminhão. Se esta máquina quebra, a logística trava.",
    systemApplication: "No Allin-SO, cada máquina possui uma ficha de cadastro contendo: Código do Ativo, Taxa de Produção Estimada (ex: peças/hora) e plano de manutenção preventiva vinculado.",
    commonErrors: [
      "Cadastrar a velocidade máxima teórica do fabricante da máquina como meta real, sem descontar fadiga do operador e pequenas paradas.",
      "Esquecer de vincular a máquina a um Centro de Trabalho, deixando-a invisível para o planejamento do PCP."
    ],
    summary: [
      "As máquinas são o coração da produtividade mecânica.",
      "Cada tipo de máquina possui capacidades e limites operacionais claros.",
      "No sistema, as taxas de produção de cada máquina determinam o tempo das Ordens de Produção."
    ],
    quiz: {
      questions: [
        {
          id: "q5_1",
          text: "Qual das seguintes máquinas é responsável por cortar os grandes blocos de espuma maciça em lâminas finas para o tampo do colchão?",
          options: [
            "Prensa de Roll-Pack",
            "Serra de fita (Horizontal ou Vertical)",
            "Fechadora de Colchão (Tape Edge)",
            "Grampeador de molas"
          ],
          correctAnswerIndex: 1,
          explanation: "As serras de fita de espuma cortam blocos maciços com extrema precisão usando uma lâmina contínua de aço."
        },
        {
          id: "q5_2",
          text: "O que a máquina de Roll-Pack realiza em um colchão pronto?",
          options: [
            "Borda o logotipo da empresa no tecido do tampo.",
            "Corta as molas de aço no tamanho certo.",
            "Compacta, enrola e sela o colchão a vácuo para reduzir volume de frete.",
            "Mistura os produtos químicos para expandir a espuma."
          ],
          correctAnswerIndex: 2,
          explanation: "A prensa e enroladora (Roll-Pack) reduz drasticamente o volume do colchão pronto, permitindo que ele seja despachado em caixas compactas."
        }
      ]
    },
    exercise: {
      type: 'machine_selection',
      title: "Seleção de Ativos Industriais",
      instruction: "Associe cada operação industrial da fábrica de colchões à máquina física correta projetada para realizá-la.",
      data: {
        associations: [
          { operation: "Bordar o tampo de tecido com espuma de acabamento", correctMachine: "Pantógrafo de Quilting" },
          { operation: "Cortar bloco de espuma D33 em placas de 5cm", correctMachine: "Serra Horizontal" },
          { operation: "Unir lateral e tampos em uma costura circular contínua", correctMachine: "Fechadora de Colchão (Tape Edge)" },
          { operation: "Selas colchão pronto em plástico protetor sob vácuo", correctMachine: "Prensa Roll-Pack" }
        ]
      },
      successCondition: (answer: Record<string, string>) => {
        const correct: Record<string, string> = {
          "Bordar o tampo de tecido com espuma de acabamento": "Pantógrafo de Quilting",
          "Cortar bloco de espuma D33 em placas de 5cm": "Serra Horizontal",
          "Unir lateral e tampos em uma costura circular contínua": "Fechadora de Colchão (Tape Edge)",
          "Selas colchão pronto em plástico protetor sob vácuo": "Prensa Roll-Pack"
        };
        const isCorrect = Object.keys(correct).every(key => answer[key] === correct[key]);
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Incrível! Você tem total domínio sobre o parque de máquinas de uma colchoaria!" 
            : "Alguma operação foi associada à máquina errada. Lembre-se: serras cortam, pantógrafo borda, tape edge fecha e roll-pack prensa."
        };
      }
    }
  },
  {
    id: 6,
    title: "Equipamentos",
    objective: "Identificar os equipamentos de suporte periférico que auxiliam o funcionamento das máquinas e do fluxo de informações da fábrica.",
    concepts: [
      {
        title: "Diferença entre Máquina e Equipamento",
        description: "Máquinas realizam a transformação direta do produto. Equipamentos dão suporte (energia, ar comprimido, coleta de dados, pesagem) para que as máquinas funcionem."
      },
      {
        title: "Equipamentos Críticos",
        description: "Compressores (geram ar comprimido para grampeadores e prensas), Coletores de Dados (coletam apontamentos), Balanças (pesam produtos químicos para a espuma)."
      }
    ],
    illustratedExplanation: "Na colagem pneumática, o operador usa uma pistola de adesivo. Se o Compressor de Ar sofrer uma queda de pressão, a pistola começa a falhar e as camadas de espuma descolarão no cliente final.",
    flowchartSteps: [
      { label: "Compressor Central", description: "Gera energia pneumática para a linha.", arrow: true },
      { label: "Filtro e Secador", description: "Retira água do ar para não enferrujar ferramentas.", arrow: true },
      { label: "Rede de Ar Comprimido", description: "Alimenta postos de colagem e montagem.", arrow: true },
      { label: "Pistolas e Cilindros", description: "Consumidores finais do ar nos postos de trabalho." }
    ],
    practicalExample: "Um secador de ar quebrado no compressor permitiu a passagem de água na tubulação pneumática. Isso danificou 4 grampeadores de madeira em um único dia, parando o setor de bases de madeira.",
    systemApplication: "No Allin-SO, cadastramos os Equipamentos Utilitários (como compressores) para controlar seus planos de troca de óleo e filtros, evitando paradas gerais imprevistas na fábrica.",
    commonErrors: [
      "Ignorar a manutenção do compressor. Se ele parar, 80% das ferramentas e prensas da fábrica também param.",
      "Não calibrar as balanças de pesagem de blocos de espuma, gerando densidades incorretas fora do padrão INMETRO."
    ],
    summary: [
      "Sem ar comprimido e energia estabilizada, as máquinas não rodam.",
      "Coletores e impressoras térmicas são os olhos e a rastreabilidade do sistema.",
      "Manutenção de equipamentos de suporte é tão crítica quanto a das máquinas de linha."
    ],
    quiz: {
      questions: [
        {
          id: "q6_1",
          text: "Qual equipamento é considerado a 'artéria invisível' de uma fábrica de colchões, fornecendo força pneumática para grampeadores, pistolas de cola e prensas?",
          options: [
            "Balança de precisão",
            "Gerador elétrico portátil",
            "Compressor de ar comprimido",
            "Coletor de dados de código de barras"
          ],
          correctAnswerIndex: 2,
          explanation: "O compressor gera o ar comprimido necessário para operar quase todos os dispositivos pneumáticos da linha de montagem e colagem."
        },
        {
          id: "q6_2",
          text: "Para que serve um coletor de dados portátil no chão de fábrica?",
          options: [
            "Para esfriar os blocos de espuma quentes.",
            "Para pesar as matérias-primas na entrada.",
            "Para fazer a leitura de códigos de barras nas etiquetas, registrando as etapas de produção em tempo real no sistema.",
            "Para costurar as alças laterais do colchão."
          ],
          correctAnswerIndex: 2,
          explanation: "Coletores de dados realizam leituras rápidas de etiquetas de lote ou produtos para atualizar o sistema de produção instantaneamente."
        }
      ]
    },
    exercise: {
      type: 'tool_matching',
      title: "Desafio de Equipamentos de Apoio",
      instruction: "Associe o equipamento de suporte ao problema que ele resolve na operação diária da fábrica.",
      data: {
        pairs: [
          { tool: "Compressor de Ar", function: "Garantir pressão para ferramentas pneumáticas" },
          { tool: "Balança Industrial", function: "Verificar se a densidade da espuma está correta via peso" },
          { tool: "Leitor de Código de Barras", function: "Apontar a conclusão do colchão sem precisar digitar" },
          { tool: "Exaustor de Cabine", function: "Remover névoa tóxica de cola do ambiente de trabalho" }
        ]
      },
      successCondition: (answer: Record<string, string>) => {
        const correct: Record<string, string> = {
          "Compressor de Ar": "Garantir pressão para ferramentas pneumáticas",
          "Balança Industrial": "Verificar se a densidade da espuma está correta via peso",
          "Leitor de Código de Barras": "Apontar a conclusão do colchão sem precisar digitar",
          "Exaustor de Cabine": "Remover névoa tóxica de cola do ambiente de trabalho"
        };
        const isCorrect = Object.keys(correct).every(key => answer[key] === correct[key]);
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Perfeito! Você entende que o suporte periférico é o que sustenta a velocidade da fábrica!" 
            : "Associação incorreta de equipamentos. Observe as conexões com pressão pneumática, peso, leitura de dados e exaustão."
        };
      }
    }
  },
  {
    id: 7,
    title: "Ferramentas",
    objective: "Compreender o papel das ferramentas manuais e dispositivos que os operadores utilizam diretamente para realizar o trabalho manual.",
    concepts: [
      {
        title: "O que são Ferramentas de Posto?",
        description: "São dispositivos manuais, elétricos ou pneumáticos de pequeno porte que acompanham o operador e são considerados itens de consumo rápido."
      },
      {
        title: "Ferramentas Típicas na Colchoaria",
        description: "Grampeador pneumático (monta caixas de madeira de sommier), estilete ergonômico (refila sobras de tecido), tesoura de alta precisão, trena calibrada e esquadro de montagem."
      }
    ],
    illustratedExplanation: "Na montagem da base do colchão (Sommier), o operador usa um gabarito físico (esquadro gigante) e um grampeador pneumático de alta velocidade para pregar as ripas de eucalipto em menos de 45 segundos.",
    flowchartSteps: [
      { label: "Ripas de Madeira", description: "Posicionadas no gabarito de montagem.", arrow: true },
      { label: "Grampeador Pneumático", description: "Fixa as ripas estruturais rapidamente.", arrow: true },
      { label: "Esquadro e Trena", description: "Garantem que a base não fique torta.", arrow: true },
      { label: "Estilete Refilador", description: "Elimina sobras de tecido no acabamento final." }
    ],
    practicalExample: "Se a fábrica não fornece estiletes ergonômicos adequados, os operadores de corte de espuma sofrem fadiga precoce e começam a cortar peças fora da medida. Ferramentas baratas e ruins destroem a produtividade.",
    systemApplication: "No Allin-SO, ferramentas são registradas para controle de entregas (EPI/EPC e ferramentas de uso individual) e para cálculo de vida útil de ferramentas compartilhadas (como moldes ou matrizes).",
    commonErrors: [
      "Não calibrar periodicamente as trenas dos inspetores de qualidade, gerando colchões com tamanhos diferentes que não cabem no box.",
      "Usar grampos do tamanho errado no grampeador pneumático, gerando estruturas soltas que rangem com o tempo."
    ],
    summary: [
      "Ferramentas estendem o braço do operador e determinam a qualidade do trabalho manual.",
      "Sua calibração (como de trenas) garante a consistência do produto.",
      "No sistema, controlar o estoque e a entrega de ferramentas evita paradas por falta de chaves ou grampeadores funcionais."
    ],
    quiz: {
      questions: [
        {
          id: "q7_1",
          text: "Qual destas ferramentas pneumáticas é essencial para pregar tecidos e ripas de madeira na fabricação de bases box (sommier)?",
          options: [
            "Pistola de pintura",
            "Grampeador pneumático",
            "Chave de fenda manual",
            "Maçarico a gás"
          ],
          correctAnswerIndex: 1,
          explanation: "O grampeador pneumático dispara grampos de aço sob alta pressão, fixando o tecido e a madeira da estrutura box em segundos."
        },
        {
          id: "q7_2",
          text: "Por que a calibração de trenas e esquadros é de extrema relevância no setor de inspeção e corte?",
          options: [
            "Para garantir que todos os colchões saiam exatamente nas medidas comerciais padrão (ex: Casal 138x188cm) sem variações que gerem devoluções.",
            "Para fazer as ferramentas durarem mais.",
            "Porque o aço da trena derrete fácil com o calor.",
            "Para reduzir o peso físico da ferramenta."
          ],
          correctAnswerIndex: 0,
          explanation: "Instrumentos descalibrados causam erros de medida invisíveis ao operador que resultam em produtos fora do padrão exigido pelo cliente e órgãos reguladores."
        }
      ]
    },
    exercise: {
      type: 'tool_matching',
      title: "Desafio de Seleção de Ferramental",
      instruction: "Selecione as ferramentas e EPIs corretos que um operador da área de Montagem de Sommier precisa para trabalhar com segurança e produtividade.",
      data: {
        choices: [
          { id: "tool1", label: "Grampeador Pneumático", correct: true },
          { id: "tool2", label: "Óculos de Proteção e Protetor Auricular", correct: true },
          { id: "tool3", label: "Ferro de Passar Roupas", correct: false },
          { id: "tool4", label: "Esquadro e Trena Calibrados", correct: true }
        ]
      },
      successCondition: (answer: string[]) => {
        const isCorrect = answer.includes("tool1") && answer.includes("tool2") && answer.includes("tool4") && !answer.includes("tool3");
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Perfeito! Você equipou o operador com as ferramentas produtivas e os EPIs de segurança ideais para a montagem de bases!" 
            : "Algum item sobrou ou faltou. Pense no que é necessário para cortar, montar madeira, proteger o operador do ruído da prensa e garantir esquadro."
        };
      }
    }
  },
  {
    id: 8,
    title: "Pessoas",
    objective: "Compreender a estrutura de cargos do chão de fábrica, responsabilidades de cada nível e o impacto da capacitação humana nos resultados.",
    concepts: [
      {
        title: "Estrutura Organizacional Industrial",
        description: "Organiza a cadeia de liderança e execução. Operadores executam; Líderes apoiam e resolvem pequenos problemas de turno; Supervisores planejam o dia; Gerentes focam nas metas mensais e custos."
      },
      {
        title: "Papéis de Chão de Fábrica",
        description: "Operador de Máquina (focado no ciclo), Costureira (alta habilidade técnica), Auxiliar de Produção (transporte e abastecimento), Inspetor de Qualidade (auditores de processo)."
      }
    ],
    illustratedExplanation: "Se uma costureira nota que o tecido está desfiando na máquina de quilting, ela avisa o Líder de Turno, que verifica o rolo de tecido. Se for um defeito grave de lote, o Líder escala para o Supervisor de Produção travar o lote com o Almoxarifado.",
    flowchartSteps: [
      { label: "Operador", description: "Executa e detecta anomalias no posto.", arrow: true },
      { label: "Líder de Turno", description: "Soluciona gargalos operacionais imediatos.", arrow: true },
      { label: "Supervisor", description: "Gerencia metas diárias e recursos de pessoal.", arrow: true },
      { label: "Gerente Industrial", description: "Otimiza custos globais, OEE e eficiência da fábrica." }
    ],
    practicalExample: "Um operador bem treinado percebeu que a máquina de cola estava gotejando e desperdiçando material. Ele sugeriu uma pequena regulagem no bico, economizando R$ 4.000 por mês em cola adesiva.",
    systemApplication: "No Allin-SO, criamos os perfis de cada funcionário, definindo seu nível de acesso, valor do custo hora de mão de obra direta (MOD) para cálculo de custos, e competências de operação.",
    commonErrors: [
      "Lançar apontamentos de produção com a matrícula de outro funcionário, distorcendo as métricas de produtividade individual por operador.",
      "Alocar um operador não capacitado para operar máquinas perigosas (como a serra de fita vertical), violando normas regulamentadoras de segurança (NR-12)."
    ],
    summary: [
      "Máquinas dependem de pessoas qualificadas e engajadas.",
      "A estrutura de liderança deve ser ágil para responder a desvios e anomalias.",
      "No sistema, os apontamentos identificam o operador responsável, garantindo a rastreabilidade."
    ],
    quiz: {
      questions: [
        {
          id: "q8_1",
          text: "Quem é o principal responsável por registrar os apontamentos de produção e paradas de máquina na rotina diária?",
          options: [
            "O Gerente Geral da Empresa",
            "O Operador do posto de trabalho ou Líder de Linha",
            "O Auditor de faturamento financeiro",
            "O Motorista do caminhão de entregas"
          ],
          correctAnswerIndex: 1,
          explanation: "Quem vivencia o processo (operador ou líder de linha) é quem deve registrar as atividades e desvios no sistema."
        },
        {
          id: "q8_2",
          text: "Para que serve cadastrar o custo hora do operador (MOD) no sistema?",
          options: [
            "Apenas para controlar a folha de pagamento do RH.",
            "Para calcular o custo real de transformação de cada ordem de produção com base no tempo gasto pelas pessoas para fabricar.",
            "Para demitir os operadores mais lentos de forma automática.",
            "Para reduzir a carga de impostos da empresa."
          ],
          correctAnswerIndex: 1,
          explanation: "O custo hora do trabalhador (Mão de Obra Direta) compõe o custo de fabricação do colchão, permitindo saber se a empresa está tendo lucro real no produto."
        }
      ]
    },
    exercise: {
      type: 'general_trivia',
      title: "Desafio de Organização de Equipes",
      instruction: "Determine qual papel deve intervir em um cenário onde a principal fechadora de colchões quebra gravemente às 22h, comprometendo a entrega do dia seguinte.",
      data: {
        scenario: "Quebra crítica de máquina no turno da noite. Quem lidera o plano de ação imediato no chão de fábrica?",
        options: [
          "O Almoxarife",
          "O Líder de Turno de Produção junto ao Técnico de Manutenção de plantão",
          "O Comprador de tecidos",
          "O Diretor Financeiro"
        ]
      },
      successCondition: (answer: string) => {
        const isCorrect = answer === "O Líder de Turno de Produção junto ao Técnico de Manutenção de plantão";
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Correto! O Líder de Turno toma as decisões operacionais rápidas e aciona o suporte técnico de imediato para restabelecer a produção!" 
            : "Resposta incorreta. Lembre-se de quem está presente fisicamente à noite gerenciando o fluxo e os recursos de apoio à máquina parada."
        };
      }
    }
  },
  {
    id: 9,
    title: "Matérias-Primas",
    objective: "Entender o que são matérias-primas e como suas propriedades físicas impactam o planejamento do estoque e o produto final.",
    concepts: [
      {
        title: "O que é Matéria-Prima (MP)?",
        description: "São os insumos básicos que entram na fábrica em seu estado original de compra e são transformados ou agrupados para dar origem ao produto."
      },
      {
        title: "Principais MPs do Colchão",
        description: "Blocos de Espuma (ou produtos químicos Poliol e Isocianato para expandir), Tecido em rolo, Cola em tambor, Molas Pocket em fardos, Fitilho e Plástico de embalagem."
      }
    ],
    illustratedExplanation: "A espuma é uma MP que reage quimicamente. Um bloco de espuma 'mãe' tem 5 metros de comprimento por 2 metros de largura. Ele precisa de 24h de 'cura' antes de ser cortado para liberar gases e estabilizar a densidade.",
    flowchartSteps: [
      { label: "Recebimento de MP", description: "Conferência de Notas e Lotes de Tecido.", arrow: true },
      { label: "Inspeção Visual", description: "Verificação de furos ou manchas no tecido.", arrow: true },
      { label: "Armazenagem", description: "Guarda em porta-paletes identificados por lote.", arrow: true },
      { label: "Consumo Produtivo", description: "Baixa automática no estoque ao iniciar a produção." }
    ],
    practicalExample: "Se a fábrica recebe um lote de tecido com largura menor que a especificada, o pantógrafo de costura não conseguirá cortar os tampos corretamente, resultando em 15% de perda de material e atraso em 50 colchões.",
    systemApplication: "No Allin-SO, cadastramos as Matérias-Primas com seus códigos, unidades de medida (metros para tecido, kg para cola, unidades para molas) e níveis mínimos de segurança (ponto de ressuprimento).",
    commonErrors: [
      "Lançar entrada de tecidos em 'unidades' em vez de 'metros lineares', gerando descontrole total no rendimento.",
      "Consumir matéria-prima na produção sem informar o número do lote recebido, destruindo a rastreabilidade em caso de reclamação de garantia do cliente."
    ],
    summary: [
      "A qualidade do colchão começa na inspeção rigorosa das matérias-primas.",
      "Controlar o estoque por lote é vital para a rastreabilidade e controle de garantia.",
      "Níveis mínimos de segurança no sistema evitam que a fábrica pare por falta de insumos básicos."
    ],
    quiz: {
      questions: [
        {
          id: "q9_1",
          text: "Qual das seguintes alternativas lista apenas matérias-primas diretas na fabricação de um colchão?",
          options: [
            "Energia elétrica, canetas de escritório e paletes de madeira.",
            "Tecido jacquard, bloco de espuma, cola de contato e molejo ensacado.",
            "Combustível de empilhadeira, luvas raspa e panfletos de marketing.",
            "Creme de solda, lixas d'água e detergente de piso."
          ],
          correctAnswerIndex: 1,
          explanation: "Tecido, espuma, cola e molejos entram diretamente na constituição física do colchão acabado."
        },
        {
          id: "q9_2",
          text: "O que representa o 'Ponto de Ressuprimento' de uma matéria-prima no sistema?",
          options: [
            "A capacidade máxima do porta-palete físico.",
            "A quantidade mínima em estoque que dispara um alerta automático para o setor de Compras fazer um novo pedido, antes que o insumo acabe.",
            "O dia da semana em que os caminhões devem ser descarregados.",
            "A vida útil do material antes de vencer."
          ],
          correctAnswerIndex: 1,
          explanation: "O ponto de ressuprimento (estoque mínimo de segurança + consumo no lead time de compra) previne paradas de produção por desabastecimento."
        }
      ]
    },
    exercise: {
      type: 'mp_inventory',
      title: "Desafio de Recebimento de Insumos",
      instruction: "Analise a nota fiscal de recebimento e aprove os rolos de tecido apenas se atenderem às especificações técnicas da ficha do produto.",
      data: {
        specWidth: 2.20,
        receivedItems: [
          { batch: "Lote-A01", width: 2.20, approved: true },
          { batch: "Lote-A02", width: 2.15, approved: false }, // Too narrow
          { batch: "Lote-A03", width: 2.21, approved: true }
        ]
      },
      successCondition: (answer: Record<string, boolean>) => {
        const correct = answer["Lote-A01"] === true && answer["Lote-A02"] === false && answer["Lote-A03"] === true;
        return {
          success: correct,
          feedback: correct 
            ? "Excepcional! Você bloqueou o Lote-A02 que causaria perdas terríveis e desalinhamento no pantógrafo de costura!" 
            : "Rejeição incorreta. Lembre-se: tecidos com largura inferior à especificada (2.20m) devem ser rejeitados para evitar falhas de corte."
        };
      }
    }
  },
  {
    id: 10,
    title: "Componentes",
    objective: "Diferenciar Matéria-Prima de Componente e entender a importância dos subconjuntos intermediários na montagem ágil.",
    concepts: [
      {
        title: "O que é um Componente?",
        description: "É uma peça intermediária (semiacabado) fabricada dentro da própria fábrica a partir de matérias-primas, que serve para compor o produto final."
      },
      {
        title: "Componentes da Colchoaria",
        description: "O Tampo Bordado (tecido + espuma fina bordados juntos), a Faixa Lateral Costurada (tecido lateral + TNT + alças), o Bloco Estrutural de Espuma (placas de espuma coladas formando o núcleo do colchão)."
      }
    ],
    illustratedExplanation: "O 'Tampo Bordado' é um componente. Ele é fabricado no setor de costura alimentando o pantógrafo com rolo de tecido, rolo de manta acrílica e rolo de TNT. Juntos, eles viram uma peça única (tampo) que aguarda a montagem final.",
    flowchartSteps: [
      { label: "Tecido + TNT + Espuma", description: "Matérias-primas alimentadas no pantógrafo.", arrow: true },
      { label: "Quilting / Bordagem", description: "Operação que une as camadas em uma manta única.", arrow: true },
      { label: "Corte das Peças", description: "Manta é cortada nas dimensões exatas do colchão.", arrow: true },
      { label: "Componente Tampo", description: "Enviado ao estoque WIP para aguardar colagem final." }
    ],
    practicalExample: "Fabricar tampos e faixas laterais de forma antecipada (estocados como componentes semiacabados) permite que a linha de montagem final monte um colchão personalizado em menos de 10 minutos quando o pedido entra.",
    systemApplication: "No Allin-SO, cadastramos os Componentes com sua própria lista de materiais (BOM secundária) e geramos ordens de produção internas de semiacabados para alimentar as linhas de produto acabado.",
    commonErrors: [
      "Lançar o tampo bordado diretamente como matéria-prima de compra, ocultando o tempo e o custo de fabricação interna dele.",
      "Não controlar o estoque físico dos componentes semiacabados (WIP), gerando falta de tampos nas mesas de colagem."
    ],
    summary: [
      "Componentes são subconjuntos que aceleram a montagem final.",
      "Eles convertem matérias-primas brutas em itens de valor intermediário.",
      "Devem ter seu estoque controlado separadamente no sistema (WIP - Work In Progress)."
    ],
    quiz: {
      questions: [
        {
          id: "q10_1",
          text: "Qual a diferença conceitual básica entre uma Matéria-Prima e um Componente no chão de fábrica?",
          options: [
            "Matéria-prima é comprada pronta de fornecedores externos; Componente é um subconjunto montado ou transformado internamente antes de ir para o produto final.",
            "Matéria-prima é pesada e Componente é medido por metro.",
            "Não há diferença alguma, os termos são sinônimos perfeitos.",
            "Matéria-prima é sempre sólida e Componente é sempre líquido."
          ],
          correctAnswerIndex: 0,
          explanation: "Insumos puros comprados são MPs. Quando juntamos ou transformamos internamente esses insumos em algo que comporá o produto, temos um Componente/Semiacabado."
        },
        {
          id: "q10_2",
          text: "Qual dos seguintes itens de uma fábrica de colchões é melhor classificado como um Componente fabricado internamente?",
          options: [
            "Um rolo de tecido Jacquard bruto de 100 metros.",
            "O Tampo Bordado (manta composta de tecido + espuma + TNT bordados e cortados na medida).",
            "Um tambor de 200 litros de cola solvente.",
            "Uma caixa de agulhas industriais."
          ],
          correctAnswerIndex: 1,
          explanation: "O tampo bordado é produzido internamente na máquina de quilting a partir de tecido, espuma e TNT, sendo estocado como semiacabado até a colagem final."
        }
      ]
    },
    exercise: {
      type: 'bom_assembly',
      title: "Desafio de Montagem de Componentes",
      instruction: "Monte o Componente 'Pillow Top' arrastando os materiais corretos e especificando suas quantidades teóricas na receita.",
      data: {
        target: "Pillow Top King Size",
        itemsPool: [
          { id: "foam_soft", name: "Lâmina de Espuma Soft (2cm)", isCorrect: true, qty: "1 m²" },
          { id: "fabric_mesh", name: "Tecido de Malha Nobre", isCorrect: true, qty: "1 m²" },
          { id: "adhesive", name: "Cola Spray de Contato", isCorrect: true, qty: "0.15 kg" },
          { id: "wood_frame", name: "Estrutura de Eucalipto", isCorrect: false, qty: "1 un" } // Error
        ]
      },
      successCondition: (answer: string[]) => {
        const correctIds = ["foam_soft", "fabric_mesh", "adhesive"];
        const hasCorrect = correctIds.every(id => answer.includes(id));
        const hasIncorrect = answer.includes("wood_frame");
        const success = hasCorrect && !hasIncorrect;
        return {
          success: success,
          feedback: success 
            ? "Perfeito! O Pillow Top foi montado com espuma soft, malha e adesivo, deixando de fora a madeira (que é do sommier)!" 
            : "Sua receita de Pillow Top contém erros. Não coloque ripas ou estruturas de madeira dentro de uma camada de conforto de espuma!"
        };
      }
    }
  },
  {
    id: 11,
    title: "Produtos",
    objective: "Aprender a modelar a arquitetura dos produtos acabados e gerenciar suas variantes de mercado (tamanhos, densidades, linhas).",
    concepts: [
      {
        title: "Arquitetura do Produto Acabado",
        description: "O produto acabado (PA) é o item final vendido ao cliente. Ele é cadastrado com códigos únicos e organizado em famílias (ex: Colchões de Mola, Colchões de Espuma) e linhas de preço."
      },
      {
        title: "Matriz de Variantes",
        description: "Em vez de criar mil cadastros manuais, usamos variantes para representar tamanhos comerciais padrão: Solteiro (88x188), Casal (138x188), Queen (158x198) e King (193x203)."
      }
    ],
    illustratedExplanation: "O produto 'Colchão Imperial Spring' possui uma ficha técnica básica, mas se desdobra em 4 variantes de tamanho. Cada variante consome quantidades proporcionais de molas, tecidos e espuma em sua BOM.",
    flowchartSteps: [
      { label: "Definir Família", description: "Colchões de Molas Pocket.", arrow: true },
      { label: "Cadastrar Modelo", description: "Modelo 'OrthoPremium'.", arrow: true },
      { label: "Gerar Variantes", description: "Solteiro, Casal, Queen, King.", arrow: true },
      { label: "Vincular BOMs", description: "Receitas de materiais específicas para cada dimensão." }
    ],
    practicalExample: "Ao padronizar as variantes de tamanho no sistema, a fábrica consegue calcular instantaneamente a quantidade exata de matéria-prima necessária para produzir um mix de 40 colchões variados em um único dia.",
    systemApplication: "No Allin-SO, você gerencia a árvore de produtos. É possível visualizar a Ficha Técnica de Engenharia, ver o histórico de custos de fabricação, e tabelas de preços de venda por canal de distribuição.",
    commonErrors: [
      "Cadastrar o colchão Solteiro e o Casal com o mesmo código de produto, gerando faturamento errado e descontrole de estoque físico.",
      "Não atualizar a ficha técnica do produto após alterar o fornecedor de tecido por um mais espesso, distorcendo os custos estimados."
    ],
    summary: [
      "Produtos acabados representam as vendas da empresa.",
      "Variantes simplificam o gerenciamento da colchoaria (tamanhos comerciais).",
      "Cada produto possui uma Ficha Técnica (BOM) que dita seu consumo e custo."
    ],
    quiz: {
      questions: [
        {
          id: "q11_1",
          text: "Na engenharia de produtos de colchoaria, o que representa a matriz de variantes?",
          options: [
            "A lista de máquinas necessárias para costurar.",
            "A árvore que gerencia as dimensões comerciais (Solteiro, Casal, Queen, King) de um mesmo modelo de colchão sem duplicar cadastros básicos.",
            "O cálculo do imposto de faturamento.",
            "As rotas de frete para entrega."
          ],
          correctAnswerIndex: 1,
          explanation: "As variantes evitam cadastros redundantes, permitindo gerenciar o mesmo modelo de colchão nos diversos tamanhos do mercado de forma ágil."
        },
        {
          id: "q11_2",
          text: "O que é indispensável associar a um cadastro de Produto Acabado no sistema para que o PCP consiga planejar a produção e Compras compre insumos?",
          options: [
            "A cor favorita do operador.",
            "A Ficha Técnica (BOM - Bill of Materials) com a receita e consumo de materiais.",
            "O número do caminhão que fará a entrega.",
            "O manual de instruções de uso do ERP financeiro."
          ],
          correctAnswerIndex: 1,
          explanation: "Sem a BOM (Ficha Técnica/Estrutura de Produto), o sistema não sabe quais matérias-primas e quantidades baixar ao produzir o colchão."
        }
      ]
    },
    exercise: {
      type: 'general_trivia',
      title: "Desafio de Cadastro de Modelos",
      instruction: "Qual tamanho padrão de variante você deve vincular ao código comercial de um colchão 'Queen Size' para garantir o consumo correto de 2.2 metros de tecido de largura?",
      data: {
        options: [
          "Casal Padrão (138x188 cm)",
          "Solteiro (88x188 cm)",
          "Queen Size (158x198 cm)",
          "King Size (193x203 cm)"
        ]
      },
      successCondition: (answer: string) => {
        const isCorrect = answer === "Queen Size (158x198 cm)";
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Exato! Vincular a variante de tamanho correta garante que a engenharia calcule exatamente o consumo de tecido de 158x198 cm!" 
            : "Incorreto. A variante Queen Size comercial corresponde à dimensão de 158x198 cm."
        };
      }
    }
  },
  {
    id: 12,
    title: "Engenharia do Produto",
    objective: "Dominar a criação e o funcionamento da Bill of Materials (BOM) e dos roteiros de processo que guiam a fabricação.",
    concepts: [
      {
        title: "O que é BOM (Bill of Materials)?",
        description: "É a lista de materiais ou 'receita do bolo' estruturada em níveis. Define a quantidade exata de cada MP ou componente para fabricar uma unidade do produto."
      },
      {
        title: "Roteiro de Produção",
        description: "Sequência de operações que o material sofre, associando cada passo a um Centro de Trabalho e estimando o tempo padrão de execução."
      }
    ],
    illustratedExplanation: "Na engenharia do colchão 'Pocket Casal', a BOM nível 0 é o colchão acabado. Nível 1: Tampo Bordado (Componente), Faixa Costurada (Componente) e Bloco Molas (Componente). Nível 2: Tecido, Espuma e Cola (Matérias-primas).",
    flowchartSteps: [
      { label: "BOM Nível 0", description: "Colchão 'Casal Pocket Ouro' pronto.", arrow: true },
      { label: "BOM Nível 1", description: "Composto por: 2 Tampos + 1 Lateral + 1 Bloco de Molas.", arrow: true },
      { label: "BOM Nível 2", description: "Cada tampo consome: 2.1m tecido + 0.3kg espuma + 0.1kg cola.", arrow: true },
      { label: "Roteiro", description: "Corte -> Quilting -> Costura -> Colagem -> Tape Edge -> Rollpack." }
    ],
    practicalExample: "Um erro na engenharia cadastrou 12 kg de cola por colchão em vez de 1.2 kg. O sistema assumiu que a fábrica precisava de toneladas de cola, gerando um pedido de compras gigante e desnecessário.",
    systemApplication: "No Allin-SO, a engenharia é a espinha dorsal. É nela que ligamos a BOM aos Roteiros. Quando o comercial vende 10 colchões, a engenharia explode a demanda em metros de tecido e horas de máquina.",
    commonErrors: [
      "Ignorar a porcentagem de quebra ou perda inerente no processo (ex: 5% de retalho de tecido) no cadastro da BOM, gerando furos de estoque real.",
      "Criar roteiros de processo genéricos sem tempos estimados de setup e tempo por peça, inviabilizando o agendamento de capacidade pelo PCP."
    ],
    summary: [
      "BOM é a estrutura quantitativa de materiais.",
      "Roteiros definem os passos, os tempos e onde a mágica física acontece.",
      "A integridade de engenharia dita a precisão dos estoques, custos e compras."
    ],
    quiz: {
      questions: [
        {
          id: "q12_1",
          text: "O que significa o termo BOM (Bill of Materials) na Engenharia de Produto?",
          options: [
            "Boletim de Operações de Manutenção.",
            "Estrutura ou Lista de Materiais detalhada necessária para fabricar um produto.",
            "Banco de Ordens Mensais de faturamento.",
            "Controle de Qualidade de Produtos Acabados."
          ],
          correctAnswerIndex: 1,
          explanation: "BOM é a lista hierárquica e estruturada de todos os materiais, componentes e subconjuntos exigidos para criar o colchão."
        },
        {
          id: "q12_2",
          text: "Por que o 'Roteiro de Produção' deve conter o tempo estimado de cada operação?",
          options: [
            "Para controlar a velocidade física dos funcionários com chicote.",
            "Para que o sistema consiga calcular a carga das máquinas, estimar prazos de entrega confiáveis e calcular o custo de mão de obra.",
            "Apenas por exigência burocrática das normas ISO.",
            "Para saber quando ligar o ar-condicionado da fábrica."
          ],
          correctAnswerIndex: 1,
          explanation: "Os tempos padrão de processo são a chave para o PCP calcular se há capacidade de máquina disponível e estimar quando a ordem terminará."
        }
      ]
    },
    exercise: {
      type: 'cost_calculation',
      title: "Desafio de Engenharia de Produto",
      instruction: "Calcule a necessidade de placas de espuma para fabricar uma Ordem de 20 Colchões de Espuma D33. Sabendo que cada colchão consome exatamente 2 placas de espuma na sua BOM e a perda estimada no processo é de zero.",
      data: {
        demand: 20,
        bomQty: 2
      },
      successCondition: (answer: number) => {
        const correct = answer === 40;
        return {
          success: correct,
          feedback: correct 
            ? "Cálculo exato! A explosão da BOM indica a necessidade de 40 placas de espuma para atender a OP." 
            : "Erro no cálculo. Multiplique o volume de colchões (20) pelo consumo unitário por colchão (2)!"
        };
      }
    }
  },
  {
    id: 13,
    title: "Processos",
    objective: "Compreender os métodos, fluxos operacionais e a padronização das rotinas que garantem a eficiência e a repetibilidade no chão de fábrica.",
    concepts: [
      {
        title: "O que é um Processo Industrial?",
        description: "É o conjunto de atividades sequenciais e coordenadas que transformam insumos em produtos com valor agregado."
      },
      {
        title: "Padronização Operacional (SOP)",
        description: "O Procedimento Operacional Padrão (SOP) garante que todos os operadores executem a tarefa do mesmo jeito, eliminando variações de qualidade."
      }
    ],
    illustratedExplanation: "Na colagem por spray, o operador deve manter a pistola de adesivo a 30cm da espuma, aplicando movimentos em zigue-zague. Se aplicar muito perto, a cola acumula e mancha o colchão.",
    flowchartSteps: [
      { label: "Preparar Posto", description: "Abastecer pistola de cola e regular pressão a 4 bar.", arrow: true },
      { label: "Passar Adesivo", description: "Movimento contínuo cruzado em zigue-zague.", arrow: true },
      { label: "Unir Camadas", description: "Pressionar as placas de espuma por 10 segundos.", arrow: true },
      { label: "Inspecionar Alinhamento", description: "Verificar se as bordas coincidem perfeitamente." }
    ],
    practicalExample: "Uma colchoaria eliminou 90% das bolhas de ar nos colchões ao treinar os operadores em um processo padrão de prensagem das placas de espuma logo após a colagem.",
    systemApplication: "No Allin-SO, os fluxos de processo definem as transições de status das Ordens de Produção. Cada posto só pode iniciar uma atividade se o processo anterior foi apontado como concluído.",
    commonErrors: [
      "Pular etapas de processo sem apontar no sistema (ex: enviar colchão para fechar sem apontar a colagem), gerando descompasso lógico no ERP.",
      "Executar tarefas de modo informal sem seguir a folha de processo padrão, gerando diferenças perceptíveis na firmeza do colchão."
    ],
    summary: [
      "Processos padronizados reduzem desperdícios e garantem a qualidade repetível.",
      "As transições no sistema espelham o progresso físico real na fábrica.",
      "Garantir a sequência do roteiro é dever de toda a equipe operacional."
    ],
    quiz: {
      questions: [
        {
          id: "q13_1",
          text: "O que é um SOP (Procedimento Operacional Padrão)?",
          options: [
            "Um software de programação financeira.",
            "Um documento detalhado que instrui o operador sobre como realizar uma tarefa da forma mais eficiente e segura possível.",
            "Um relatório semanal de reclamações de clientes.",
            "O organograma de cargos da empresa."
          ],
          correctAnswerIndex: 1,
          explanation: "Os SOPs padronizam a execução das atividades industriais, reduzindo variabilidade e garantindo qualidade."
        },
        {
          id: "q13_2",
          text: "Qual o maior benefício de integrar o roteiro de processos ao sistema Allin-SO?",
          options: [
            "O sistema impede que uma etapa seja iniciada antes que a anterior seja concluída, garantindo o fluxo físico planejado.",
            "Reduzir o consumo elétrico das lâmpadas.",
            "Fazer o colchão pesar menos.",
            "Aumentar o imposto de exportação."
          ],
          correctAnswerIndex: 0,
          explanation: "Integrar processos ao sistema assegura que as regras do roteiro produtivo sejam seguidas fisicamente, garantindo a rastreabilidade e a ordem do fluxo."
        }
      ]
    },
    exercise: {
      type: 'process_sequencing',
      title: "Desafio de Validação de Rota",
      instruction: "Identifique e ordene a rota de processos correta de um colchão de molas. Coloque a costura do tampo antes do fechamento do colchão.",
      data: {
        steps: ["Bordar Tampo", "Preparar Lateral", "Colar Camadas", "Tape Edge (Fechamento)"]
      },
      successCondition: (answer: string[]) => {
        const correct = ["Bordar Tampo", "Preparar Lateral", "Colar Camadas", "Tape Edge (Fechamento)"];
        const isCorrect = answer.every((val, index) => val === correct[index]);
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Parabéns! Rota lógica validada com sucesso. Os componentes (tampo e lateral) devem ser preparados antes da montagem e fechamento final." 
            : "Ordem incorreta. Não podemos fechar o colchão antes de preparar seus componentes constituintes (tampo e faixas)."
        };
      }
    }
  },
  {
    id: 14,
    title: "Ordens de Produção",
    objective: "Compreender o ciclo de vida de uma Ordem de Produção (OP), desde a sua criação até o encerramento físico e digital.",
    concepts: [
      {
        title: "O que é uma OP?",
        description: "É o documento formal (autorização de trabalho) emitido pelo PCP que instrui a fábrica a produzir uma quantidade específica de um produto até uma data limite."
      },
      {
        title: "Ciclo de Vida da OP",
        description: "Planejada (PCP rascunha) -> Liberada (matéria-prima empenhada) -> Em Execução (operadores apontando) -> Concluída (produto acabado no estoque)."
      }
    ],
    illustratedExplanation: "Uma OP de 50 Colchões 'Casal D33' é impressa com uma folha de rosto contendo códigos de barras. Conforme ela caminha pela fábrica, cada líder de setor bipa o código para registrar o progresso.",
    flowchartSteps: [
      { label: "OP Planejada", description: "Criada pelo PCP com base em pedidos de venda.", arrow: true },
      { label: "OP Liberada", description: "Matérias-primas bloqueadas no estoque para uso.", arrow: true },
      { label: "OP Iniciada", description: "Primeira etapa (Corte) começa a apontar tempos.", arrow: true },
      { label: "OP Concluída", description: "Entrada do produto final e baixa real de insumos." }
    ],
    practicalExample: "Se a OP de colchões King não for liberada a tempo no sistema, o almoxarife não separa as molas e a mesa de colagem fica ociosa aguardando os insumos chegarem do armazém.",
    systemApplication: "No Allin-SO, a tela de Ordens de Produção permite acompanhar em tempo real o status de cada lote, ver o rendimento dos operadores e disparar a requisição de insumos.",
    commonErrors: [
      "Iniciar a produção física sem abrir a OP correspondente no sistema, gerando fabricação invisível de difícil rastreamento.",
      "Esquecer de encerrar a OP no sistema ao finalizar o lote, mantendo matérias-primas empenhadas e travando saldos de forma incorreta."
    ],
    summary: [
      "OP é a lei da fábrica; nada é produzido sem ela.",
      "A liberação da OP valida se há insumos físicos para evitar paradas na linha.",
      "Sua finalização correta atualiza os saldos de estoque e custos reais no sistema."
    ],
    quiz: {
      questions: [
        {
          id: "q14_1",
          text: "O que representa o status 'Liberada' de uma Ordem de Produção no sistema?",
          options: [
            "A OP foi cancelada pelo cliente.",
            "A OP foi concluída e enviada ao cliente.",
            "O PCP validou os insumos em estoque, bloqueou-os para esta ordem e autorizou o início físico da produção.",
            "As máquinas estão livres para manutenção."
          ],
          correctAnswerIndex: 2,
          explanation: "Liberar a OP significa que o material está disponível, reservado e a fábrica tem o sinal verde físico para começar a transformar."
        },
        {
          id: "q14_2",
          text: "Qual das seguintes informações é crucial conter em uma folha de Ordem de Produção?",
          options: [
            "O cardápio do almoço da fábrica.",
            "Código do Produto, Quantidade a produzir, Roteiro de Processos e Lote de Rastreabilidade.",
            "A previsão do tempo para a semana.",
            "A foto de todas as máquinas da fábrica."
          ],
          correctAnswerIndex: 1,
          explanation: "Essas informações dão clareza e controle absoluto sobre o que deve ser feito, como deve ser feito e para quando."
        }
      ]
    },
    exercise: {
      type: 'op_planning',
      title: "Desafio de Abertura de OP",
      instruction: "Crie uma Ordem de Produção de 5 Colchões de Casal. O sistema exige a verificação prévia do estoque de espuma. Cada colchão consome 1 bloco de espuma. Temos 4 blocos de espuma em estoque físico disponível.",
      data: {
        targetQty: 5,
        availableFoam: 4
      },
      successCondition: (answer: string) => {
        const isCorrect = answer === "rejeitar" || answer === "comprar";
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Correto! Não podemos liberar uma OP de 5 unidades se só temos insumo para 4! Você deve solicitar compras primeiro ou reduzir o lote." 
            : "Atenção! Se você aceitar liberar a OP com estoque insuficiente, a linha de colagem vai travar no meio do turno por falta de espuma!"
        };
      }
    }
  },
  {
    id: 15,
    title: "Apontamentos",
    objective: "Aprender a registrar as atividades do chão de fábrica (inícios, finais, paradas e perdas) para munir o sistema de dados reais.",
    concepts: [
      {
        title: "O que é um Apontamento?",
        description: "É o registro em tempo real feito pelo operador contendo: quem produziu, qual máquina usou, quanto tempo demorou, quantas peças boas fez e quantas perdeu."
      },
      {
        title: "Tipos de Apontamentos",
        description: "Apontamento de Tempo (tempo trabalhado), Apontamento de Produção (peças boas), Apontamento de Perda (refugos/retrabalhos) e Apontamento de Parada (quebra de máquina)."
      }
    ],
    illustratedExplanation: "Na fechadora de colchão, o operador inicia o apontamento bipando seu crachá e a OP. Ao terminar 10 colchões, ele bipa novamente indicando 'concluído' e registra que perdeu 0.5m de fitilho.",
    flowchartSteps: [
      { label: "Bipar Início", description: "Operador registra início da colagem no terminal.", arrow: true },
      { label: "Executar Trabalho", description: "Colagem das placas de espuma fisicamente.", arrow: true },
      { label: "Bipar Fim", description: "Registra parada do cronômetro da tarefa.", arrow: true },
      { label: "Digitar Perdas", description: "Registra se houve descarte de retalhos no posto." }
    ],
    practicalExample: "Sem apontamentos de parada, o sistema assume que a serra de corte trabalhou 8 horas seguidas. Mas, na verdade, ela ficou parada 3 horas aguardando o operador da empilhadeira trazer blocos. Sem dados, não há melhoria.",
    systemApplication: "No Allin-SO, os operadores usam terminais de chão de fábrica simplificados (com telas de botões grandes ou tablets) para apontar de forma rápida sem burocracia.",
    commonErrors: [
      "Acumular todos os apontamentos do dia para digitar apenas no fim do turno, gerando dados defasados e distorcidos.",
      "Apontar paradas genéricas como 'Outros' em vez de especificar 'Falta de Matéria-Prima' ou 'Manutenção', impossibilitando análises do PCP."
    ],
    summary: [
      "Apontar em tempo real é a garantia de uma fábrica transparente.",
      "Paradas não apontadas são perdas invisíveis que corroem o lucro.",
      "O apontamento preciso alimenta diretamente as métricas de OEE e eficiência."
    ],
    quiz: {
      questions: [
        {
          id: "q15_1",
          text: "O que é um 'Apontamento de Parada' no chão de fábrica?",
          options: [
            "O registro de quando o funcionário sai de férias.",
            "O registro formal no sistema do motivo e da duração de tempo em que uma máquina ou posto de trabalho ficou sem produzir.",
            "A contagem do estoque físico anual.",
            "A marcação de atrasos do ponto eletrônico do funcionário."
          ],
          correctAnswerIndex: 1,
          explanation: "Apontamentos de parada documentam as perdas de disponibilidade de máquina (ex: quebra, falta de material) para identificar e tratar perdas de OEE."
        },
        {
          id: "q15_2",
          text: "Por que os apontamentos devem ser feitos em 'tempo real' em vez de anotados em papel e digitados após uma semana?",
          options: [
            "Para permitir que a gerência e o Copilot detectem e corrijam problemas operacionais no mesmo dia em que ocorrem.",
            "Porque os computadores da fábrica apagam os dados se demorar.",
            "Apenas para economizar papel.",
            "Porque as costureiras esquecem o próprio nome."
          ],
          correctAnswerIndex: 0,
          explanation: "Apontar em tempo real dá visibilidade imediata à gestão e permite à IA (Copilot) alertar sobre gargalos antes que os prazos de entrega estourem."
        }
      ]
    },
    exercise: {
      type: 'apontamento_form',
      title: "Desafio de Apontamento Real",
      instruction: "Registre o encerramento de um lote de 10 colchões. O operador produziu 9 colchões perfeitos e 1 colchão foi reprovado por mancha de cola.",
      data: {
        target: 10,
        good: 9,
        scrapped: 1,
        scrapReason: "Mancha de Cola"
      },
      successCondition: (answer: { good: number; scrap: number; reason: string }) => {
        const correct = answer.good === 9 && answer.scrap === 1 && answer.reason === "Mancha de Cola";
        return {
          success: correct,
          feedback: correct 
            ? "Lançamento perfeito! A qualidade foi informada e o refugo gerou um alerta automático para conferência da pistola de adesivo." 
            : "Os dados informados não coincidem com o cenário do desafio (9 bons, 1 refugo com motivo 'Mancha de Cola')."
        };
      }
    }
  },
  {
    id: 16,
    title: "Estoques",
    objective: "Gerenciar os fluxos de inventário de matérias-primas, produtos semiacabados e acabados, garantindo a acuracidade de saldos.",
    concepts: [
      {
        title: "Categorias de Estoque",
        description: "Matéria-Prima (bruto comprado), Semiacabado/WIP (peças em andamento como tampos), Produto Acabado (colchão pronto para venda), e Quarentena (lotes aguardando laudo técnico)."
      },
      {
        title: "Acuracidade e Inventário Rotativo",
        description: "É a taxa de correspondência entre o saldo físico na prateleira e o saldo digital no sistema. Inventários rotativos diários evitam surpresas de faltas de insumos."
      }
    ],
    illustratedExplanation: "Na colchoaria, o estoque WIP é muito volumoso. Deixar tampos e espumas cortadas espalhadas sem endereço cadastrado faz com que os operadores gastem horas procurando materiais no meio da fábrica.",
    flowchartSteps: [
      { label: "WIP (Em Processo)", description: "Estoque temporário ao lado das máquinas.", arrow: true },
      { label: "Laudo da Qualidade", description: "Se houver anomalias, envia para Quarentena.", arrow: true },
      { label: "Armazenagem de PA", description: "Colchões prontos empilhados na expedição.", arrow: true },
      { label: "Inventário Rotativo", description: "Contagem diária de amostragem para corrigir erros de saldo." }
    ],
    practicalExample: "O sistema apontava que havia 100 fardos de molas pocket, mas fisicamente só existiam 12 fardos. O PCP agendou a produção e o setor de colagem parou porque o estoque real estava zerado. Falta de acuracidade quebra a fábrica.",
    systemApplication: "No Allin-SO, cada movimentação de material gera um registro automático de histórico (rastreamento de FIFO/PEPS) e atualiza instantaneamente a posição física do inventário.",
    commonErrors: [
      "Retirar matérias-primas físicas do almoxarifado sem dar a respectiva 'baixa' por requisição no sistema.",
      "Estocar produtos acabados no galpão sem endereçar o corredor e a prateleira, dificultando o carregamento dos caminhões."
    ],
    summary: [
      "Estoque é dinheiro parado em forma física.",
      "Acuracidade acima de 95% é crucial para um PCP eficiente.",
      "Inventários rotativos evitam paradas repentinas na montagem final."
    ],
    quiz: {
      questions: [
        {
          id: "q16_1",
          text: "O que define a 'Quarentena de Estoque' em uma indústria?",
          options: [
            "Um local onde os materiais ficam guardados por 40 dias obrigatoriamente.",
            "Uma área física ou status de sistema reservado para materiais sob suspeita de defeito, aguardando inspeção e aprovação do setor de Qualidade.",
            "O almoxarifado de ferramentas manuais.",
            "O estoque de colchões que já passaram da data de validade."
          ],
          correctAnswerIndex: 1,
          explanation: "Materiais na quarentena estão temporariamente travados para uso até que a Qualidade emita um laudo de liberação ou rejeição definitiva."
        },
        {
          id: "q16_2",
          text: "O que é 'Acuracidade de Estoque'?",
          options: [
            "A velocidade em que a empilhadeira transporta o material.",
            "O grau de precisão e correspondência real entre a quantidade física existente na fábrica e o saldo registrado no software.",
            "O custo total de armazenamento anual.",
            "O tamanho em metros do galpão de estoque."
          ],
          correctAnswerIndex: 1,
          explanation: "Alta acuracidade significa que o que o sistema diz que existe é exatamente o que está fisicamente na prateleira, viabilizando programações sem furos."
        }
      ]
    },
    exercise: {
      type: 'mp_inventory',
      title: "Desafio de Inventário Rotativo",
      instruction: "Corrige o saldo do sistema após realizar uma contagem rotativa na prateleira de Fitilhos de Costura.",
      data: {
        systemQty: 50, // rolls
        physicalQty: 48, // rolls
        item: "Fitilho Branco 22mm"
      },
      successCondition: (answer: { adjustedQty: number }) => {
        const correct = answer.adjustedQty === 48;
        return {
          success: correct,
          feedback: correct 
            ? "Ajuste concluído! O sistema agora reflete a realidade física (48 rolos), evitando que o PCP planeje produções falsas com os 2 rolos faltantes." 
            : "Incorreto. Você deve ajustar o saldo do sistema para bater exatamente com a quantidade física real encontrada (48 rolos)."
        };
      }
    }
  },
  {
    id: 17,
    title: "Qualidade",
    objective: "Compreender os métodos de garantia de qualidade (inspeções, auditorias e gestão de não-conformidades) e rastreabilidade total.",
    concepts: [
      {
        title: "Garantia de Qualidade",
        description: "Conjunto de ações que asseguram que o colchão atenda aos requisitos de densidade, tamanho, acabamento e costura exigidos pelas normas técnicas (INMETRO)."
      },
      {
        title: "Não Conformidades (RNC)",
        description: "Quando um material ou produto desvia da especificação, abre-se um Relatório de Não Conformidade (RNC) para identificar a causa e definir ações corretivas."
      }
    ],
    illustratedExplanation: "Na colchoaria, o teste mais importante é o de densidade da espuma e o teste visual de costura na Tape Edge. Se o fitilho soltar, o colchão é rejeitado e enviado para o posto de retrabalho.",
    flowchartSteps: [
      { label: "Inspeção visual na Tape Edge", description: "Verificação de furos ou saltos de agulha.", arrow: true },
      { label: "Detecção de falha", description: "Fitilho desfiando na lateral do colchão.", arrow: true },
      { label: "Abertura de RNC", description: "Colchão bloqueado e etiquetado em vermelho.", arrow: true },
      { label: "Retrabalho ou Refugo", description: "Desmanche da costura defeituosa e nova costura." }
    ],
    practicalExample: "Um lote de 30 colchões foi devolvido porque o tecido da lateral encolheu ao ser costurado. A Qualidade identificou que a temperatura de secagem do tecido no fornecedor estava fora do padrão. A rastreabilidade por lote evitou que o problema afetasse mais clientes.",
    systemApplication: "No Allin-SO, a Qualidade registra laudos de inspeção na entrada de MPs e no encerramento de OPs. Os checklists digitais guiam o operador nos pontos críticos que ele deve avaliar.",
    commonErrors: [
      "Liberar um colchão com mancha de sujeira sob a promessa de que 'o cliente não vai notar por estar embalado'.",
      "Não abrir o RNC no sistema para perdas recorrentes, impedindo que a gerência descubra que uma máquina de costura está estragando tecidos."
    ],
    summary: [
      "A qualidade deve ser embutida no processo, não apenas inspecionada no final.",
      "A rastreabilidade garante que saibamos qual rolo de tecido causou o defeito.",
      "Checklists de qualidade no sistema padronizam a inspeção e protegem o cliente."
    ],
    quiz: {
      questions: [
        {
          id: "q17_1",
          text: "O que deve ser feito imediatamente ao detectar um lote de espuma fora da densidade mínima especificada?",
          options: [
            "Misturar com espumas boas para compensar.",
            "Bloquear o lote fisicamente, colar etiqueta vermelha e registrar uma Não Conformidade (RNC) no sistema, movendo o saldo para Quarentena.",
            "Vender o colchão mais barato sem avisar ninguém.",
            "Deixar o material na linha para ver se o operador reclama."
          ],
          correctAnswerIndex: 1,
          explanation: "Identificar, segregar, registrar a não conformidade e enviar para a quarentena impede o uso acidental de materiais defeituosos na produção."
        },
        {
          id: "q17_2",
          text: "Para que serve a 'Rastreabilidade Total' em uma fábrica de colchões?",
          options: [
            "Para saber de qual prateleira o material foi pego.",
            "Para rastrear o caminhão do cliente via satélite.",
            "Para mapear desde qual lote de matéria-prima (espuma/tecido) foi usado, quem produziu e em quais máquinas, caso ocorra alguma reclamação futura de garantia.",
            "Para calcular o imposto de renda da fábrica."
          ],
          correctAnswerIndex: 2,
          explanation: "A rastreabilidade permite investigar a fundo a causa raiz de falhas em campo, isolando lotes específicos e evitando recalls massivos."
        }
      ]
    },
    exercise: {
      type: 'scrap_calculation',
      title: "Desafio de Controle de Qualidade",
      instruction: "Realize a inspeção de um colchão recém costurado na Tape Edge. O checklist detectou costura solta em uma das alças laterais.",
      data: {
        item: "Colchão Gold Pocket Casal",
        defectsFound: ["Costura solta na alça lateral"],
        actions: ["Aprovar sem retrabalho", "Enviar para Retrabalho (descorturar e costurar alça)", "Refugar o colchão inteiro (descarte)"]
      },
      successCondition: (answer: string) => {
        const isCorrect = answer === "Enviar para Retrabalho (descorturar e costurar alça)";
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Decisão assertiva! Uma alça solta é um defeito simples de retrabalhar, não exige descartar o colchão inteiro, mas jamais deve ser aprovada para o cliente!" 
            : "Decisão inadequada. Aprovar o colchão com alça solta gerará devolução certa do cliente. Refugar o colchão inteiro por um erro de alça seria um desperdício enorme de dinheiro."
        };
      }
    }
  },
  {
    id: 18,
    title: "Manutenção",
    objective: "Gerenciar a integridade das máquinas através de planos de manutenção corretiva, preventiva e preditiva para reduzir paradas de produção.",
    concepts: [
      {
        title: "Tipos de Manutenção",
        description: "Corretiva (conserta após quebrar, cara e imprevista), Preventiva (reparos programados por tempo/horas de uso), Preditiva (monitoramento de vibração ou temperatura para antecipar falhas)."
      },
      {
        title: "Indicadores MTBF e MTTR",
        description: "MTBF (Tempo Médio Entre Falhas) mede a confiabilidade da máquina. MTTR (Tempo Médio de Reparo) mede a agilidade do time de manutenção para consertar."
      }
    ],
    illustratedExplanation: "Na máquina de quilting de alta velocidade, a lubrificação diária das agulhas e eixos é uma preventiva que dura 10 minutos. Se negligenciada, o cabeçote trava, exigindo uma corretiva de 2 dias de máquina parada.",
    flowchartSteps: [
      { label: "Preventiva Agendada", description: "Troca de óleo de engrenagens do pantógrafo a cada 500h.", arrow: true },
      { label: "Execução Rápida", description: "Realizada no início de turno em 20 min.", arrow: true },
      { label: "Máquina Disponível", description: "Produção retoma com segurança e estabilidade.", arrow: true },
      { label: "Consequência de Negligência", description: "Quebra súbita da engrenagem por atrito excessivo (Corretiva)." }
    ],
    practicalExample: "Ao implementar manutenção preventiva semanal nas fechadoras Tape Edge, uma fábrica de colchões aumentou a disponibilidade dessas máquinas de 72% para 96%, eliminando gargalos de fechamento.",
    systemApplication: "No Allin-SO, a equipe de manutenção gerencia Ordens de Serviço (OS), cadastra peças sobressalentes e acompanha os alarmes de horas trabalhadas gerados diretamente pelas máquinas digitais.",
    commonErrors: [
      "Cancelar preventivas agendadas sob a justificativa de que 'temos muitas ordens urgentes para produzir', gerando quebras catastróficas dias depois.",
      "Não registrar as peças usadas no conserto no sistema, deixando o estoque de peças sobressalentes desatualizado."
    ],
    summary: [
      "Manutenção preventiva é investimento; corretiva é prejuízo.",
      "Garantir a lubrificação e limpeza evita 80% das quebras comuns.",
      "MTBF alto e MTTR baixo representam um parque de máquinas eficiente."
    ],
    quiz: {
      questions: [
        {
          id: "q18_1",
          text: "Qual o principal objetivo da Manutenção Preventiva?",
          options: [
            "Consertar a máquina o mais rápido possível após ela sofrer uma quebra catastrófica.",
            "Realizar inspeções e trocas planejadas de componentes desgastados antes que a quebra ocorra, evitando paradas de produção inesperadas.",
            "Substituir o operador da máquina por um robô.",
            "Reduzir a velocidade de operação das máquinas para economizar energia."
          ],
          correctAnswerIndex: 1,
          explanation: "A preventiva se antecipa à falha, agendando a parada nos momentos de menor impacto (ex: fins de semana ou entre turnos) para trocar peças desgastadas."
        },
        {
          id: "q18_2",
          text: "Se uma serra de espuma quebra frequentemente, apresentando baixo MTBF (Tempo Médio Entre Falhas), o que isso indica sobre a máquina?",
          options: [
            "Que a máquina é extremamente confiável.",
            "Que a máquina está com baixa confiabilidade, demandando uma revisão profunda no plano de preventiva ou troca de componentes.",
            "Que o operador está cortando rápido demais.",
            "Que o custo de matéria-prima vai diminuir."
          ],
          correctAnswerIndex: 1,
          explanation: "Baixo MTBF indica que o tempo médio entre uma quebra e outra é pequeno, revelando que a máquina falha constantemente."
        }
      ]
    },
    exercise: {
      type: 'maintenance_scheduling',
      title: "Desafio de Gestão de Ativos",
      instruction: "Uma máquina de costura automática atingiu 1000 horas operacionais, disparando o alarme de troca de rolamentos preventiva (duração: 1 hora). Temos uma OP urgente que precisa rodar nesta máquina hoje.",
      data: {
        preventiveDuration: 1,
        opUrgency: "Alta",
        actions: [
          "Adiar a preventiva por mais 100 horas operacionais",
          "Executar a preventiva de 1 hora imediatamente antes de iniciar a OP urgente",
          "Executar a OP e rodar a preventiva somente quando a máquina quebrar sozinha"
        ]
      },
      successCondition: (answer: string) => {
        const isCorrect = answer === "Executar a preventiva de 1 hora imediatamente antes de iniciar a OP urgente";
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Decisão corretíssima! Parar 1 hora de forma planejada protege a máquina e garante que a OP urgente termine sem interrupções por quebras catastróficas!" 
            : "Decisão de risco elevado! Adiar preventivas de rolamentos sob estresse de alta rotação frequentemente causa travamento total do eixo, gerando quebras graves de dias."
        };
      }
    }
  },
  {
    id: 19,
    title: "PCP",
    objective: "Aprender a coordenar as engrenagens da fábrica através do Planejamento, Sequenciamento e Controle de Capacidade das ordens de produção.",
    concepts: [
      {
        title: "O que é PCP?",
        description: "Planejamento e Controle da Produção. É o setor que decide o que produzir, quando produzir, com quais recursos e em qual sequência para otimizar prazos e estoques."
      },
      {
        title: "Sequenciamento e Carga Máquina",
        description: "Ordenar as OPs nas máquinas de forma a agrupar produtos semelhantes para reduzir tempos de setup (preparação de máquina) e não estourar a capacidade diária."
      }
    ],
    illustratedExplanation: "Se o PCP sequenciar: 1 Colchão Solteiro -> 1 Casal -> 1 Solteiro -> 1 King na máquina de corte, o operador terá que mudar o gabarito de corte 4 vezes (tempo de setup alto). Se o PCP agrupar por tamanhos, o setup cai pela metade.",
    flowchartSteps: [
      { label: "Análise de Demanda", description: "Verificação de pedidos de vendas integrados.", arrow: true },
      { label: "Cálculo de Capacidade", description: "Verificar se as máquinas possuem horas disponíveis.", arrow: true },
      { label: "Agrupamento de Lotes", description: "Agrupar OPs por cor, tamanho ou densidade de espuma.", arrow: true },
      { label: "Sequenciamento de OPs", description: "Disparar a fila de ordens otimizada para as máquinas." }
    ],
    practicalExample: "Uma fábrica reduziu em 30% os atrasos de entrega ao agrupar a costura de tecidos por cor (claros de manhã, escuros à tarde), eliminando a necessidade de trocar constantemente a linha de costura nas bobinas.",
    systemApplication: "No Allin-SO, o PCP utiliza quadros interativos de sequenciamento (Gantt ou Kanban) para arrastar e soltar ordens nas máquinas, enxergando gargalos em tempo real.",
    commonErrors: [
      "Sequenciar ordens sem verificar a disponibilidade de matérias-primas no estoque, gerando ordens travadas na linha.",
      "Liberar OPs com base na capacidade máxima sem deduzir tempos de manutenção preventiva programada."
    ],
    summary: [
      "O PCP é o cérebro que harmoniza vendas e produção física.",
      "Agrupar ordens por similaridade (tamanho, cor) minimiza setups caros.",
      "Acompanhar a carga máquina impede promessas de prazos de entrega impossíveis."
    ],
    quiz: {
      questions: [
        {
          id: "q19_1",
          text: "O que é o 'Setup de Máquina' em uma indústria?",
          options: [
            "O processo de desligar e reiniciar os computadores de escritório.",
            "O tempo de preparação e ajustes necessários para configurar uma máquina para passar a produzir um produto diferente do que estava fazendo.",
            "A limpeza diária do chão da fábrica.",
            "O faturamento mensal total gerado pela máquina."
          ],
          correctAnswerIndex: 1,
          explanation: "Setup é o intervalo de tempo em que a máquina fica parada para troca de gabaritos, ferramentas ou materiais para mudar de modelo produtivo."
        },
        {
          id: "q19_2",
          text: "Por que o PCP deve agrupar ordens de produção de colchões de mesma densidade de espuma na serra de corte?",
          options: [
            "Porque os colchões mais macios são mais bonitos.",
            "Para minimizar trocas de blocos mãe de espuma nas serras e setups de espessura de corte, aumentando o tempo produtivo líquido da máquina.",
            "Porque as costureiras preferem trabalhar assim.",
            "Para reduzir a velocidade da empilhadeira."
          ],
          correctAnswerIndex: 1,
          explanation: "Agrupar por densidade e tamanhos reduz setups na serra de espuma, permitindo que a lâmina corte continuamente lotes inteiros de forma ágil."
        }
      ]
    },
    exercise: {
      type: 'pcp_sequencing',
      title: "Desafio de Sequenciamento de OPs",
      instruction: "Ordene 3 ordens de produção na máquina de quilting para minimizar o tempo de troca de linha (setup). Sabendo que trocar de linha clara para linha escura demora 30 minutos, e entre tons claros demora 5 minutos.",
      data: {
        orders: [
          { id: "OP1", name: "Colchão Branco Luxo", color: "Claro" },
          { id: "OP2", name: "Colchão Grafite Dark", color: "Escuro" },
          { id: "OP3", name: "Colchão Bege Soft", color: "Claro" }
        ]
      },
      successCondition: (answer: string[]) => {
        const correct1 = answer[0] === "OP1" && answer[1] === "OP3" && answer[2] === "OP2";
        const correct2 = answer[0] === "OP3" && answer[1] === "OP1" && answer[2] === "OP2";
        const isCorrect = correct1 || correct2;
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Sequenciamento excelente! Agrupando as OPs Claras (Branco e Bege) e deixando a Escura (Grafite) por último, você reduziu um setup de 30 minutos para apenas 5 minutos!" 
            : "Sequenciamento ineficiente. Você colocou uma OP escura no meio das claras, forçando o operador a trocar de linha duas vezes (clara -> escura -> clara), perdendo 1 hora de produção!"
        };
      }
    }
  },
  {
    id: 20,
    title: "Custos Industriais",
    objective: "Compreender como o custo de fabricação de um colchão é formado, dominando a composição de materiais, mão de obra e custos indiretos.",
    concepts: [
      {
        title: "Composição de Custo Industrial",
        description: "O custo fabril é composto por: Matérias-Primas Diretas (BOM), Mão de Obra Direta (MOD - tempo de operador x valor hora) e Custos Indiretos de Fabricação (CIF - energia, depreciação de máquinas, ferramentas)."
      },
      {
        title: "Depreciação de Ativos",
        description: "Cada minuto que uma serra ou máquina de quilting opera, ela sofre desgaste. Esse custo de depreciação deve ser diluído no custo unitário de cada colchão para viabilizar futuras trocas de maquinário."
      }
    ],
    illustratedExplanation: "Na colchoaria, a espuma representa até 60% do custo de um colchão básico. Se a densidade sair acima da especificação por erro de processo, o colchão consome mais quilos de poliuretano, corroendo a margem de lucro de vendas.",
    flowchartSteps: [
      { label: "Custo de MP", description: "Soma das quantidades de tecido, espuma e cola consumidas.", arrow: true },
      { label: "Custo de MOD", description: "Tempo de costura e montagem multiplicado pela taxa horária.", arrow: true },
      { label: "Custo de CIF", description: "Taxa de energia do compressor + depreciação da máquina.", arrow: true },
      { label: "Custo Unitário Total", description: "Base para o comercial definir o preço de venda saudável." }
    ],
    practicalExample: "Um colchão Casal Pocket custa R$ 600 em MP, R$ 50 em MOD (tempo dos postos) e R$ 50 em CIF. O custo total é R$ 700. Se o comercial vende o colchão por R$ 680 em uma promoção sem olhar o sistema, a fábrica tem prejuízo real.",
    systemApplication: "No Allin-SO, a engenharia calcula o custo estimado ideal do colchão, e os apontamentos de produção e consumo real de lote revelam o custo real. O desvio entre o estimado e o real é mostrado em painéis de análise.",
    commonErrors: [
      "Ignorar o custo de energia elétrica e manutenção das máquinas no cálculo de formação de preço de venda.",
      "Não registrar sobras de refugo de corte de tecido, acreditando que o custo do tecido consumido foi menor do que o real."
    ],
    summary: [
      "O custo do colchão é a soma de materiais, pessoas e infraestrutura utilitária.",
      "Reduzir refugo e tempo de setup diminui diretamente o custo real de transformação.",
      "O sistema ajuda a identificar quais produtos dão lucro e quais estão gerando prejuízos ocultos."
    ],
    quiz: {
      questions: [
        {
          id: "q20_1",
          text: "Quais são as três grandes categorias que compõem o Custo de Fabricação de um produto industrial?",
          options: [
            "Custo de marketing, comissão de vendedores e frete marítimo.",
            "Matéria-Prima Direta, Mão de Obra Direta (MOD) e Custos Indiretos de Fabricação (CIF).",
            "Imposto sobre o lucro, taxas de cartório e almoço executivo.",
            "Multas de trânsito, seguros de frota e brindes de fim de ano."
          ],
          correctAnswerIndex: 1,
          explanation: "Essas três variáveis cobrem os insumos constituintes, o tempo das pessoas transformadoras e os custos operacionais da infraestrutura de fábrica."
        },
        {
          id: "q20_2",
          text: "O que representa o 'Desvio de Custo' (Custo Estimado vs Custo Real) no Allin-SO?",
          options: [
            "A velocidade do faturamento de notas.",
            "A diferença entre o custo projetado na engenharia (BOM e tempos padrão) e o custo de fato registrado pelos operadores nos apontamentos de consumo real e tempos de turno.",
            "O valor das ações da empresa na bolsa.",
            "O tempo gasto pela manutenção para consertar compressores."
          ],
          correctAnswerIndex: 1,
          explanation: "Se a fábrica gasta mais cola ou leva mais tempo para produzir do que o previsto na engenharia, o custo real sobe, reduzindo o lucro estimado."
        }
      ]
    },
    exercise: {
      type: 'cost_calculation',
      title: "Desafio de Formação de Custos",
      instruction: "Calcule o custo fabril total de um colchão de espuma com as seguintes informações: Insumos (BOM) = R$ 400. Mão de obra (MOD) = R$ 50. Custos de infraestrutura (CIF) = R$ 30.",
      data: {
        mp: 400,
        mod: 50,
        cif: 30
      },
      successCondition: (answer: number) => {
        const correct = answer === 480;
        return {
          success: correct,
          feedback: correct 
            ? "Perfeito! O custo de fabricação total é de R$ 480. Qualquer preço de venda abaixo disso gera prejuízo à fábrica!" 
            : "Erro no somatório. Some os insumos (400), mão de obra (50) e custos indiretos (30)."
        };
      }
    }
  },
  {
    id: 21,
    title: "Indicadores Industriais",
    objective: "Aprender a calcular e interpretar os principais indicadores de desempenho (KPIs) com foco no OEE (Eficiência Global do Equipamento).",
    concepts: [
      {
        title: "Indicadores Industriais (KPIs)",
        description: "Métricas que guiam as decisões dos gestores: Lead Time (tempo de entrega), Scrap/Refugo (desperdício de materiais) e OEE (Eficiência de Máquina)."
      },
      {
        title: "Cálculo do OEE",
        description: "OEE = Disponibilidade x Performance x Qualidade. Disponibilidade: tempo produzindo / tempo planejado. Performance: velocidade real / velocidade ideal. Qualidade: peças boas / peças totais produzidas."
      }
    ],
    illustratedExplanation: "Se uma máquina de bordar colchões planejou rodar por 8 horas, mas ficou parada 2 horas por quebra (Disponibilidade = 75%). Quando rodou, operou a 80% da sua velocidade ideal (Performance = 80%). Das peças bordadas, 10% tinham defeito e foram refeitas (Qualidade = 90%). OEE = 0.75 x 0.80 x 0.90 = 54%.",
    flowchartSteps: [
      { label: "Tempo de Disponibilidade", description: "Tempo que a máquina esteve rodando fisicamente.", arrow: true },
      { label: "Ritmo de Performance", description: "Velocidade em que a máquina produziu em relação à meta.", arrow: true },
      { label: "Taxa de Qualidade", description: "Percentual de produtos que saíram perfeitos de primeira.", arrow: true },
      { label: "OEE Consolidado", description: "Eficiência real global do ativo industrial." }
    ],
    practicalExample: "Uma colchoaria achava que precisava comprar uma nova máquina de costura de R$ 150.000 porque não dava conta dos pedidos. Ao medir o OEE, descobriu que o OEE da máquina atual era de apenas 42% por falta de material na linha. Ajustou-se o fluxo de abastecimento, o OEE subiu para 78% e a compra foi cancelada, economizando capital.",
    systemApplication: "No Allin-SO, todos os apontamentos alimentam painéis gráficos que calculam o OEE por máquina, setor ou turno de forma instantânea.",
    commonErrors: [
      "Calcular o OEE incluindo os tempos em que a fábrica estava fechada ou sem demanda planejada, distorcendo a eficiência operacional real.",
      "Lançar tempos fictícios de apontamento para fazer o OEE de um setor parecer artificialmente maior."
    ],
    summary: [
      "OEE é o indicador supremo da eficiência de manufatura.",
      "Medir perdas é o primeiro passo para eliminá-las.",
      "Indicadores reais de chão de fábrica evitam investimentos desnecessários em novas máquinas."
    ],
    quiz: {
      questions: [
        {
          id: "q21_1",
          text: "Como é composto o cálculo do indicador OEE (Overall Equipment Effectiveness)?",
          options: [
            "Faturamento x Custos x Lucro líquido.",
            "Disponibilidade x Performance x Qualidade.",
            "Horas trabalhadas + Quantidade de costureiras.",
            "Quantidade de máquinas x Distância percorrida."
          ],
          correctAnswerIndex: 1,
          explanation: "O OEE multiplica os três pilares de eficiência: o tempo produtivo disponível, a velocidade de ciclo real e o aproveitamento de primeira das peças com qualidade."
        },
        {
          id: "q21_2",
          text: "Se uma máquina de colagem opera 100% do tempo planejado (Disponibilidade = 100%), no ritmo padrão estimado (Performance = 100%), mas metade dos colchões colados saem com bolhas e são reprovados (Qualidade = 50%), qual será o OEE deste ativo?",
          options: [
            "100%",
            "250%",
            "50%",
            "0%"
          ],
          correctAnswerIndex: 2,
          explanation: "OEE = 1.00 x 1.00 x 0.50 = 50%. De nada adianta produzir rápido e sem paradas se metade das peças são refugadas por falta de qualidade."
        }
      ]
    },
    exercise: {
      type: 'oee_calculator',
      title: "Desafio de Cálculo de OEE",
      instruction: "Calcule o OEE de uma prensa de embalagem sabendo que seus pilares operacionais de turno foram medidos em: Disponibilidade = 80% (0.80). Performance = 90% (0.90). Qualidade = 100% (1.00).",
      data: {
        disp: 0.80,
        perf: 0.90,
        qual: 1.00
      },
      successCondition: (answer: number) => {
        // answer can be in percentage (72) or decimal (0.72)
        const correct = answer === 72 || answer === 0.72;
        return {
          success: correct,
          feedback: correct 
            ? "Cálculo excelente! O OEE consolidado da prensa é de 72%. Uma excelente taxa que indica um ativo muito saudável!" 
            : "Cálculo incorreto. Multiplique as três taxas: 0.80 x 0.90 x 1.00 = 0.72 (ou 72%)."
        };
      }
    }
  },
  {
    id: 22,
    title: "Inteligência Artificial Industrial",
    objective: "Compreender o papel do Copilot Industrial na interpretação de dados estruturados para tomada de decisões estratégicas e otimização de gargalos.",
    concepts: [
      {
        title: "A IA não cria dados, ela interpreta",
        description: "A Inteligência Artificial do Allin-SO depende da acuracidade dos cadastros e apontamentos humanos para gerar valor. Se a fábrica lançar lixo, a IA gerará análises inúteis ('Garbage In, Garbage Out')."
      },
      {
        title: "Capacidades do Copilot",
        description: "O Copilot Industrial cruza estoques, OEE, RNCs de qualidade e ordens de produção para prever atrasos, sugerir sequenciamentos ideais de PCP e alertar sobre anomalias em máquinas antes que quebrem."
      }
    ],
    illustratedExplanation: "O Copilot Industrial analisa o banco de dados. Ele nota que o tampo de malha importada está demorando 45 dias para chegar (compras) e o estoque está no fim. Ele gera um alerta sugerindo a substituição preventiva por tecido nacional nas próximas OPs.",
    flowchartSteps: [
      { label: "Dados do Chão de Fábrica", description: "Apontamentos de OEE, perdas e estoques em tempo real.", arrow: true },
      { label: "Análise do Copilot", description: "Algoritmos cruzam os dados industriais continuamente.", arrow: true },
      { label: "Insights Preditivos", description: "Previsões de gargalos ou alertas de preventivas atrasadas.", arrow: true },
      { label: "Decisão do Gestor", description: "Ação rápida recomendada para evitar paradas e perdas de margem." }
    ],
    practicalExample: "O Copilot enviou uma notificação: 'Atenção, o OEE do CT Tape Edge caiu 15% nos últimos 3 dias por paradas descritas como Falta de Fitilho. Verifique o estoque físico do Fitilho Branco ou a velocidade de separação do almoxarifado'. O supervisor verificou e viu que o carrinho de abastecimento estava quebrado.",
    systemApplication: "No Allin-SO, você pode conversar por chat com o Copilot Industrial a qualquer momento para pedir relatórios, fazer perguntas operacionais complexas, ou pedir sugestões de sequenciamento de lote.",
    commonErrors: [
      "Esperar que o Copilot resolva os problemas da fábrica sozinho sem que a equipe operacional tome as ações físicas recomendadas.",
      "Acreditar que a IA está errada quando ela alerta sobre desvios de custo, em vez de auditar as fichas técnicas (BOMs) desatualizadas no sistema."
    ],
    summary: [
      "A IA Industrial é uma ferramenta de apoio à decisão, não um substituto do cérebro humano.",
      "Sua eficiência é proporcional à precisão dos dados inseridos diariamente por operadores e PCP.",
      "O Copilot traduz milhões de linhas de log e apontamento em decisões simples, claras e geradoras de lucro."
    ],
    quiz: {
      questions: [
        {
          id: "q22_1",
          text: "O que acontece se os operadores realizarem apontamentos de produção e perdas errados ou incompletos no Allin-SO?",
          options: [
            "O Copilot corrigirá os dados físicos de forma mágica.",
            "As análises, recomendações e previsões geradas pelo Copilot serão imprecisas ou erradas, prejudicando a gestão da fábrica ('Garbage In, Garbage Out').",
            "O custo do colchão ficará mais barato de qualquer forma.",
            "O faturamento mensal dobrará automaticamente."
          ],
          correctAnswerIndex: 1,
          explanation: "A qualidade das respostas da IA é diretamente dependente da integridade e veracidade dos dados inseridos na plataforma."
        },
        {
          id: "q22_2",
          text: "Qual das seguintes tarefas descreve uma ação útil ideal realizada pelo Copilot Industrial?",
          options: [
            "Costurar fisicamente o fitilho nas bordas do colchão.",
            "Analisar o histórico de OEE e alertar sobre tendências de queda na velocidade das serras, prevendo quebras imprevistas.",
            "Limpar as mesas de colagem ao final do expediente.",
            "Comprar matérias-primas por conta própria sem autorização."
          ],
          correctAnswerIndex: 1,
          explanation: "A IA analisa tendências complexas nos dados para munir o gestor de alertas preditivos que protegem a fábrica de quebras e atrasos dispendiosos."
        }
      ]
    },
    exercise: {
      type: 'copilot_analysis',
      title: "Desafio de Decisão com IA",
      instruction: "O Copilot detectou que a prensa Roll-pack está com OEE muito baixo por paradas frequentes por falta de bobina plástica na expedição, enquanto o almoxarifado aponta saldo de plástico zerado. Qual decisão você deve tomar?",
      data: {
        insights: [
          "Disparar um pedido de compras de bobina plástica urgente e revisar o ponto de ressuprimento deste insumo no sistema.",
          "Ignorar o alerta do Copilot e continuar produzindo colchões sem embalar.",
          "Diminuir a velocidade da serra de corte de espuma para compensar."
        ]
      },
      successCondition: (answer: string) => {
        const isCorrect = answer.includes("compras") || answer.includes("ressuprimento");
        return {
          success: isCorrect,
          feedback: isCorrect 
            ? "Espetacular! Você ouviu o insight do Copilot e agiu na causa raiz: comprou bobina plástica emergencial e revisou a regra de reabastecimento para que isso nunca mais ocorra!" 
            : "Resposta ineficiente. Se você continuar produzindo sem plásticos para embalar, os colchões prontos sujarão na expedição e as entregas travarão!"
        };
      }
    }
  }
];
