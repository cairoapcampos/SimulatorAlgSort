const { passos, resumo, codigo: linhasCodigo } = Comum.lerDados();
const PALETA = ['#8b5cf6', '#0891b2', '#db2777', '#a16207', '#9333ea', '#be123c', '#0d9488', '#4d7c0f'];
const CELULA = 56;
const { NEUTRO, AZUL, LARANJA, VERMELHO, VERDE } = Comum.CORES;

const { el, marcador } = Comum;
const codigo = el('codigo');

Comum.montarCodigo(codigo, linhasCodigo);

const filaA = Comum.criarFila('barras', passos[0].array.length);
let passoAtual;

const atualizarResumo = Comum.criarResumo(resumo, (r, idx) => (r.gap === null ? 'Vetor Inicial' : `Passada ${idx} (gap = ${r.gap})`));

function centro(node, base, topo) {
  const r = node.getBoundingClientRect();
  return { x: r.left + r.width / 2 - base.left, y: (topo ? r.top : r.bottom) - base.top };
}

function desenharSetas(p) {
  const svg = el('setas');
  const base = el('tabuleiro').getBoundingClientRect();
  svg.setAttribute('width', base.width);
  svg.setAttribute('height', base.height);
  let html = '';
  const celula = (k) => filaA[k].celula;
  const arco = (a, b, cor, marcador, rotulo, tracejado) => {
    const pa = centro(celula(a), base, true);
    const pb = centro(celula(b), base, true);
    const h = Math.min(18 + Math.abs(pb.x - pa.x) / CELULA * 6, 50);
    const y = pa.y - 4;
    const mx = (pa.x + pb.x) / 2;
    html += `<path d="M${pa.x},${y} Q${mx},${y - 2 * h} ${pb.x},${y}" fill="none" stroke="${cor}" stroke-width="2.5" ${tracejado ? 'stroke-dasharray="6 4"' : ''} marker-end="url(#${marcador})"/>`;
    html += `<text x="${mx}" y="${y - h - 4}" fill="${cor}" font-size="12" text-anchor="middle">${rotulo}</text>`;
  };
  const linha = (de, para, cor = AZUL, marcador = 'm-valor', rotulo = null, tracejado = false) => {
    html += `<line x1="${de.x}" y1="${de.y}" x2="${para.x}" y2="${para.y}" stroke="${cor}" stroke-width="2.5" ${tracejado ? 'stroke-dasharray="6 4"' : ''} marker-end="url(#${marcador})"/>`;
    if (rotulo) html += `<text x="${(de.x + para.x) / 2}" y="${(de.y + para.y) / 2 - 4}" fill="${cor}" font-size="12" text-anchor="middle">${rotulo}</text>`;
  };
  const caixa = el('caixaValor');

  if (p.tipo === 'comparar') linha(centro(celula(p.comparando[0]), base, true), centro(caixa, base, false), LARANJA, 'm-comp', 'compara', true);
  else if (p.tipo === 'deslocar') arco(p.comparando[0], p.comparando[1], VERMELHO, 'm-desl', 'copia');
  else if (p.tipo === 'pegar') linha(centro(celula(p.i), base, true), centro(caixa, base, false));
  else if (p.tipo === 'inserir') {
    const alvo = centro(celula(p.inserido), base, true);
    linha(centro(caixa, base, false), { x: alvo.x, y: alvo.y - 4 });
  }
  el('setas-g').innerHTML = html;
}

function render(p, atual) {
  passoAtual = p;
  const ativa = p.gap && p.i !== null ? p.i % p.gap : null;
  const grupos = p.gap ? p.gap : 1;

  filaA.forEach(({ coluna, celula, ptr }, k) => {
    const cor = p.gap ? PALETA[k % grupos % PALETA.length] : NEUTRO;
    const comp = p.comparando && (p.tipo === 'comparar' ? p.comparando[0] === k : p.comparando.includes(k));
    const alvoAtual = p.inserido === k || (p.i !== null && p.j === k && !p.comparando);
    celula.textContent = p.array[k];
    celula.style.background = p.final ? VERDE : comp ? LARANJA : alvoAtual ? AZUL : cor;
    coluna.style.opacity = p.final || ativa === null || k % p.gap === ativa ? 1 : 0.4;
    ptr.innerHTML = (p.i === k ? marcador('ptr-i', 'i') : '') + (p.j === k ? marcador('ptr-j', 'j') : '');
  });

  el('caixaValor').textContent = p.valor === null ? '—' : p.valor;
  el('caixaValor').style.borderColor = p.tipo === 'comparar' ? LARANJA : '';
  Comum.atualizarCampos({
    gap: p.gap, i: p.i, j: p.j, comps: p.comps, desl: p.movs, explicacao: p.texto,
  });

  el('grupos').innerHTML = p.gap && !p.final
    ? `Sub-listas (gap ${p.gap}): ` + Array.from({ length: p.gap }, (_, g) => {
        const idx = p.array.map((_, k) => k).filter((k) => k % p.gap === g);
        return `<span class="chip" style="background:${PALETA[g % PALETA.length]}">[${idx.join(', ')}]</span>`;
      }).join(' ')
    : '';

  atualizarResumo(atual);

  Comum.destacarLinha(codigo, p.linha);
  desenharSetas(p);
}

// A rolagem muda a posição das células sem mudar o passo da simulação.
el('barras').addEventListener('scroll', () => {
  if (passoAtual) desenharSetas(passoAtual);
}, { passive: true });

Comum.iniciarFormulario();
Comum.iniciarPlayer({ passos, render, fimDaPassada: (s) => s.tipo === 'metade' });
