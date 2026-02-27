// data.js
// Edite aqui: nomes de cursos, notas e trilhas.

window.PUD_DATA = {
  criancas: {
    label: "Crianças",
    description: "Trilhas pensadas para introdução criativa e desenvolvimento de habilidades.",
    areas: {
      audiovisual: {
        label: "Audiovisual",
        accentClass: "accent-audiovisual",
        lanes: [
          {
            label: "Animação e criação",
            steps: [
              { title: "Stopmotion", note: "Introdução prática à animação quadro a quadro." }
            ]
          }
        ]
      },
      design: {
        label: "Design e Marketing",
        accentClass: "accent-design",
        lanes: [
          {
            label: "Criação visual",
            steps: [
              { title: "Ilustração Digital", note: "Desenho e composição em ambiente digital." },
              { title: "Criação 3D", note: "Modelagem e criação tridimensional introdutória." }
            ]
          }
        ]
      },
      prog: {
        label: "Programação e Games",
        accentClass: "accent-prog",
        lanes: [
          {
            label: "Fundamentos e robótica",
            steps: [
              { title: "Lógica de Programação", note: "Base para pensamento computacional." },
              { title: "Robótica com Arduino", note: "Exploração prática de sensores e automação." },
              { title: "Robótica para o OBR", note: "Preparação e projetos orientados a desafios." }
            ]
          },
          {
            label: "Criação de jogos",
            steps: [
              { title: "Universo Roblox", note: "Criação e experimentação em plataforma de jogos." }
            ]
          }
        ]
      }
    }
  },

  jovens_adultos: {
    label: "Jovens e Adultos",
    description: "Trilhas para aprofundamento técnico, portfólio e projetos aplicados.",
    areas: {
      audiovisual: {
        label: "Audiovisual",
        accentClass: "accent-audiovisual",
        lanes: [
          {
            label: "Cinema (sequência por módulos)",
            steps: [
              { title: "Fundamentos do Cinema Módulo 1", note: "Introdução ao audiovisual e linguagem." },
              { title: "Fundamentos do Cinema Módulo 2", note: "Aprofundamento em narrativa e prática." },
              { title: "Fundamentos do Cinema Módulo 3", note: "Projeto e consolidação de técnicas." }
            ]
          },
          {
            label: "Fotografia (progressão por níveis)",
            steps: [
              { title: "Fotografia em Estúdio 1", note: "Luz básica, enquadramento e prática." },
              { title: "Fotografia em Estúdio 2", note: "Controle de luz e direção." },
              { title: "Fotografia em Estúdio 3", note: "Ensaios e resultados avançados." },
              { title: "Fotografia Externa", note: "Luz natural, locação e narrativa visual." }
            ]
          },
          {
            label: "Set e operação",
            steps: [
              { title: "Assistente de Câmera", note: "Rotina de set, apoio e organização técnica." }
            ]
          }
        ]
      },

      design: {
        label: "Design e Marketing",
        accentClass: "accent-design",
        lanes: [
          {
            label: "Pacote Adobe (trilha por ferramentas)",
            steps: [
              { title: "Pacote Adobe - Illustrator", note: "Vetores, identidade visual e layout." },
              { title: "Pacote Adobe - Photoshop", note: "Edição, composição e tratamento." },
              { title: "Pacote Adobe - InDesign", note: "Diagramação e materiais editoriais." },
              { title: "Pacote Adobe - Lightroom", note: "Fluxo de edição e organização fotográfica." }
            ]
          }
        ]
      },

      prog: {
        label: "Programação e Games",
        accentClass: "accent-prog",
        lanes: [
          {
            label: "Criação de jogos (do conceito ao produto)",
            steps: [
              { title: "Narrativas RPG", note: "Construção de mundos, personagens e progressão." },
              { title: "Construção de Jogo de Tabuleiro", note: "Mecânicas, regras e prototipagem." },
              { title: "Construção de Jogos para Celulares", note: "Design e desenvolvimento para mobile." }
            ]
          },
          {
            label: "Dados e ferramentas",
            steps: [
              { title: "Análise de Dados com Python Módulo 1", note: "Introdução a dados com Python." },
              { title: "Análise de Dados com Python Módulo 2", note: "Aprofundamento e prática aplicada." },
              { title: "Universo das API's", note: "Integrações e consumo de dados." },
              { title: "PowerBI", note: "Dashboards e visualização de dados." }
            ]
          }
        ]
      }
    }
  },

  seniors: {
    label: "Seniors",
    description: "Espaço reservado para trilhas específicas. Você pode preencher os cursos aqui.",
    areas: {
      audiovisual: { label: "Audiovisual", accentClass:"accent-audiovisual", lanes: [] },
      design:      { label: "Design e Marketing", accentClass:"accent-design", lanes: [] },
      prog:        { label: "Programação e Games", accentClass:"accent-prog", lanes: [] }
    }
  },

  nivelamento: {
    label: "Nivelamento",
    description: "Cursos de entrada e revisão para preparar participantes para trilhas avançadas.",
    areas: {
      audiovisual: { label: "Audiovisual", accentClass:"accent-audiovisual", lanes: [] },
      design:      { label: "Design e Marketing", accentClass:"accent-design", lanes: [] },
      prog:        { label: "Programação e Games", accentClass:"accent-prog", lanes: [] }
    }
  }
};

window.PUD_AREA_LABEL = {
  audiovisual: "Audiovisual",
  design: "Design e Marketing",
  prog: "Programação e Games"
};