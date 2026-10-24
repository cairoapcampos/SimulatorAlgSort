const { passos, resumo, codigo: linhasCodigo } = Comum.lerDados();

const { NEUTRO, AZUL, LARANJA, VERMELHO, VERDE, AMARELO, FUNDO } = Comum.CORES;

const { el, marcador } = Comum;
const n = passos[0].array.length;
const codigo = el('codigo');

Comum.montarCodigo(codigo, linhasCodigo);
const filaA = Comum.criarFila('fila-a', n);

// Árvore binária: o nó k tem filhos 2k+1 e 2k+2.
const LARGURA = 520;
const DY = 50;
const RAIO = 15;
const niveis = Math.floor(Math.log2(n)) + 1;
const svg = el('arvore');
svg.setAttribute('viewBox', `0 0 ${LARGURA} ${(niveis - 1) * DY + 2 * RAIO + 16}`);

function posicao(k) {
  const nivel = Math.floor(Math.log2(k + 1));
  const ordem = k + 1 - 2 ** nivel;
  return { x: ((ordem + 0.5) * LARGURA) / 2 ** nivel, y: RAIO + 8 + nivel * DY };
}

const NS = 'http://www.w3.org/2000/svg';
const criar = (tag, atributos) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(atributos).forEach(([nome, valor]) => e.setAttribute(nome, valor));
  return e;
};

const arestas = Array.from({ length: n }, (_, k) => {
  if (k === 0) return null;
  const a = posicao((k - 1) >> 1);
  const b = posicao(k);
  const linha = criar('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: '#64748b', 'stroke-width': 2 });
  svg.appendChild(linha);
  return linha;
});

const nos = Array.from({ length: n }, (_, k) => {
  const { x, y } = posicao(k);
  const grupo = criar('g', {});
  const circulo = criar('circle', { cx: x, cy: y, r: RAIO, 'stroke-width': 2 });
  const texto = criar('text', { x, y: y + 4, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#fff' });
  grupo.append(circulo, texto);
  svg.appendChild(grupo);
  return { grupo, circulo, texto };
});

const atualizarResumo = Comum.criarResumo(resumo, (r) => r.rotulo);

function render(p, atual) {
  const corDe = (k) => {
    if (p.final || k >= p.ordenadoDe) return VERDE;
    if (p.trocando && p.trocando.includes(k)) return VERMELHO;
    if (k === p.maior && k !== p.i) return LARANJA;
    if (k === p.i) return AZUL;
    return NEUTRO;
  };

  nos.forEach((no, k) => {
    const ordenado = p.final || k >= p.ordenadoDe;
    const filho = (k === p.esq || k === p.dir) && !ordenado;
    no.circulo.setAttribute('fill', corDe(k));
    no.circulo.setAttribute('stroke', filho ? AMARELO : FUNDO);
    no.circulo.setAttribute('stroke-width', filho ? 3 : 2);
    no.texto.textContent = p.array[k];
    no.grupo.setAttribute('opacity', ordenado && !p.final ? 0.55 : 1);
    if (arestas[k]) arestas[k].setAttribute('opacity', ordenado && !p.final ? 0.25 : 1);
  });

  filaA.forEach((c, k) => {
    const ordenado = p.final || k >= p.ordenadoDe;
    c.celula.textContent = p.array[k];
    c.celula.style.background = corDe(k);
    c.celula.style.outline = (k === p.esq || k === p.dir) && !ordenado ? `3px solid ${AMARELO}` : 'none';
    c.celula.style.outlineOffset = '-3px';
    c.ptr.innerHTML = (p.i === k ? marcador('tag-i', 'i') : '')
      + (p.maior === k ? marcador('tag-maior', 'maior') : '')
      + (p.esq === k ? marcador('tag-lado', 'esq') : '')
      + (p.dir === k ? marcador('tag-lado', 'dir') : '');
  });

  Comum.atualizarCampos({
    tamHeap: p.tam, i: p.i, maior: p.maior, esq: p.esq, dir: p.dir,
    comps: p.comps, movs: p.movs, explicacao: p.texto,
  });
  el('pilha').innerHTML = p.pilha.length
    ? p.pilha.map((f) => `<span class="chip-pilha">${f}</span>`).join(' → ')
    : '<em>vazia</em>';

  atualizarResumo(atual);
  Comum.destacarLinha(codigo, p.linha);
}

Comum.iniciarFormulario();
const finsDePassada = new Set(resumo.slice(1).map((r) => passos[r.passo]));
Comum.iniciarPlayer({ passos, render, fimDaPassada: (s) => finsDePassada.has(s) });
