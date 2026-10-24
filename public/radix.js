const { passos, resumo, codigo: linhasCodigo } = Comum.lerDados();

const { NEUTRO, VAZIO, AZUL, LARANJA, VERDE } = Comum.CORES;

const { el, marcador } = Comum;
const n = passos[0].array.length;
const digitos = String(Math.max(...passos[0].array)).length;
const codigo = el('codigo');

// Células mais largas quando há valores com muitos dígitos.
document.documentElement.style.setProperty('--w-celula', `${Math.max(44, digitos * 11 + 14)}px`);

Comum.montarCodigo(codigo, linhasCodigo);

const filaA = Comum.criarFila('fila-a', n);
const filaC = Comum.criarFila('fila-c', 10);
const filaS = Comum.criarFila('fila-s', n);

// Preenche com zeros à esquerda e destaca o dígito da posição exp.
function formatar(valor, exp) {
  const s = String(valor);
  const zeros = digitos - s.length;
  const alvo = exp ? digitos - 1 - Math.round(Math.log10(exp)) : -1;
  return [...s.padStart(digitos, '0')]
    .map((ch, k) => `<span class="${k < zeros ? 'zero' : ''} ${k === alvo ? 'dig' : ''}">${ch}</span>`)
    .join('');
}

const atualizarResumo = Comum.criarResumo(resumo, (r, idx) => (r.exp === null ? 'Vetor Inicial' : `Passada ${idx} (exp = ${r.exp})`));

function render(p, atual) {
  const indiceNoContador = p.tipo === 'for2' || p.tipo === 'acum';

  filaA.forEach((c, k) => {
    c.celula.innerHTML = formatar(p.array[k], p.exp);
    c.celula.style.background = p.final ? VERDE : p.focoA === k ? AZUL : NEUTRO;
    c.ptr.innerHTML = p.focoA === k && !indiceNoContador ? marcador('ptr-i', 'i') : '';
  });

  filaC.forEach((c, k) => {
    if (!p.contagem) {
      c.celula.textContent = '—';
      c.celula.style.background = VAZIO;
      c.ptr.innerHTML = '';
      return;
    }
    c.celula.textContent = p.contagem[k];
    c.celula.style.background = p.focoC === k ? LARANJA : NEUTRO;
    c.ptr.innerHTML = (p.digito === k ? marcador('ptr-d', 'digito') : '') + (indiceNoContador && p.focoC === k ? marcador('ptr-i', 'i') : '');
  });

  filaS.forEach((c, k) => {
    if (!p.saida) {
      c.celula.textContent = '—';
      c.celula.style.background = VAZIO;
      c.ptr.innerHTML = '';
      return;
    }
    const v = p.saida[k];
    c.celula.innerHTML = v === null ? '<span class="zero">0</span>' : formatar(v, p.exp);
    c.celula.style.background = p.focoS === k ? VERDE : NEUTRO;
    c.ptr.innerHTML = p.posicao === k ? marcador('ptr-p', 'posicao') : '';
  });

  Comum.atualizarCampos({
    maior: p.maior, exp: p.exp, i: p.i, digito: p.digito, posicao: p.posicao,
    comps: p.comps, movs: p.movs, explicacao: p.texto,
  });

  atualizarResumo(atual);
  Comum.destacarLinha(codigo, p.linha);
}

Comum.iniciarFormulario();
Comum.iniciarPlayer({ passos, render, fimDaPassada: (s) => s.tipo === 'fimFor4' });
