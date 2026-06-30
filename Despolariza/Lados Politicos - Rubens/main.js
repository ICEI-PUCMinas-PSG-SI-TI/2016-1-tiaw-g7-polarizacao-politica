/* ══════════════════════════════════════════════════════
   SISTEMA DE VERIFICAÇÃO DE ESTATÍSTICAS POLÍTICAS
══════════════════════════════════════════════════════ */
const API_PARTIDOS = "http://https://two016-1-tiaw-g7-polarizacao-politica.onrender.com/partidos";
let PARTIDOS = [];

async function carregarPartidos() {
  try {
    const r = await fetch(API_PARTIDOS);
    if (!r.ok) throw new Error();
    PARTIDOS = await r.json();
  } catch {
    PARTIDOS = [];
  }
  renderGrid();
}

const COR_ESPECTRO = {
  "esquerda":   { bg: "bg-esquerda",   label: "Esquerda" },
  "centro-esq": { bg: "bg-centro-esq", label: "Centro-Esq." },
  "centro":     { bg: "bg-centro",     label: "Centro" },
  "centro-dir": { bg: "bg-centro-dir", label: "Centro-Dir." },
  "direita":    { bg: "bg-direita",    label: "Direita" },
};

let filtroAtual = "todos";
let termoBusca  = "";

function atualizarResumo(lista) {
  document.getElementById("res-total").textContent = lista.length;
}

function renderPartidoCard(p) {
  const { bg, label } = COR_ESPECTRO[p.espectro];
  const metricas = [
    { key: "transparencia",   label: "Transparência" },
    { key: "participacao",    label: "Participação" },
    { key: "coerencia",       label: "Coerência" },
    { key: "governabilidade", label: "Govern." },
  ];
  const barras = metricas.map(m => {
    const val = p.metricas[m.key];
    return `
      <div class="metrica-row">
        <span class="metrica-label">${m.label}</span>
        <div class="metrica-bar-wrap">
          <div class="metrica-bar" style="width:${val}%"></div>
        </div>
        <span class="metrica-val">${val}%</span>
      </div>`;
  }).join("");

  const temas = p.temas.map(t =>
    `<span style="font-size:.68rem;background:var(--cinza-claro);border:1px solid var(--borda);border-radius:10px;padding:.1rem .5rem;color:#555">${t}</span>`
  ).join(" ");

  return `
    <div class="partido-card" data-espectro="${p.espectro}">
      <div class="partido-header">
        <div>
          <div class="partido-sigla">${p.sigla}</div>
          <div class="partido-nome">${p.nome}</div>
        </div>
        <span class="espectro-badge ${bg}">${label}</span>
      </div>
      <div style="font-size:.72rem;color:#aaa;margin-bottom:.7rem">
        <i class="bi bi-calendar3"></i> Fundado em ${p.fundacao} &nbsp;
        <i class="bi bi-people-fill"></i> ${p.deputados} dep. &nbsp;
        <i class="bi bi-person-badge"></i> ${p.senadores} sen.
      </div>
      ${barras}
      <div style="margin-top:.6rem;display:flex;flex-wrap:wrap;gap:.3rem">${temas}</div>
    </div>`;
}

function renderGrid() {
  const grid = document.getElementById("partidos-grid");
  const lista = PARTIDOS.filter(p => {
    const espOk  = filtroAtual === "todos" || p.espectro === filtroAtual;
    const nomeOk = !termoBusca ||
      p.sigla.toLowerCase().includes(termoBusca) ||
      p.nome.toLowerCase().includes(termoBusca);
    return espOk && nomeOk;
  });

  atualizarResumo(lista);

  if (!lista.length) {
    grid.innerHTML = `<div class="sem-resultados" style="grid-column:1/-1">
      <i class="bi bi-search"></i>
      Nenhum partido encontrado para "<strong>${termoBusca}</strong>".
    </div>`;
    return;
  }

  grid.innerHTML = lista.map(renderPartidoCard).join("");

  const painel = document.getElementById("painel-comparacao");
  if (filtroAtual !== "todos" && lista.length >= 2) {
    const top2 = lista.slice(0, 2);
    const comparacaoHTML = top2.map(p => {
      const avg = Math.round(Object.values(p.metricas).reduce((s,v) => s + v, 0) / 4);
      return `<div class="comparacao-col">
        <div class="sigla">${p.sigla}</div>
        <div style="font-size:.75rem;color:var(--azul);font-weight:600">Score médio: ${avg}%</div>
        <div class="label-small">${p.deputados} dep. · ${p.senadores} sen.</div>
      </div>`;
    }).join(`<div style="display:flex;align-items:center;color:#ccc;font-size:1.3rem">⟺</div>`);
    document.getElementById("comparacao-grid").innerHTML = comparacaoHTML;
    painel.classList.remove("d-none");
  } else {
    painel.classList.add("d-none");
  }
}

/* ── Filtros de espectro ────────────────────────────── */
document.querySelectorAll(".espectro-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".espectro-btn").forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    filtroAtual = btn.dataset.esp;
    renderGrid();
  });
});

/* ── Busca ──────────────────────────────────────────── */
const inputBusca = document.getElementById("busca-partido");
document.getElementById("btn-buscar-partido").addEventListener("click", () => {
  termoBusca = inputBusca.value.trim().toLowerCase();
  filtroAtual = "todos";
  document.querySelectorAll(".espectro-btn").forEach(b => b.classList.remove("ativo"));
  document.querySelector('.espectro-btn[data-esp="todos"]').classList.add("ativo");
  renderGrid();
});
inputBusca.addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("btn-buscar-partido").click();
});

/* ── Init ───────────────────────────────────────────── */
carregarPartidos();