const ARC_LENGTH = Math.PI * 90;

function renderizarMedidor(porcentagemTendencioso) {
    const porcentagemNeutro = 100 - porcentagemTendencioso;

    return `
        <div class="resultado-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Resultados da análise de imparcialidade
        </div>

        <div class="resultado-titulo">
            ${porcentagemTendencioso}% deste texto parece ser tendencioso
        </div>

        <div class="medidor-wrapper">
           <svg class="medidor-svg" viewBox="0 0 200 110">
            <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#4caf50" stroke-width="12" stroke-linecap="round"/>
            <path class="medidor-fill" id="arco-vermelho" d="M 10 100 A 90 90 0 0 1 190 100"stroke="#e05252" stroke-dasharray="0 ${ARC_LENGTH}"/>
           </svg>
            <div class="medidor-porcentagem" id="medidor-numero">0%</div>
        </div>

        <div class="legenda">
            <div class="legenda-item">
                <div class="legenda-esquerda">
                    <div class="legenda-dot dot-tendencioso"></div>
                    <span>Linguagem tendenciosa</span>
                </div>
                <span class="legenda-valor">${porcentagemTendencioso}%</span>
            </div>
            <div class="legenda-item">
                <div class="legenda-esquerda">
                    <div class="legenda-dot dot-neutro"></div>
                    <span>Linguagem neutra</span>
                </div>
                <span class="legenda-valor">${porcentagemNeutro}%</span>
            </div>
        </div>
    `;
}

