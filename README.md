# Informações do Projeto
`Site Despolariza`  

Trabalho Interdisciplinar - Aplicacões Web

`Sistema de Informacao e Analise e Desenvolvimento de Sistemas`

`1º SEMESTRE`

## Participantes

Os membros do grupo são: 
- Karolina Carvalho Soares Martins
- Guilherme Matheus Araujo
- André Henrique Braga DIas
- Rubens de Moura Arquina Oliveira
- Marcelo Henrique Soares SIlva
  

> Inclua a lista dos membros da equipe com seus nomes completos.

# Estrutura do Projeto

1. [Contexto](./docs/1-Contexto.md)
2. [Especificações do Projeto](./docs/2-Especificação.md)
3. [Projeto da Interface](./docs/3-Interface.md)
4. [Gerenciamento do Projeto](./docs/4-Gerenciamento-Projeto.md)
5. [Implementação](./docs/5-Implementação.md)
6. [Referências](./docs/8-Referências.md)
7. [Apresentação do trabalho](./docs/apresentacao) 



## Pasta docs

Esta pasta arquiva a documentação dos projetos.


Na pasta `docs`, há uma subpasta `images` que deve arquivar todas as
imagens utilizadas para a elaboração do documento.


## Pasta src

Este diretório armazena o código fonte do projeto e adota uma hierarquia
básica de projetos Web simples, que utilizam as tecnologias HTML, CSS e
JavaScript.

### Links Úteis:

Aprenda Markdown e use-o para documentar o projeto  

> [Sintaxe básica de gravação e formatação no GitHub](https://guides.github.com/features/mastering-markdown/)

> [Suporte Github](https://help.github.com/pt/github/writing-on-github/getting-started-with-writing-and-formatting-on-github)

**Metodologia**

Ferramentas

**Guilherme Matheus Araujo - Chat IA e Recohecimento de Voz**

**Justificativa** 

**SPRINT 1**

**Conexão direta com o tema:** um chat de IA permite simular um "mediador" neutro, capaz de apresentar diferentes pontos de vista sobre temas polarizados sem tomar partido, ajudando o usuário a refletir em vez de reforçar uma bolha de opinião.

**Engajamento do usuário:** uma interface conversacional é mais convidativa e interativa do que um site estático com textos informativos, aumentando o tempo de uso e a chance de o usuário realmente refletir sobre o conteúdo.

**SPRINT 2**

**Acessibilidade:** permite que pessoas com dificuldade de digitação, idosos ou usuários com deficiência visual/motora também consigam interagir com o chat, ampliando o alcance da ferramenta de combate à polarização.

**Naturalidade na interação:** falar é mais natural do que digitar para muitos usuários, o que pode tornar a experiência de "conversar sobre política" mais parecida com um diálogo real, reduzindo a barreira de iniciar a conversa.

**Editor de Código**
Visual Studio Code (VS Code) — utilizado para escrever e organizar todo o código do projeto (HTML, CSS e JavaScript). Escolhido pela leveza, extensões úteis (como Live Server para visualização em tempo real) e por ser amplamente adotado no desenvolvimento web, facilitando o trabalho colaborativo entre os membros do grupo.

**Ferramentas de Comunicação**
Discord — usado para comunicação entre os integrantes do grupo, alinhamento de tarefas, dúvidas rápidas e organização das sprints. Escolhido por permitir conversas em tempo real, criação de canais separados por assunto e fácil compartilhamento de arquivos/links durante o desenvolvimento.

**Ferramentas de Diagramação/Prototipação**
Figma — utilizado na Sprint 1 para a criação do wireframe da interface do chat. Escolhido por ser uma ferramenta colaborativa online, que permite que vários membros visualizem e comentem o protótipo antes da implementação, evitando retrabalho no código.

**Plataformas de Hospedagem e Controle de Versão**
GitHub — utilizado para versionamento do código e hospedagem do repositório do projeto, permitindo o trabalho colaborativo entre os membros do grupo, controle de branches e histórico de alterações.

**APIs e Recursos Externos**
API do Gemini (Google) — integrada na Sprint 1 para implementar o chat com inteligência artificial, responsável por gerar as respostas automáticas relacionadas ao tema de despolarização política. Escolhida por oferecer um modelo de linguagem gratuito/acessível e de fácil integração via requisições HTTP.
Web Speech API (API de reconhecimento de voz do navegador) — adicionada na Sprint 2 para permitir que o usuário interaja com o chat por voz. Escolhida por ser nativa dos navegadores modernos, dispensando bibliotecas externas e mantendo o projeto simples (sem dependências adicionais).



**Karolina Carvalho Soares Martins - Home-Page com Notícias e Sistema de Comentários**

Justificativa

**SPRINT 1**

Diversidade de fontes visível logo na entrada: o carrossel de destaques e a grade de notícias permitem mostrar, lado a lado, diferentes manchetes e ângulos sobre o mesmo tema, reforçando visualmente a proposta central do projeto — expor o usuário a múltiplas perspectivas, e não a uma bolha única.
Leitura sem fricção: o modal com a notícia completa (data, autor, fonte, resumo e conteúdo) evita que o usuário precise sair do site para ler mais, mantendo-o no ambiente controlado do Despolariza em vez de buscar informação em fontes não verificadas.

**SPRINT 2**

Senso de comunidade e debate saudável: o sistema de comentários permite que os usuários troquem pontos de vista sobre a mesma notícia dentro do próprio site, incentivando o diálogo direto em vez do compartilhamento isolado em grupos fechados, como o WhatsApp.
Curadoria coletiva pela avaliação: o sistema de estrelas (com cálculo de média em tempo real) dá ao leitor uma noção rápida da percepção geral sobre a notícia, funcionando como um filtro social complementar aos verificadores automáticos do site.

**Editor de Código**
Visual Studio Code (VS Code) — utilizado para escrever e organizar o código da Home-Page (HTML, CSS e JavaScript, db.json). Escolhido pela leveza, pela extensão Live Server para visualização em tempo real, e por ser o mesmo editor usado pelo restante do grupo, facilitando o trabalho colaborativo.

**Ferramentas de Comunicação**
Discord e WhatsApp — usados para alinhar com os demais integrantes a estrutura de dados das notícias (db.json) e a integração entre as páginas.
Ferramentas de Diagramação/Prototipação
Figma — utilizado para esboçar o carrossel de destaques e a grade de cards de notícias antes da implementação, permitindo visualizar o layout e alinhar com o grupo antes de codar.


**Plataformas de Hospedagem e Controle de Versão**
GitHub — utilizado para versionamento do código da Home-Page dentro do repositório do projeto, permitindo integração com os módulos desenvolvidos pelos outros integrantes.

**APIs e Recursos Externos**
JSON Server — utilizado para simular um backend local (localhost:3000), persistindo notícias, comentários e avaliações sem a necessidade de um banco de dados real. Escolhido por ser leve, rápido de configurar e ideal para prototipação em projetos acadêmicos com prazo curto.

