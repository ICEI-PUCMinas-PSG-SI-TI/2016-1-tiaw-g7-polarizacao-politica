# Despolariza – Chat

**Aluno:** Guilherme Matheus Araujo
**Grupo:** G7
**Funcionalidade:** Chat
**Disciplina:** Trabalho Interdisciplinar – ICEI PUC Minas


## Descrição

Página de chat para o site **Despolariza**, um projeto voltado ao combate à polarização política por meio de informação equilibrada.

A funcionalidade inclui:

- Navbar com links de navegação e campo de pesquisa
- Sidebar com avatar do usuário e histórico de conversas
- Tela inicial com ícone, campo de mensagem e sugestões de tópicos
- Barra de input na parte inferior para envio de mensagens
- Desenvolvido em **HTML e CSS puro, sem JavaScript**


## Como Executar

1. Abra a pasta do projeto
2. Clique duas vezes em `chat.html`
3. O site abrirá no navegador

### Opção 2 – Usando Live Server (VS Code)

1. Instale a extensão **Live Server** no VS Code
2. Clique com botão direito em `chat.html`
3. Selecione **"Open with Live Server"**



## Estrutura de Arquivos

/Prototipo
WIRE_FRAME.png
/Site e Funcinalidades
chat.html
README.md
respostas.json
style.css
/imagens 
chat_despolariza.png  → Imagem do nome na navbar (inserir manualmente)
logo_despolariza.png         → Ícone do chat na tela inicial (inserir manualmente)             → Este arquivo


## Fluxo da Tela

chat.html
Navbar, links de navegação e pesquisa
Sidebar, avatar do usuário e histórico de conversas
Área principal → tela de boas-vindas com campo de mensagem



## Como Executar

### Opção 1 – Abrir direto no navegador (mais simples)

1. Abra a pasta do projeto
2. Clique duas vezes em `index.html` para acessar o login
3. Clique duas vezes em `chat.html` para visualizar a tela de chat

> Os dados dos usuários são salvos no `localStorage` do navegador (apenas nas telas de login e cadastro).

### Opção 2 – Usando Live Server (VS Code)

1. Instale a extensão **Live Server** no VS Code
2. Clique com botão direito em `index.html` ou `chat.html`
3. Selecione **"Open with Live Server"**





## Estrutura de Dados (JSON)
json
{
  "chat": [
    {
      "id": 1,
      "usuario": "Guilherme",
      "mensagem": "O que é polarização política?",
      "resposta": "É a divisão de opiniões entre grupos com visões opostas.",
      "data": "2026-04-19 19:00"
    },
    {
      "id": 2,
      "usuario": "Guilherme",
      "mensagem": "Como identificar fake news?",
      "resposta": "Verificando a fonte, comparando com outras informações e analisando o conteúdo.",
      "data": "2026-04-19 19:02"
    }
  ]
}

## Fluxo de Navegação

chat.html (Chat – HTML/CSS puro)
1. Acessível diretamente pelo navegador


## Sobre o Chat

A tela `chat.html` foi desenvolvida em **HTML e CSS**, Ela contempla:

- Navbar com logo, links de navegação e campo de pesquisa
- Sidebar com avatar do usuário e histórico de conversas
- Área principal com tela de boas-vindas (estado vazio) e exemplo de mensagens
- Campo de entrada de texto estilizado
- Alternância entre "Tela inicial" e "Com mensagens" via CSS (`radio input` + seletor `:checked`)
