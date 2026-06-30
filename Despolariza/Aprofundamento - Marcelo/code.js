let videos = [];
let dadosVideos = [];

fetch("https://two016-1-tiaw-g7-polarizacao-politica.onrender.com/videos")
  .then(function(response) { 
    if (!response.ok) {
      alert("Erro no servidor: O caminho /videos não foi encontrado dentro do dados.json.");
    }
    return response.json(); 
  })
  .then(function(data) {
    dadosVideos = data;
    
    videos = data.map(function(v) {
      return v.video.url.replace("watch?v=", "embed/");
    });
    
    document.getElementById("btn-miniplayer").disabled = false;
    actualizarInformacoesDoVideo(0);
  })
  .catch(function(error) {
  console.error("Erro ao conectar com o JSONServer:", error);
});

function actualizarInformacoesDoVideo(indice) {
  if (dadosVideos[indice]) {
    document.getElementById("info-titulo").innerText = dadosVideos[indice].titulo;
    document.getElementById("info-descricao").innerText = dadosVideos[indice].descricao;
    document.getElementById("info-autor").innerText = "Canal: " + dadosVideos[indice].autor;
  }
}

const meuCarrossel = document.getElementById('carouselExampleIndicators');
meuCarrossel.addEventListener('slid.bs.carousel', function (event) {
  actualizarInformacoesDoVideo(event.to);
});

const miniplayer = document.createElement("div");
miniplayer.id = "miniplayer";

const miniIframe = document.createElement("iframe");
miniIframe.allow = "autoplay; fullscreen";
miniIframe.allowFullscreen = true;

const btnFechar = document.createElement("button");
btnFechar.id = "btn-fechar";
btnFechar.innerText = "✕ Fechar";

miniplayer.appendChild(miniIframe);
miniplayer.appendChild(btnFechar);
document.body.appendChild(miniplayer);

btnFechar.addEventListener("click", function () {
  miniplayer.style.display = "none";
  miniIframe.src = "";
  const carrossel = document.getElementById("carouselExampleIndicators");
  const iframes = carrossel.querySelectorAll("iframe");
  iframes.forEach(function(iframe) {
    if(iframe.getAttribute("data-src")) {
      iframe.src = iframe.getAttribute("data-src");
    }
    iframe.style.opacity = "1";
    iframe.style.pointerEvents = "auto";
  });
});

function abrirMiniplayer() {
  const carrossel = document.getElementById("carouselExampleIndicators");
  const slides = carrossel.querySelectorAll(".carousel-item");
  let indiceAtivo = 0;

  slides.forEach(function(slide, i) {
    if (slide.classList.contains("active")) indiceAtivo = i;
  });

  const iframes = carrossel.querySelectorAll("iframe");
  iframes.forEach(function(iframe) {
    iframe.setAttribute("data-src", iframe.src);
    iframe.src = "";
    iframe.style.opacity = "0.3";
    iframe.style.pointerEvents = "none";
  });

  miniIframe.src = videos[indiceAtivo] + "?autoplay=1&rel=0";
  miniplayer.style.display = "flex";
}
function carregarComentarios() {
  fetch("https://two016-1-tiaw-g7-polarizacao-politica.onrender.com/comentariosAprofundamento")
    .then(function(response) { return response.json(); })
    .then(function(data) {
      const lista = document.getElementById("lista-comentarios");
      lista.innerHTML = "";
      data.forEach(function(comentario) {
        const item = document.createElement("div");
        item.style.cssText = "border: 1px solid #ddd; border-radius: 8px; padding: 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;";

        const info = document.createElement("div");
        info.innerHTML = `
          <strong style="font-size: 13px;">${comentario.nome}</strong>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #444;">${comentario.texto}</p>
          <small style="color: #999;">${comentario.data}</small>
        `;

        const btnDeletar = document.createElement("button");
        btnDeletar.innerText = "✕ Excluir";
        btnDeletar.style.cssText = "background: #e74c3c; color: white; border: none; border-radius: 6px; padding: 6px 10px; cursor: pointer; font-size: 12px;";
        btnDeletar.addEventListener("click", function() {
          deletarComentario(comentario.id);
        });

        item.appendChild(info);
        item.appendChild(btnDeletar);
        lista.appendChild(item);
      });
    });
}

function salvarComentario() {
  const nome = document.getElementById("input-nome").value.trim();
  const texto = document.getElementById("input-comentario").value.trim();

  if (!nome || !texto) {
    alert("Preencha seu nome e o comentário antes de enviar!");
    return;
  }

  const data = new Date().toLocaleDateString("pt-BR");

  fetch("https://two016-1-tiaw-g7-polarizacao-politica.onrender.com/comentariosAprofundamento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: nome, texto: texto, data: data })
  })
  .then(function() {
    document.getElementById("input-nome").value = "";
    document.getElementById("input-comentario").value = "";
    carregarComentarios();
  });
}

function deletarComentario(id) {
  fetch("https://two016-1-tiaw-g7-polarizacao-politica.onrender.com/comentariosAprofundamento/" + id, {
    method: "DELETE"
  })
  .then(function() {
    carregarComentarios();
  });
}

carregarComentarios();
// PODCAST
fetch("https://two016-1-tiaw-g7-polarizacao-politica.onrender.com/podcast")
  .then(function(response) { return response.json(); })
  .then(function(data) {
    var podcast = data[0];
    var audio = document.getElementById("podcast-audio");
    var player = document.getElementById("podcast-player");

    audio.src = podcast.audio.url;        // define o áudio
    document.getElementById("podcast-label").innerHTML =
      "🎙️ <em>Ouça o podcast: " + podcast.titulo + "</em>";
    player.style.display = "block";       // mostra o player

    // quando o áudio carrega, pega a duração total
    audio.addEventListener("loadedmetadata", function() {
      document.getElementById("podcast-barra").max = Math.floor(audio.duration);
    });

    // enquanto toca, atualiza a barra e o tempo
    audio.addEventListener("timeupdate", function() {
      document.getElementById("podcast-barra").value = Math.floor(audio.currentTime);
      document.getElementById("podcast-tempo-atual").textContent = formatarTempo(audio.currentTime);
    });

    // quando termina, volta o botão pra play
    audio.addEventListener("ended", function() {
      document.getElementById("btn-play-pause").textContent = "▶";
    });
  });

function togglePodcast() {
  var audio = document.getElementById("podcast-audio");
  var btn = document.getElementById("btn-play-pause");
  if (audio.paused) { audio.play(); btn.textContent = "⏸"; }
  else              { audio.pause(); btn.textContent = "▶"; }
}

function buscarTempo(valor) {
  document.getElementById("podcast-audio").currentTime = valor;
}

function ajustarVolume(valor) {
  document.getElementById("podcast-audio").volume = valor;
}

function formatarTempo(segundos) {
  var m = Math.floor(segundos / 60);
  var s = Math.floor(segundos % 60);
  return m + ":" + (s < 10 ? "0" : "") + s;
}