function animarMedidor(porcentagemFinal) {
    const arcoVermelho = document.getElementById('arco-vermelho');
    const numero = document.getElementById('medidor-numero');
    if (!arcoVermelho || !numero) return;

    const comprimentoVermelho = (porcentagemFinal / 100) * ARC_LENGTH;
    const duracao = 1200;
    const inicio = performance.now();

    function tick(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const easing = 1 - Math.pow(1 - progresso, 3);

        numero.textContent = Math.round(easing * porcentagemFinal) + '%';
        arcoVermelho.style.strokeDasharray = `${easing * comprimentoVermelho} ${ARC_LENGTH}`;

        if (progresso < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

async function excluirItem(id) {
    await fetch(`http://localhost:3000/verificador_de_imparcialidade/${id}`, {
        method: 'DELETE'
    });

    carregarHistorico();
}

let dadosHistorico = [];

async function carregarHistorico() {
    const response = await fetch('http://localhost:3000/verificador_de_imparcialidade');
    dadosHistorico = await response.json();
    renderizarHistorico();
}

function renderizarHistorico() {
    const lista = document.getElementById('lista-historico');
    const filtroNivel = document.getElementById('filtroNivel')?.value || 'todos';
    const filtroOrdem = document.getElementById('filtroOrdem')?.value || 'recente';

    let dados = [...dadosHistorico];

  
    if (filtroNivel !== 'todos') {
        dados = dados.filter(item => {
            const v = item.veredicto?.toLowerCase() || '';
            if (filtroNivel === 'imparcial') return v.includes('imparcial');
            if (filtroNivel === 'moderado') return v.includes('moderadamente');
            if (filtroNivel === 'tendencioso') return v.includes('muito tendencioso');
        });
    }

    dados.sort((a, b) => {
        const percA = parseInt(a.veredicto) || 0;
        const percB = parseInt(b.veredicto) || 0;
        if (filtroOrdem === 'maior') return percB - percA;
        if (filtroOrdem === 'menor') return percA - percB;
        if (filtroOrdem === 'antigo') return a.id - b.id;
        return b.id - a.id; // recente
    });

    lista.innerHTML = '';

    if (dados.length === 0) {
        lista.innerHTML = '<p>Nenhuma análise encontrada.</p>';
        return;
    }

    dados.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-historico';
        div.innerHTML = `
            <div class="item-conteudo">
                <p><strong>Data:</strong> ${item.data_da_analise}</p>
                <p><strong>Texto:</strong>
                    <span class="texto-resumido">${(item.texto_da_noticia || '').substring(0, 100)}...</span>
                    <span class="texto-completo" style="display:none;">${item.texto_da_noticia || ''}</span>
                </p>
                <p><strong>Tendenciosidade:</strong> ${item.veredicto}</p>
                <button type="button" class="btnExcluir">🗑️ Excluir</button>
            </div>
            <button type="button" class="btnVerMais">▼</button>
        `;

        div.querySelector('.btnVerMais').addEventListener('click', () => {
            const resumido = div.querySelector('.texto-resumido');
            const completo = div.querySelector('.texto-completo');
            const btn = div.querySelector('.btnVerMais');
            if (completo.style.display === 'none') {
                completo.style.display = 'inline';
                resumido.style.display = 'none';
                btn.textContent = '▲';
            } else {
                completo.style.display = 'none';
                resumido.style.display = 'inline';
                btn.textContent = '▼';
            }
        });

        div.querySelector('.btnExcluir').addEventListener('click', () => excluirItem(item.id));
        lista.appendChild(div);
    });

}


document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('btnEnviar');
    const textarea = document.getElementById('textoNoticia');
    const resposta = document.getElementById('resposta');
    const btnHistorico = document.getElementById('btnHistorico');

    document.getElementById('filtroNivel').addEventListener('change', renderizarHistorico);
    document.getElementById('filtroOrdem').addEventListener('change', renderizarHistorico);

    btnHistorico.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const historico = document.getElementById('historico');
        if (historico.style.display === 'none') {
            historico.style.display = 'block';
            btnHistorico.textContent = '📋 Fechar histórico';
            carregarHistorico();
        } else {
            historico.style.display = 'none';
            btnHistorico.textContent = '📋 Ver histórico';
        }
    });

     textarea.addEventListener('input', () => {
        textarea.style.height = '40px';
        textarea.style.height = textarea.scrollHeight + 'px';

        if (!textarea.value) {
            resposta.innerHTML = '<p>Sua análise sairá aqui</p>';
        }
    });

    button.addEventListener('click', async (event) => {
        event.preventDefault();
        const texto = textarea.value;

        if (!texto) {
            alert('Por favor, insira o texto!');
            return;
        }

        resposta.innerHTML = '<p class="loading-texto">Analisando imparcialidade do texto...</p>';

        const chave = 'AQ.Ab8RN6K0y3O-vk3nU_IwQPU7ncHxieijYAesiEqS0vf9BkPmBw';

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${chave}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Você é um analisador de imparcialidade textual.
                            REGRAS OBRIGATÓRIAS:
                            - Se o texto estiver claramente cortado ou incompleto no meio de uma palavra ou frase, responda COMPLETO: NAO
                            - Se o conteúdo não for texto analisável (código, dados, listas aleatórias, etc), responda COMPLETO: INVALIDO
                            - Caso contrário, responda COMPLETO: SIM

                            Avalie o nível de tendenciosidade com base em: linguagem emocional, ausência de fontes, visão unilateral, apelos emocionais e adjetivação excessiva.

                            Responda EXATAMENTE neste formato, sem texto adicional:
                            COMPLETO: SIM, NAO ou INVALIDO
                            TENDENCIOSIDADE: número de 0 a 100
                            EXPLICACAO: explicação resumida em 2 a 4 frases

                        Texto: ${texto}`
                                            }]
                                        }]
                                    })
                                });

        const data = await response.json();

        if (!data.candidates) {
            resposta.innerHTML = '<p>Muitas requisições! Aguarde um momento e tente novamente.</p>';
            return;
        }

        const resposta_texto = data.candidates[0].content.parts[0].text.trim();

        const eCompleto = resposta_texto.includes('COMPLETO: SIM');
        const eInvalido = resposta_texto.includes('COMPLETO: INVALIDO');

        if (eInvalido) {
            resposta.innerHTML = `<h2>⚠️ Esse texto não pode ser analisado.</h2><p>Insira um texto jornalístico, artigo ou notícia.</p>`;
            return;
        }

        if (!eCompleto) {
            resposta.innerHTML = `<h2>⚠️ O texto parece estar incompleto! Insira o texto completo</h2>`;
            return;
        }

      
        const matchTend = resposta_texto.match(/TENDENCIOSIDADE:\s*(\d+)/);
        const porcentagem = matchTend ? Math.min(100, Math.max(0, parseInt(matchTend[1]))) : 50;

        
        const explicacao = resposta_texto.split('EXPLICACAO:')[1]?.trim() || '';
        const explicacaoFormatada = explicacao.split('\n').filter(l => l.trim()).map(linha => `<p>${linha}</p>`).join('');

        resposta.innerHTML = `
            ${renderizarMedidor(porcentagem)}
            <div class="divisor"></div>
            <div class="explicacao-titulo">Análise detalhada</div>
            <div class="explicacao-texto">${explicacaoFormatada}</div>
        `;

        
        animarMedidor(porcentagem);

        
        let veredictoTexto = '';
        if (porcentagem <= 30) veredictoTexto = `${porcentagem}% - Imparcial`;
        else if (porcentagem <= 60) veredictoTexto = `${porcentagem}% - Moderadamente tendencioso`;
        else veredictoTexto = `${porcentagem}% - Muito tendencioso`;

        await fetch('http://localhost:3000/verificador_de_imparcialidade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: 1,
                texto_da_noticia: texto,
                veredicto: veredictoTexto,
                explicacao: explicacao,
                data_da_analise: new Date().toLocaleDateString('pt-BR')
            })
        });

        return false;
    });
});