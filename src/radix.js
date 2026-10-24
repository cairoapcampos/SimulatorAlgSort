const { carregar } = require('./codigo');

const cod = carregar('RadixSort.py');

// Descobre o número (1-based) de cada linha usada nos passos.
function lerLinhas() {
  const { achar } = cod;

  const L = {
    defCS: achar('def counting_sort(A, n, exp):'),
    saida: achar('saida = [0] * n'),
    contagem: achar('contagem = [0] * 10'),
    for1: achar('for i in range(n):', 0),
    digito1: achar('digito = (A[i] // exp) % 10', 0),
    conta: achar('contagem[digito] += 1'),
    for2: achar('for i in range(1, 10):'),
    acum: achar('contagem[i] += contagem[i - 1]'),
    iInicial: achar('i = n - 1'),
    while3: achar('while i >= 0:'),
    digito3: achar('digito = (A[i] // exp) % 10', 1),
    posicao: achar('posicao = contagem[digito] - 1'),
    coloca: achar('saida[posicao] = A[i]'),
    decr: achar('contagem[digito] -= 1'),
    decI: achar('i -= 1'),
    for4: achar('for i in range(n):', 1),
    copia: achar('A[i] = saida[i]'),
    defRadix: achar('def radix_sort(A, n):'),
    se: achar('if n <= 1:'),
    retornoCedo: achar('return A', 0),
    maior: achar('maior = A[0]'),
    forMaior: achar('for i in range(1, n):'),
    cmpMaior: achar('if A[i] > maior:'),
    atualizaMaior: achar('maior = A[i]'),
    exp: achar('exp = 1'),
    whileExp: achar('while maior // exp > 0:'),
    chamaCS: achar('counting_sort(A, n, exp)'),
    mulExp: achar('exp *= 10'),
    retorno: achar('return A', 1),
    vetor: cod.vetor,
    print: achar('print(radix_sort(A, len(A)))'),
  };
  return L;
}

const L = lerLinhas();
const { vetorPadrao } = cod;

