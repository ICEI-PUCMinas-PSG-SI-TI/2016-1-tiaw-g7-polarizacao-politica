// ── Slides do Carrossel ──────────────────────
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

    // Inicia o carrossel após renderizar
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

// ── Cards de Notícias ────────────────────────
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

// ── Modal ────────────────────────────────────
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
}

function fecharModal() {
    document.getElementById("modalNoticia").classList.remove("modal-aberto");
    document.body.style.overflow = "";
}

// ── Inicialização via fetch ──────────────────
document.addEventListener("DOMContentLoaded", function () {

    // Busca os slides
    fetch("http://localhost:3000/slides")
        .then(function (res) { return res.json(); })
        .then(function (slides) { renderizarSlides(slides); })
        .catch(function () { console.error("Erro ao carregar slides. JSON Server está rodando?"); });

    // Busca as notícias
    fetch("http://localhost:3000/noticia")
        .then(function (res) { return res.json(); })
        .then(function (noticias) {
            noticiasCache = noticias;
            renderizarCards(noticias);
        })
        .catch(function () { console.error("Erro ao carregar notícias. JSON Server está rodando?"); });

    // Fecha modal ao clicar fora
    document.getElementById("modalNoticia").addEventListener("click", function (e) {
        if (e.target === this) fecharModal();
    });

    // Fecha modal com ESC
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") fecharModal();
    });
});