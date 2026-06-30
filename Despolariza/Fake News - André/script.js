async function excluirItem(id) {
    await fetch(`https://two016-1-tiaw-g7-polarizacao-politica.onrender.com/verificador_de_fake_news/${id}`, {
        method: 'DELETE'
    });
    carregarHistorico();
}

async function carregarHistorico() {
    const response = await fetch('https://two016-1-tiaw-g7-polarizacao-politica.onrender.com/verificador_de_fake_news');
    const dados = await response.json();

    const lista = document.getElementById('lista-historico');
    lista.innerHTML = '';

    if (dados.length === 0) {
        lista.innerHTML = '<p>Nenhuma análise realizada ainda.</p>';
        return;
    }

    dados.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-historico';
        div.innerHTML = `
            <div class="item-conteudo">
                <p><strong>Data:</strong> ${item.data_da_analise}</p>
                <p><strong>Texto:</strong> 
                    <span class="texto-resumido">${item.texto_da_noticia.substring(0, 100)}...</span>
                    <span class="texto-completo" style="display:none;">${item.texto_da_noticia}</span>
                </p>
                <p><strong>Veredicto:</strong> ${item.veredicto}</p>
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

document.addEventListener('DOMContentLoaded', () => 
{
    const button = document.getElementById('btnEnviar');
    const textarea = document.getElementById('textoNoticia');
    const resposta = document.getElementById('resposta');
    const btnHistorico = document.getElementById('btnHistorico');

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
    
    textarea.addEventListener('input', () => 
    {
        textarea.style.height = '40px';
        textarea.style.height = textarea.scrollHeight + 'px';

        if (!textarea.value) 
        {
            resposta.innerHTML = 'Sua resposta sairá aqui';
        }
    });

    button.addEventListener('click', async (event) => {
        event.preventDefault();
        const texto = textarea.value;

        if (!texto) 
        {
            alert('Por favor, insira o texto!');
            return;
        }

        resposta.innerHTML = '<p>Fazendo a análise do texto...</p>';

        const response = await fetch('https://two016-1-tiaw-g7-polarizacao-politica.onrender.com/api/fake-news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto })
        });

        const data = await response.json();

        if (!data.candidates) 
        {
            resposta.innerHTML = '<p>Muitas requisições! Aguarde um momento e tente novamente.</p>';
            return;
        }

       const resposta_texto = data.candidates[0].content.parts[0].text.trim(); 
       const eCompleto = resposta_texto.includes('COMPLETO: SIM');
       const eFalso = resposta_texto.includes('VEREDICTO: FALSO');
       const explicacao = resposta_texto.split('EXPLICACAO:')[1].trim();
       const explicacaoFormatada = explicacao.split('\n').map(linha => `<p>${linha}</p>`).join('');

    let veredicto = '';

    if (!eCompleto) 
    {
        veredicto = 'Incompleto';
        resposta.innerHTML = `<h2>⚠️ O texto parece estar incompleto! Insira o texto completo</h2>`;
    } 
    else if (eFalso) 
    {
        veredicto = 'FALSO';
        resposta.innerHTML = `<h2>❌ Esse texto contém desinformação!</h2><h3>Explicação:</h3>${explicacaoFormatada}`;
    } 
    else 
    {
        veredicto = 'VERDADEIRO';
        resposta.innerHTML = `<h2>✅ Esse texto parece verdadeiro!</h2><h3>Explicação:</h3>${explicacaoFormatada}`;
    }

        if (veredicto === 'FALSO' || veredicto === 'VERDADEIRO') {
            await fetch('https://two016-1-tiaw-g7-polarizacao-politica.onrender.com/verificador_de_fake_news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id: 1,
                    texto_da_noticia: texto,
                    veredicto: veredicto,
                    explicacao: explicacao,
                    data_da_analise: new Date().toLocaleDateString('pt-BR')
                })                  
            });
        }

        return false;
    });
});