function gerarPassos(entrada) {
  const A = [...entrada];
  const n = A.length;
  const passos = [];
  const resumo = [{ exp: null, array: [...A], passo: 0 }];
  const ctx = { maior: null, exp: null, i: null, digito: null, posicao: null, passada: 0, comps: 0, movs: 0 };
  let saida = null;
  let contagem = null;
  const lista = (v) => `[${v.join(', ')}]`;

  const reg = (extra) => passos.push({
    array: [...A],
    saida: saida && [...saida],
    contagem: contagem && [...contagem],
    ...ctx,
    focoA: null,
    focoC: null,
    focoS: null,
    ...extra,
  });

  reg({ tipo: 'vetor', linha: L.vetor, texto: `A = ${lista(A)}` });
  reg({ tipo: 'chamada', linha: L.print, texto: `print(radix_sort(A, len(A)))\nprint(radix_sort(A, ${n}))` });
  reg({ tipo: 'def', linha: L.defRadix, texto: `def radix_sort(A, n)\nA = ${lista(A)}\nn = ${n}` });

  if (n <= 1) {
    reg({ tipo: 'se', linha: L.se, texto: `Se n <= 1\nSe ${n} <= 1\nA condição é verdadeira` });
    reg({ tipo: 'retorno', linha: L.retornoCedo, texto: `return A\nreturn ${lista(A)}`, final: true });
    return { passos, resumo, codigo: cod.comVetor(A) };
  }
  reg({ tipo: 'se', linha: L.se, texto: `Se n <= 1\nSe ${n} <= 1\nA condição é falsa: continua` });

  ctx.maior = A[0];
  reg({ tipo: 'maior', linha: L.maior, texto: `maior = A[0]\nmaior = ${A[0]}`, focoA: 0 });

  for (let k = 1; k < n; k++) {
    ctx.i = k;
    reg({ tipo: 'forMaior', linha: L.forMaior, texto: `for i in range(1, n)\nfor i in range(1, ${n})\ni = ${k}`, focoA: k });
    const maiorQue = A[k] > ctx.maior;
    ctx.comps++;
    reg({
      tipo: 'cmpMaior',
      linha: L.cmpMaior,
      texto: `Se A[i] > maior\nSe A[${k}] > ${ctx.maior}\nSe ${A[k]} > ${ctx.maior}\n${maiorQue ? 'A condição é verdadeira' : 'A condição é falsa'}`,
      focoA: k,
    });
    if (maiorQue) {
      ctx.maior = A[k];
      reg({ tipo: 'atualizaMaior', linha: L.atualizaMaior, texto: `maior = A[i]\nmaior = A[${k}]\nmaior = ${A[k]}`, focoA: k });
    }
  }
  ctx.i = null;
  reg({ tipo: 'fimForMaior', linha: L.forMaior, texto: `for i in range(1, n)\nfor i in range(1, ${n})\nNão há mais valores de i: sai do laço` });

  ctx.exp = 1;
  reg({ tipo: 'exp', linha: L.exp, texto: 'exp = 1' });

  const digitoDe = (valor, exp) => Math.floor(valor / exp) % 10;
  const textoDigito = (k, exp) => `digito = (A[i] // exp) % 10\ndigito = (A[${k}] // ${exp}) % 10\ndigito = (${A[k]} // ${exp}) % 10\ndigito = ${Math.floor(A[k] / exp)} % 10\ndigito = ${digitoDe(A[k], exp)}`;

  function countingSort(exp) {
    reg({ tipo: 'defCS', linha: L.defCS, texto: `def counting_sort(A, n, exp)\nA = ${lista(A)}\nn = ${n}\nexp = ${exp}` });

    saida = Array(n).fill(null);
    reg({ tipo: 'saida', linha: L.saida, texto: `saida = [0] * n\nsaida = [0] * ${n}\nsaida = ${lista(Array(n).fill(0))}` });
    contagem = Array(10).fill(0);
    reg({ tipo: 'contagem', linha: L.contagem, texto: `contagem = [0] * 10\ncontagem = ${lista(contagem)}` });

    for (let k = 0; k < n; k++) {
      ctx.i = k;
      reg({ tipo: 'for1', linha: L.for1, texto: `for i in range(n)\nfor i in range(${n})\ni = ${k}`, focoA: k });
      const d = digitoDe(A[k], exp);
      ctx.digito = d;
      reg({ tipo: 'digito1', linha: L.digito1, texto: textoDigito(k, exp), focoA: k });
      const antes = contagem[d];
      contagem[d]++;
      reg({ tipo: 'conta', linha: L.conta, texto: `contagem[digito] += 1\ncontagem[${d}] += 1\ncontagem[${d}] = ${antes} + 1\ncontagem[${d}] = ${contagem[d]}`, focoA: k, focoC: d });
    }
    ctx.i = null;
    ctx.digito = null;
    reg({ tipo: 'fimFor1', linha: L.for1, texto: `for i in range(n)\nfor i in range(${n})\nNão há mais valores de i: sai do laço` });

    for (let k = 1; k < 10; k++) {
      ctx.i = k;
      reg({ tipo: 'for2', linha: L.for2, texto: `for i in range(1, 10)\ni = ${k}`, focoC: k });
      const antes = contagem[k];
      contagem[k] += contagem[k - 1];
      reg({
        tipo: 'acum',
        linha: L.acum,
        texto: `contagem[i] += contagem[i - 1]\ncontagem[${k}] += contagem[${k} - 1]\ncontagem[${k}] += contagem[${k - 1}]\ncontagem[${k}] = ${antes} + ${contagem[k - 1]}\ncontagem[${k}] = ${contagem[k]}`,
        focoC: k,
      });
    }
    ctx.i = null;
    reg({ tipo: 'fimFor2', linha: L.for2, texto: 'for i in range(1, 10)\nNão há mais valores de i: sai do laço' });

    ctx.i = n - 1;
    reg({ tipo: 'iInicial', linha: L.iInicial, texto: `i = n - 1\ni = ${n} - 1\ni = ${n - 1}`, focoA: n - 1 });

    while (ctx.i >= 0) {
      const k = ctx.i;
      reg({ tipo: 'while3', linha: L.while3, texto: `Enquanto i >= 0\nEnquanto ${k} >= 0\nA condição é verdadeira`, focoA: k });
      const d = digitoDe(A[k], exp);
      ctx.digito = d;
      reg({ tipo: 'digito3', linha: L.digito3, texto: textoDigito(k, exp), focoA: k });
      const pos = contagem[d] - 1;
      ctx.posicao = pos;
      reg({ tipo: 'posicao', linha: L.posicao, texto: `posicao = contagem[digito] - 1\nposicao = contagem[${d}] - 1\nposicao = ${contagem[d]} - 1\nposicao = ${pos}`, focoA: k, focoC: d });
      saida[pos] = A[k];
      ctx.movs++;
      reg({ tipo: 'coloca', linha: L.coloca, texto: `saida[posicao] = A[i]\nsaida[${pos}] = A[${k}]\nsaida[${pos}] = ${A[k]}`, focoA: k, focoS: pos });
      const antes = contagem[d];
      contagem[d]--;
      reg({ tipo: 'decr', linha: L.decr, texto: `contagem[digito] -= 1\ncontagem[${d}] -= 1\ncontagem[${d}] = ${antes} - 1\ncontagem[${d}] = ${contagem[d]}`, focoC: d });
      ctx.i = k - 1;
      reg({ tipo: 'decI', linha: L.decI, texto: `i -= 1\ni = ${k} - 1\ni = ${k - 1}`, focoA: k - 1 >= 0 ? k - 1 : null });
    }
    ctx.digito = null;
    ctx.posicao = null;
    reg({ tipo: 'fimWhile3', linha: L.while3, texto: `Enquanto i >= 0\nEnquanto ${ctx.i} >= 0\nA condição é falsa: sai do laço` });

    for (let k = 0; k < n; k++) {
      ctx.i = k;
      reg({ tipo: 'for4', linha: L.for4, texto: `for i in range(n)\nfor i in range(${n})\ni = ${k}`, focoA: k, focoS: k });
      A[k] = saida[k];
      ctx.movs++;
      reg({ tipo: 'copia', linha: L.copia, texto: `A[i] = saida[i]\nA[${k}] = saida[${k}]\nA[${k}] = ${A[k]}`, focoA: k, focoS: k });
    }
    ctx.i = null;
    reg({ tipo: 'fimFor4', linha: L.for4, texto: `for i in range(n)\nfor i in range(${n})\nNão há mais valores de i: sai do laço` });
  }

  while (Math.floor(ctx.maior / ctx.exp) > 0) {
    const q = Math.floor(ctx.maior / ctx.exp);
    reg({ tipo: 'whileExp', linha: L.whileExp, texto: `Enquanto maior // exp > 0\nEnquanto ${ctx.maior} // ${ctx.exp} > 0\nEnquanto ${q} > 0\nA condição é verdadeira` });
    ctx.passada++;
    reg({ tipo: 'chamaCS', linha: L.chamaCS, texto: `counting_sort(A, n, exp)\ncounting_sort(A, ${n}, ${ctx.exp})` });
    countingSort(ctx.exp);
    resumo.push({ exp: ctx.exp, array: [...A], passo: passos.length - 1 });
    saida = null;
    contagem = null;
    const anterior = ctx.exp;
    ctx.exp *= 10;
    reg({ tipo: 'mulExp', linha: L.mulExp, texto: `exp *= 10\nexp = ${anterior} * 10\nexp = ${ctx.exp}` });
  }

  reg({ tipo: 'fimWhileExp', linha: L.whileExp, texto: `Enquanto maior // exp > 0\nEnquanto ${ctx.maior} // ${ctx.exp} > 0\nEnquanto ${Math.floor(ctx.maior / ctx.exp)} > 0\nA condição é falsa: sai do laço` });
  reg({ tipo: 'retorno', linha: L.retorno, texto: `return A\nreturn ${lista(A)}`, final: true });
  reg({ tipo: 'fim', linha: L.print, texto: `print(radix_sort(A, len(A)))\nprint(${lista(A)})`, final: true });

  return { passos, resumo, codigo: cod.comVetor(entrada) };
}

module.exports = { gerarPassos, vetorPadrao };
