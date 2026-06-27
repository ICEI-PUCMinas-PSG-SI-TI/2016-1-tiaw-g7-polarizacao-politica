function renderizarSlides(slides) {
    const indicadores = document.getElementById("carrosselIndicadores");
    const inner       = document.getElementById("carrosselInner");

    slides.forEach(function (slide, index) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-bs-target", "#heroCarrossel");
        btn.setAttribute("data-bs-slide-to", index);
        if (index === 0) btn.classList.add("active");
        indicadores.appendChild(btn);

        const item = document.createElement("div");
        item.className = "carousel-item h-100" + (index === 0 ? " active" : "");

        item.innerHTML = `
            <img src="${slide.imagem}" class="hero-img" alt="${slide.alt}"/>
            <div class="carousel-caption d-none d-md-block hero-caption">
                <a href="${slide.url}" target="_blank" rel="noopener noreferrer" class="slide-link">
                    <h2>${slide.titulo}</h2>
                    <p>${slide.subtitulo}</p>
                </a>
            </div>
        `;

        inner.appendChild(item);
    });

    const carouselElement = document.getElementById("heroCarrossel");
    if (carouselElement) {
        const carousel = new bootstrap.Carousel(carouselElement, {
            interval: 4000,
            ride: true,
            pause: false,
            wrap: true,
            touch: true
        });
        carousel.cycle();
    }
}

function renderizarCards(noticias) {
    const lista = document.getElementById("listaCards");

    noticias.forEach(function (noticia, index) {
        const col = document.createElement("div");
        col.className = "col-12 col-md-4";

        col.innerHTML = `
            <article class="noticia-card h-100" onclick="abrirNoticia(${index})">
                <div class="noticia-img-wrap">
                    <img src="${noticia.imagem.url}" alt="${noticia.imagem.legenda}" class="noticia-img"/>
                    <div class="noticia-categoria">${noticia.tags[0]}</div>
                </div>
                <div class="p-3 d-flex flex-column">
                    <p class="noticia-meta">📅 ${noticia.data_de_publicacao} &nbsp;·&nbsp; ✍️ ${noticia.autor}</p>
                    <h3 class="noticia-titulo">${noticia.manchete}</h3>
                    <p class="noticia-resumo flex-grow-1">${noticia.resumo}</p>
                    <span class="noticia-leia">Leia mais →</span>
                </div>
            </article>
        `;

        lista.appendChild(col);
    });
}

let noticiasCache = [];

function abrirNoticia(index) {
    const noticia = noticiasCache[index];

    document.getElementById("modalCategoria").textContent = noticia.tags[0];
    document.getElementById("modalImagem").src            = noticia.imagem.url;
    document.getElementById("modalImagem").alt            = noticia.imagem.legenda;
    document.getElementById("modalData").textContent      = noticia.data_de_publicacao;
    document.getElementById("modalAutor").textContent     = noticia.autor;
    document.getElementById("modalFonte").innerHTML       = `<a href="${noticia.fonte.url}" target="_blank" rel="noopener noreferrer">${noticia.fonte.nome}</a>`;
    document.getElementById("modalTitulo").textContent    = noticia.manchete;
    document.getElementById("modalResumo").textContent    = noticia.resumo;
    document.getElementById("modalConteudo").textContent  = noticia.resumo;

    document.getElementById("modalNoticia").classList.add("modal-aberto");
    document.body.style.overflow = "hidden";

    const btnAv = document.getElementById("btnEnviarAvaliacao");
    btnAv.textContent = "Enviar avaliação";
    btnAv.disabled = false;
    carregarDadosNoticia(index);
}

function fecharModal() {
    document.getElementById("modalNoticia").classList.remove("modal-aberto");
    document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", function () {

    fetch("http://localhost:3000/slides")
        .then(function (res) { return res.json(); })
        .then(function (slides) { renderizarSlides(slides); })
        .catch(function () { console.error("Erro ao carregar slides. JSON Server está rodando?"); });

    fetch("http://localhost:3000/noticia")
        .then(function (res) { return res.json(); })
        .then(function (noticias) {
            noticiasCache = noticias;
            renderizarCards(noticias);
        })
        .catch(function () { console.error("Erro ao carregar notícias. JSON Server está rodando?"); });

    document.getElementById("modalNoticia").addEventListener("click", function (e) {
        if (e.target === this) fecharModal();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") fecharModal();
    });
});

const API = "http://localhost:3000";
let noticiaAtualIndex = -1;
let noticiaAtualId    = null;
let avaliacaoSelecionada = 0;

