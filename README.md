<div align='center'>

<a href='https://eloy-ai.vercel.app/'>
    <img src='./src/assets/img/logo.png' width='300px'>
</a>
</div>

[eloy.com](https://eloy-ai.vercel.app/)

| email | senha |
| :--- | :--- |
| teste@fiap.com.br | teste123 |

## 🎯 Contexto e Proposta de Valor (Global Solution FIAP)

O *eloy* é uma solução estratégica desenvolvida no contexto da *Global Solution* do curso de Engenharia de Software da FIAP. A plataforma nasce como uma resposta inovadora à crise global de engajamento e ao desafio de manter a **conexão humana* em ambientes de trabalho cada vez mais remotos e digitalizados.

Nossa proposta de valor central é transformar o ambiente corporativo em um *ecossistema social inteligente, onde o acesso ao conhecimento e o reconhecimento mútuo são facilitados pela **Inteligência Artificial. O eloy não é apenas um software, mas um **movimento* que visa resgatar a dimensão humana do trabalho, fomentando o *pertencimento* e o *engajamento autêntico*.

> "A grande transição não é tecnológica; é o resgate da alma humana dentro da máquina corporativa." - Análise de Cenário (Proposta eloy)

## ✨ Arquitetura e Pilares Estratégicos

A plataforma eloy está estruturada em três pilares interconectados, garantindo uma solução holística para a cultura organizacional:

| Pilar Estratégico | Objetivo Principal | Componentes Chave | Impacto Estratégico Detalhado |
| :--- | :--- | :--- | :--- |
| *1. Conexão e Pertencimento* | Fomentar uma rede social interna vibrante e saudável. | Feed de notícias, perfis de usuário detalhados, funcionalidades de interação social (curtir, comentar, compartilhar). | Redução do isolamento e da comunicação deficiente, aumento da satisfação e da retenção de talentos. |
| *2. Conhecimento e Aprendizado* | Democratizar o acesso ao conhecimento corporativo e promover o desenvolvimento contínuo. | *IA Conversacional (eloy), microtreinamentos personalizados, sugestão de cursos internos, FAQ inteligente. | Aceleração do *onboarding, redução do tempo de busca por informações e criação de uma cultura de aprendizado contínuo. |
| *3. Reconhecimento e Influência* | Valorizar o protagonismo e o espírito colaborativo de forma transparente. | Sistema de recomendação e badges de reconhecimento, *Ranking de Influência* gamificado, painel de reputação. | Conversão do engajamento emocional em métricas de performance, motivação e retenção de colaboradores de alto valor. |

## 💻 Detalhamento Técnico (Frontend)

Este repositório é dedicado ao desenvolvimento do *Frontend* da plataforma eloy, que se destaca pela sua modernidade, performance e escalabilidade.

### Stack Tecnológica Principal

| Categoria | Tecnologia | Versão | Justificativa Técnica |
| :--- | :--- | :--- | :--- |
| *Framework* | *React* | 19.2.0 | Escolhido pela sua arquitetura baseada em componentes, que facilita a modularidade, reusabilidade e manutenção do código. A versão 19 garante acesso às últimas otimizações de performance e recursos de concorrência. |
| *Build Tool* | *Vite* | 7.2.2 | Utilizado para o empacotamento e servidor de desenvolvimento. O Vite oferece uma experiência de desenvolvimento extremamente rápida (Hot Module Replacement - HMR) e otimiza o build de produção, resultando em carregamento mais veloz para o usuário final. |
| *Estilização* | *Tailwind CSS* | 4.1.17 | Framework utility-first que permite a criação de designs responsivos e complexos de forma ágil e consistente, minimizando a necessidade de escrever CSS customizado e garantindo a uniformidade do design system. |
| *Roteamento* | *React Router DOM* | 7.9.5 | Essencial para a navegação SPA (Single Page Application), permitindo transições fluidas entre as diferentes telas da plataforma sem recarregamento total da página. |

### Estrutura de Diretórios e Componentização

A organização do código segue o princípio de *separação de preocupações* e *componentização atômica*, facilitando a colaboração e a escalabilidade:


Gs-Front-Web/
├── src/
│   ├── assets/             # Mídia estática (imagens, ícones, fontes)
│   ├── components/
│   │   ├── ui/             # Componentes de UI de baixo nível (e.g., Botão, Card, Input)
│   │   ├── shared/         # Componentes de layout e estrutura (e.g., Header, Sidebar, Footer)
│   │   └── features/       # Componentes complexos que encapsulam lógica de negócio (e.g., FeedPost, ChatInterface)
│   ├── css/                # Arquivos de CSS globais e de utilidade
│   ├── hook/               # Lógica de estado e efeitos reutilizável (e.g., useAuth, useRanking)
│   ├── routes/             # Componentes de página/rota, responsáveis por orquestrar os componentes menores
│   ├── main.jsx            # Inicialização do React e configuração do roteador
│   └── App.jsx             # Definição das rotas principais
├── package.json            # Gerenciamento de dependências
└── vite.config.js          # Configuração do ambiente de desenvolvimento e build


### Módulos e Rotas Implementadas

O protótipo funcional já cobre as principais áreas da plataforma, conforme evidenciado pelos módulos de rota:

| Rota | Módulo (.jsx) | Funcionalidade Principal |
| :--- | :--- | :--- |
| / | Welcome | Página de boas-vindas e introdução à plataforma. |
| /auth | Auth | Fluxo de autenticação (Login/Cadastro) via e-mail corporativo. |
| /feed | Feed | O coração da rede social, exibindo o conteúdo e as interações dos colegas. |
| /profile | Profile | Visualização e edição do perfil do usuário, incluindo habilidades e experiências. |
| /chat | Chat | Interface de conversação com a *IA eloy* para consultas e aprendizado. |
| /ranking | Ranking | Exibição do *Ranking de Influência* e métricas de reconhecimento. |
| /settings | Settings | Área de configurações e preferências do usuário. |
| /publish | Publish | Interface para criação e publicação de novo conteúdo no feed. |

## 🛠 Guia de Instalação e Execução

Para configurar e rodar o projeto em seu ambiente local, siga as instruções abaixo.

### Pré-requisitos

*   *Node.js* (versão 18 ou superior)
*   *npm* (gerenciador de pacotes recomendado) ou yarn

### 1. Clonagem do Repositório

bash
git clone https://github.com/Gs-FIAP-eloy/Gs-Front-Web.git
cd Gs-Front-Web


### 2. Instalação de Dependências

bash
npm install
# Alternativamente: npm install ou yarn install


### 3. Execução do Servidor de Desenvolvimento

bash
npm run dev
# Alternativamente: npm run dev ou yarn dev


O projeto será iniciado em modo de desenvolvimento, acessível em http://localhost:5173.

## 🤝 Equipe de Desenvolvimento

Este projeto foi concebido e desenvolvido pelos seguintes membros da equipe:

| Nome Completo | Registro Acadêmico (RM) | Função Principal |
| :--- | :--- | :--- |
| *Leonardo Silva* | RM 564929 | Desenvolvedor Frontend |
| *Samuel Monteiro* | RM 564391 | Especialista em UX/UI |
| *Lucas Toledo* | RM 563271 | Desenvolvedor Backend |