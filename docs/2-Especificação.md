# Especificações Do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Contexto.md"> Documentação de Contexto</a></span>

> Desenvolvemos uma plataforma web responsiva com foco em combate a polarização, com a utilização de ferramentas de curadoria e análise de dados para reduzir o impacto da desinformação e da polarização afetiva na sociedade brasileira, ajudando a identificar algortimos que favorecem o vies com o axuilo de uma ferramenta de IA.

## Personas

O Nosso projeto foca em três perfis principais que representam diferentes níveis de engajamento:

Márcio Ribeiro (53 anos): Motorista de ônibus que busca estabilidade e informações claras para formar opiniões próprias e proteger o futuro da família.

Alexandre Batista (25 anos): Estagiário de advocacia impulsivo, que consome vídeos curtos de influenciadores e tende a defender suas crenças de forma combativa nas redes sociais.

Maria de Fátima (62 anos): Dona de casa comunicativa que compartilha notícias no WhatsApp sem verificar a veracidade, sendo influenciável por conteúdos virais.


## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:
1. Eu na condição de eleitor, desejo obter informações a respeito dos dois lados políticos de uma notícia, para decidir meu voto de forma consciente.

Contexto: A persona Márcio Ribeiro, que busca informações organizadas para formar suas próprias opiniões sem a imposição de pontos de vista agressivos.

2. Eu na condição de estudante, quero debater temas polêmicos em sala de aula de forma estruturada, para desenvolver meu pensamento crítico.

Contexto: Focar na utilização da plataforma como ferramenta educativa, incentivando o respeito e a análise de dados em discussões acadêmicas.

3. Eu na condição de usuário de redes sociais, desejo acessar um verificador de fakes rápido e intuitivo, para melhorar meus argumentos e evitar conflitos com parentes.

Contexto: Atende a usuários como Maria de Fátima, ajudando a validar informações antes do compartilhamento compulsivo no WhatsApp ou Facebook.

4. Eu na condição de estagiário de advocacia, quero acessar um resumo neutro sobre temas de polarização política, para separar o que é lei do que é barulho de internet.

Contexto: Ajuda a persona Alexandre Batista a controlar a impulsividade, oferecendo fatos e argumentos sólidos para embasar suas crenças.

5. Eu na condição de usuário do site, desejo navegar de maneira simples e estruturada, para localizar informações de maneira eficiente.

Contexto: Garante que o sistema seja funcional para quem consome notícias rapidamente pelo celular durante o dia.

6. Eu na condição de eleitor, quero consultar o mapa de polarização para facilitar a comparação de diferentes opiniões, para promover o aprendizado sobre democracia e participação social.

Contexto: Utiliza a funcionalidade de "Mapa da Polarização" para reduzir a confusão causada pelo excesso de informações desordenadas.


## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001|O sistema deve disponibilizar um "Verificador de Fake News" para análise de links e notícias.| ALTA | 
|RF-002|O sistema deve oferecer um Chatbot (Chat Despolarizar) interação e esclarecimento de dúvidas dos usuários.| MÉDIA |
|RF-003|A plataforma deve fornecer uma lista de referências e links úteis para aprofundamento acadêmico e técnico.| BAIXA |


### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve ser responsivo, adaptando-se a dispositivos móveis e desktops.| ALTA | 
|RNF-002| O tempo de carregamento das páginas e processamento de buscas não deve ultrapassar 3 segundos.|  MEDIA | 
|RNF-003|A interface deve apresentar alto contraste e navegação intuitiva para facilitar o uso por diferentes faixas etárias.|  BAIXA | 


## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue obrigatoriamente até o final do semestre.|
|02| NO sistema não deve utilizar bancos de dados externos.     |