function carregarDadosNoticia(index) {
    noticiaAtualIndex = index;
    noticiaAtualId    = Number(noticiasCache[index].id);
    avaliacaoSelecionada = 0;

    document.querySelectorAll("#estrelasUsuario .estrela").forEach(function(e) {
        e.classList.remove("ativa", "hover");
    });

    const btn = document.getElementById("btnEnviarAvaliacao");
    btn.textContent = "Enviar avaliação";
    btn.disabled = false;

    fetch(API + "/avaliacoes?noticiaId=" + noticiaAtualId)
        .then(function(r) { return r.json(); })
        .then(function(avaliacoes) {
            const total = avaliacoes.length;
            const media = total > 0
                ? avaliacoes.reduce(function(acc, a) { return acc + a.valor; }, 0) / total
                : 0;

            const mediaFmt = media.toFixed(1).replace(".", ",");
            document.getElementById("avaliacaoMedia").textContent =
                mediaFmt + " (" + total + " avaliação" + (total !== 1 ? "ões" : "") + ")";

            document.querySelectorAll("#estrelasMedia .estrela").forEach(function(el) {
                el.classList.toggle("ativa", parseInt(el.getAttribute("data-v")) <= Math.round(media));
            });
        })
        .catch(function() { console.error("Erro ao carregar avaliações."); });

    renderizarComentarios();
}

function renderizarComentarios() {
    if (noticiaAtualId === null || isNaN(noticiaAtualId)) return;
    const ordem = document.getElementById("comentariosOrdem").value;

    fetch(API + "/comentarios?noticiaId=" + noticiaAtualId)
        .then(function(r) { return r.json(); })
        .then(function(comentarios) {
            const lista = document.getElementById("listaComentarios");
            lista.innerHTML = "";

            document.getElementById("comentariosTitulo").textContent =
                "Comentários (" + comentarios.length + ")";

            comentarios.sort(function(a, b) {
                return ordem === "antigos" ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
            });

            if (comentarios.length === 0) {
                lista.innerHTML = "<p class='sem-comentarios'>Seja o primeiro a comentar!</p>";
                return;
            }

            comentarios.forEach(function(c) {
                const hora = new Date(c.timestamp).toLocaleString("pt-BR", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                });
                const item = document.createElement("div");
                item.className = "comentario-item";
                item.innerHTML =
                    "<div class='comentario-avatar'>👤</div>" +
                    "<div class='comentario-corpo'>" +
                        "<p class='comentario-texto'>" + escapeHtml(c.texto) + "</p>" +
                        "<span class='comentario-hora'>" + hora + "</span>" +
                    "</div>";
                lista.appendChild(item);
            });
        })
        .catch(function() { console.error("Erro ao carregar comentários."); });
}

function adicionarComentario() {
    const input = document.getElementById("inputComentario");
    const texto = input.value.trim();
    if (!texto) return;

    const novoComentario = {
        noticiaId: noticiaAtualId,
        texto: texto,
        timestamp: Date.now()
    };

    fetch(API + "/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoComentario)
    })
    .then(function(r) { return r.json(); })
    .then(function() {
        input.value = "";
        renderizarComentarios();
    })
    .catch(function() { console.error("Erro ao salvar comentário."); });
}

function enviarAvaliacao() {
    if (avaliacaoSelecionada === 0) return;

    const novaAvaliacao = {
        noticiaId: noticiaAtualId,
        valor: avaliacaoSelecionada
    };

    fetch(API + "/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaAvaliacao)
    })
    .then(function(r) { return r.json(); })
    .then(function() {
        const btn = document.getElementById("btnEnviarAvaliacao");
        btn.textContent = "Avaliado!";
        btn.disabled = true;
        carregarDadosNoticia(noticiaAtualIndex);
    })
    .catch(function() { console.error("Erro ao salvar avaliação."); });
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("#estrelasUsuario .estrela").forEach(function(el) {
        el.addEventListener("mouseenter", function() {
            const v = parseInt(el.getAttribute("data-v"));
            document.querySelectorAll("#estrelasUsuario .estrela").forEach(function(e) {
                e.classList.toggle("hover", parseInt(e.getAttribute("data-v")) <= v);
            });
        });
        el.addEventListener("mouseleave", function() {
            document.querySelectorAll("#estrelasUsuario .estrela").forEach(function(e) {
                e.classList.remove("hover");
            });
        });
        el.addEventListener("click", function() {
            avaliacaoSelecionada = parseInt(el.getAttribute("data-v"));
            document.querySelectorAll("#estrelasUsuario .estrela").forEach(function(e) {
                e.classList.toggle("ativa", parseInt(e.getAttribute("data-v")) <= avaliacaoSelecionada);
            });
        });
    });
});

function escapeHtml(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}