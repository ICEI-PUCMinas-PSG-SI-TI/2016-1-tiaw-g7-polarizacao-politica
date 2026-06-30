const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

async function chamarGemini(prompt) {
    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    return response.json();
}

server.post('/api/fake-news', async (req, res) => {
    const { texto } = req.body;
    const prompt = `Você é um detector de fake news e desinformação. Analise o seguinte texto em português, independente do tamanho. Textos curtos também devem ser analisados normalmente. Não tente confirmar se o fato aconteceu, pois você pode não conhecer eventos recentes. Analise as características do texto: linguagem, coerência e dados verificáveis.
Responda exatamente neste formato:
COMPLETO: SIM (considere SIM para qualquer texto com sentido completo, mesmo que curto)
VEREDICTO: FALSO ou VERDADEIRO
EXPLICACAO: explicação resumida dos motivos
Texto: ${texto}`;
    const data = await chamarGemini(prompt);
    res.json(data);
});

server.post('/api/imparcialidade', async (req, res) => {
    const { texto } = req.body;
    const prompt = `Você é um analisador de imparcialidade textual.
REGRAS OBRIGATÓRIAS:
- Se o texto estiver claramente cortado ou incompleto no meio de uma palavra ou frase, responda COMPLETO: NAO
- Se o conteúdo não for texto analisável (código, dados, listas aleatórias, etc), responda COMPLETO: INVALIDO
- Caso contrário, responda COMPLETO: SIM

Avalie o nível de tendenciosidade com base em: linguagem emocional, ausência de fontes, visão unilateral, apelos emocionais e adjetivação excessiva.

Responda EXATAMENTE neste formato, sem texto adicional:
COMPLETO: SIM, NAO ou INVALIDO
TENDENCIOSIDADE: número de 0 a 100
EXPLICACAO: explicação resumida em 2 a 4 frases

Texto: ${texto}`;
    const data = await chamarGemini(prompt);
    res.json(data);
});

server.post('/api/chat', async (req, res) => {
    const { pergunta } = req.body;
    const prompt = `Você é o assistente do site Despolariza!, um projeto que combate a polarização política através de informação equilibrada. Responda em português, de forma curta (no máximo 3 frases) e imparcial, ajudando o usuário com dúvidas sobre política, fake news, polarização e como identificar desinformação.

Pergunta do usuário: ${pergunta}`;
    const data = await chamarGemini(prompt);
    res.json(data);
});

server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});