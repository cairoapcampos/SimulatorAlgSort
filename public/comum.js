// Partes compartilhadas entre os simuladores (reprodução, resumo e formulário).
window.Comum = (() => {
  const el = (id) => document.getElementById(id);
  const CORES = Object.freeze({
    NEUTRO: '#475569',
    VAZIO: '#1f2733',
    AZUL: '#3b82f6',
    LARANJA: '#f59e0b',
    VERMELHO: '#f87171',
    VERDE: '#22c55e',
    AMARELO: '#fbbf24',
    FUNDO: '#12161c',
  });

  const lerDados = () => JSON.parse(el('dados').textContent);
  const marcador = (classe, texto) => `<span class="${classe}">${texto}</span>`;

  function atualizarCampos(campos) {
    Object.entries(campos).forEach(([id, valor]) => { el(id).textContent = valor ?? '-'; });
  }

  const ATALHOS = {
    home: 'inicio',
    arrowleft: 'anterior',
    ' ': 'play',
    arrowright: 'proximo',
    end: 'fim',
    p: 'proxGap',
    r: 'reiniciar',
  };

  function iniciarPlayer({ passos, render, fimDaPassada }) {
    let atual = 0;
    let timer = null;

    function mostrar() {
      render(passos[atual], atual);
      const pct = Math.round((atual / (passos.length - 1)) * 100);
      el('progresso').style.width = `${pct}%`;
      el('progresso').parentElement.setAttribute('aria-valuenow', pct);
      el('contador').textContent = `${atual + 1} / ${passos.length}`;
      el('play').innerHTML = timer ? '⏸ Pausar <kbd>Espaço</kbd>' : '▶ Play <kbd>Espaço</kbd>';
    }

    function parar() {
      clearInterval(timer);
      timer = null;
    }

    function ir(n) {
      atual = Math.min(Math.max(n, 0), passos.length - 1);
      if (atual === passos.length - 1) parar();
      mostrar();
    }

    function tocar() {
      if (timer) return parar(), mostrar();
      if (atual === passos.length - 1) atual = 0;
      timer = setInterval(() => ir(atual + 1), Number(el('velocidade').value));
      mostrar();
    }

    el('inicio').onclick = () => { parar(); ir(0); };
    el('anterior').onclick = () => { parar(); ir(atual - 1); };
    el('proximo').onclick = () => { parar(); ir(atual + 1); };
    el('fim').onclick = () => { parar(); ir(passos.length - 1); };
    el('play').onclick = tocar;
    el('reiniciar').onclick = () => { parar(); ir(0); };
    el('proxGap').onclick = () => {
      parar();
      const prox = passos.findIndex((s, k) => k > atual && (fimDaPassada(s) || s.final));
      ir(prox === -1 ? passos.length - 1 : prox);
    };
    el('velocidade').oninput = () => { if (timer) { parar(); tocar(); } };

    document.addEventListener('click', (e) => {
      const b = e.target.closest('.controles button');
      if (b && e.detail > 0) b.blur();
    });

    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.target.closest('.tabela-rolavel')) return;
      if (e.key === ' ' && e.target.closest('button')) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const id = ATALHOS[e.key.toLowerCase()];
      if (!id) return;
      e.preventDefault();
      if (e.repeat && id === 'play') return;
      el(id).click();
    });

    window.addEventListener('resize', mostrar);
    mostrar();
  }

  // Monta a tabela de resumo e devolve a função que mostra as linhas já alcançadas.
  function criarResumo(resumo, rotulo) {
    const tabela = el('resumo');
    tabela.innerHTML = '<tbody>' + resumo.map((r, idx) => {
      const anterior = idx ? resumo[idx - 1].array : null;
      const cels = r.array.map((v, k) => `<td class="${anterior && anterior[k] !== v ? 'mudou' : ''}">${v}</td>`).join('');
      return `<tr data-passo="${r.passo}"><th>${rotulo(r, idx)}</th>${cels}</tr>`;
    }).join('') + '</tbody>';
    const linhas = [...tabela.querySelectorAll('tbody tr')];

    return (atual) => {
      let ultima = null;
      linhas.forEach((tr) => {
        const visivel = Number(tr.dataset.passo) <= atual;
        tr.hidden = !visivel;
        tr.classList.remove('atual');
        if (visivel) ultima = tr;
      });
      if (ultima) ultima.classList.add('atual');
    };
  }

  // Fila de células numeradas; devolve, para cada posição, a célula e a linha de marcadores.
  function criarFila(id, tamanho) {
    const fila = el(id);
    return Array.from({ length: tamanho }, (_, k) => {
      const col = document.createElement('div');
      col.className = 'col';
      col.innerHTML = `<div class="celula"></div><div class="idx">${k}</div><div class="ptr"></div>`;
      fila.appendChild(col);
      return { coluna: col, celula: col.children[0], ptr: col.children[2] };
    });
  }

  // Monta o painel de código; linhas em branco ficam bem mais baixas para economizar espaço.
  function montarCodigo(pre, linhas) {
    pre.innerHTML = linhas.map((t, k) => {
      const vazia = t.trim() === '';
      const texto = t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      return `<span class="linha${vazia ? ' vazia' : ''}" data-n="${k + 1}">${texto || ' '}</span>`;
    }).join('');
  }

  // Destaca a linha em execução e rola o painel de código até ela, se estiver fora da vista.
  function destacarLinha(pre, numero) {
    let ativa = null;
    pre.querySelectorAll('.linha').forEach((l) => {
      const on = Number(l.dataset.n) === numero;
      l.classList.toggle('ativa', on);
      if (on) ativa = l;
    });
    if (!ativa) return;
    const fora = ativa.offsetTop < pre.scrollTop || ativa.offsetTop + ativa.offsetHeight > pre.scrollTop + pre.clientHeight;
    if (fora) pre.scrollTop = ativa.offsetTop - pre.clientHeight / 2;
  }

  function iniciarFormulario() {
    const form = el('form');
    const vmin = Number(form.dataset.vmin);
    const vmax = Number(form.dataset.vmax);

    function gerarAleatorio() {
      const campo = el('tam');
      const n = Math.min(Math.max(parseInt(campo.value, 10) || 8, 2), Number(campo.max));
      const unicos = new Set();
      while (unicos.size < n) unicos.add(vmin + Math.floor(Math.random() * (vmax - vmin + 1)));
      const nums = [...unicos];
      el('array').value = nums.join(', ');
      form.submit();
    }

    function atualizarModo(modo) {
      form.querySelectorAll('.opcao').forEach((o) => { o.hidden = o.dataset.modo !== modo; });
      // Desabilita apenas o tamanho; array também envia o vetor aleatório.
      el('tam').disabled = modo !== 'aleatorio';
    }

    atualizarModo(el('modo').value);

    el('modo').addEventListener('change', (e) => {
      const modo = e.target.value;
      atualizarModo(modo);
      if (modo === 'padrao') form.submit();
      else if (modo === 'aleatorio') gerarAleatorio();
      else el('array').focus();
    });

    form.addEventListener('submit', (e) => {
      if (el('modo').value !== 'aleatorio') return;
      e.preventDefault();
      gerarAleatorio();
    });

    el('aleatorio').onclick = gerarAleatorio;
  }

  return { el, CORES, lerDados, marcador, atualizarCampos, iniciarPlayer, criarResumo, criarFila, montarCodigo, destacarLinha, iniciarFormulario };
})();
