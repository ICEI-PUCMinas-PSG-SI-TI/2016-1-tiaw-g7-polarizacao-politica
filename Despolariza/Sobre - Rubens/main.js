/* ══════════════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════════════ */
const API    = "http://https://two016-1-tiaw-g7-polarizacao-politica.onrender.com/avaliacoesSobre";
const LABELS = ["", "Péssimo 😞", "Ruim 😕", "Regular 😐", "Bom 😊", "Excelente 🤩"];

/* ── Referências DOM ────────────────────────────────── */
const stars        = document.querySelectorAll(".star");
const notaLabel    = document.getElementById("nota-label");
const btnEnviar    = document.getElementById("btn-enviar");
const comentarioEl = document.getElementById("comentario");
const charCount    = document.getElementById("char-count");
const listaEl      = document.getElementById("lista-avaliacoes");
const emptyMsg     = document.getElementById("empty-msg");
const mediaDisplay = document.getElementById("media-display");
const mediaValor   = document.getElementById("media-valor");
const mediaStars   = document.getElementById("media-stars");
const mediaCount   = document.getElementById("media-count");

let notaSelecionada = 0;

/* ── Estrelas ───────────────────────────────────────── */
stars.forEach((s) => {
  s.addEventListener("mouseenter", () => highlightStars(+s.dataset.val, true));
  s.addEventListener("mouseleave", () => highlightStars(notaSelecionada, false));
  s.addEventListener("click", () => {
    notaSelecionada = +s.dataset.val;
    highlightStars(notaSelecionada, false);
    notaLabel.textContent = LABELS[notaSelecionada];
    notaLabel.style.color = "#1a3a6e";
    btnEnviar.disabled = false;
  });
});

function highlightStars(val, hover) {
  stars.forEach((s) => {
    const v = +s.dataset.val;
    s.classList.toggle("active", !hover && v <= val);
    s.classList.toggle("hover",   hover && v <= val);
    if (hover && val > 0) notaLabel.textContent = LABELS[val];
  });
  if (hover && val === 0) notaLabel.textContent = "Passe o mouse para avaliar";
}

/* ── Contador de caracteres ─────────────────────────── */
comentarioEl.addEventListener("input", () => {
  charCount.textContent = `${comentarioEl.value.length}/300`;
});

/* ── Toast ──────────────────────────────────────────── */
function showToast(msg, ok = true) {
  const el = document.getElementById("toast-el");
  el.classList.remove("bg-success", "bg-danger");
  el.classList.add(ok ? "bg-success" : "bg-danger");
  document.getElementById("toast-msg").textContent = msg;
  bootstrap.Toast.getOrCreateInstance(el, { delay: 3000 }).show();
}

/* ── Renderizar avaliação ───────────────────────────── */
function renderItem(av) {
  const div = document.createElement("div");
  div.className = "review-item";
  div.id = `rev-${av.id}`;
  const estrelas = "★".repeat(av.nota) + "☆".repeat(5 - av.nota);
  const data = new Date(av.data).toLocaleString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
  div.innerHTML = `
    <div>
      <div class="review-stars">${estrelas}</div>
      <div class="review-meta">${data}</div>
      ${av.comentario
        ? `<div class="review-comentario mt-1">${av.comentario}</div>`
        : ""}
    </div>
    <button class="review-delete" title="Remover" onclick="deletarAvaliacao('${av.id}')">
      <i class="bi bi-trash3"></i>
    </button>
  `;
  return div;
}

/* ── Atualizar média ────────────────────────────────── */
function atualizarMedia(lista) {
  if (!lista.length) {
    mediaDisplay.classList.add("d-none");
    return;
  }
  mediaDisplay.classList.remove("d-none");
  const avg = lista.reduce((s, a) => s + a.nota, 0) / lista.length;
  mediaValor.textContent = avg.toFixed(1);
  const cheias = Math.round(avg);
  mediaStars.textContent = "★".repeat(cheias) + "☆".repeat(5 - cheias);
  mediaCount.textContent = `${lista.length} avaliação${lista.length > 1 ? "ões" : ""}`;
}

/* ── Carregar avaliações ────────────────────────────── */
async function carregarAvaliacoes() {
  try {
    const r = await fetch(API);
    if (!r.ok) throw new Error();
    const lista = await r.json();

    listaEl.innerHTML = "";
    if (lista.length === 0) {
      listaEl.appendChild(emptyMsg);
    } else {
      [...lista].reverse().slice(0, 5).forEach((av) => {
        listaEl.appendChild(renderItem(av));
      });
    }
    atualizarMedia(lista);
  } catch {
    listaEl.innerHTML = `<p style="font-size:.82rem;color:#f87171;text-align:center;padding:.8rem">
      Servidor não encontrado.<br>Execute: <code>node server.js</code>
    </p>`;
  }
}

/* ── Enviar avaliação ───────────────────────────────── */
btnEnviar.addEventListener("click", async () => {
  if (!notaSelecionada) return;
  btnEnviar.disabled = true;
  btnEnviar.textContent = "Enviando…";

  try {
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nota: notaSelecionada,
        comentario: comentarioEl.value.trim(),
      }),
    });
    if (!r.ok) throw new Error();

    showToast(`Obrigado! Você avaliou com ${notaSelecionada}★`);
    comentarioEl.value = "";
    charCount.textContent = "0/300";
    notaSelecionada = 0;
    highlightStars(0, false);
    notaLabel.textContent = "Passe o mouse para avaliar";
    notaLabel.style.color = "#888";
    await carregarAvaliacoes();
  } catch {
    showToast("Erro ao enviar. Verifique se o servidor está rodando.", false);
  } finally {
    btnEnviar.textContent = "Enviar Avaliação";
  }
});

/* ── Deletar avaliação ──────────────────────────────── */
async function deletarAvaliacao(id) {
  if (!confirm("Remover esta avaliação?")) return;
  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    await carregarAvaliacoes();
    showToast("Avaliação removida.");
  } catch {
    showToast("Erro ao remover.", false);
  }
}

/* ── Init ───────────────────────────────────────────── */
carregarAvaliacoes();

// Expor para onclick inline
window.deletarAvaliacao = deletarAvaliacao;