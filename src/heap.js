const { carregar } = require('./codigo');

const cod = carregar('HeapSort.py');
const { achar } = cod;

// Número (1-based) de cada linha usada nos passos.
const L = {
  defH: achar('def heapify(A, n, i):'),
  maior: achar('maior = i'),
  esq: achar('esquerda = 2 * i + 1'),
  dir: achar('direita = 2 * i + 2'),
  ifEsq: achar('if esquerda < n and A[esquerda] > A[maior]:'),
  setEsq: achar('maior = esquerda'),
  ifDir: achar('if direita < n and A[direita] > A[maior]:'),
  setDir: achar('maior = direita'),
  ifMaior: achar('if maior != i:'),
  troca: achar('A[i], A[maior] = A[maior], A[i]'),
  rec: achar('heapify(A, n, maior)'),
  defHS: achar('def heap_sort(A, n):'),
  for1: achar('for i in range(n // 2 - 1, -1, -1):'),
  chama1: achar('heapify(A, n, i)'),
  for2: achar('for i in range(n - 1, 0, -1):'),
  troca2: achar('A[0], A[i] = A[i], A[0]'),
  chama2: achar('heapify(A, i, 0)'),
  retorno: achar('return A'),
  vetor: cod.vetor,
  print: achar('print(heap_sort(A, len(A)))'),
};

const { vetorPadrao } = cod;

function gerarPassos(entrada) {
  const A = [...entrada];
  const n = A.length;
  const passos = [];
  const resumo = [{ rotulo: 'Vetor Inicial', array: [...A], passo: 0 }];
  const frames = [];
  let ordenadoDe = n;
  let comps = 0;
  let movs = 0;
  const lista = (v) => `[${v.join(', ')}]`;

  // Cada passo guarda as variáveis do quadro (função) que está no topo da pilha.
  const reg = (extra) => {
    const f = frames[frames.length - 1];
    passos.push({
      array: [...A],
      tam: f ? f.tam : null,
      i: f ? f.i : null,
      maior: f ? f.maior : null,
      esq: f ? f.esq : null,
      dir: f ? f.dir : null,
      ordenadoDe,
      comps,
      movs,
      pilha: frames.map((q) => q.rotulo),
      trocando: null,
      ...extra,
    });
  };

  function testarFilho(frame, nome, linhaIf, linhaSet) {
    const filho = frame[nome === 'esquerda' ? 'esq' : 'dir'];
    const cabecalho = `Se ${nome} < n e A[${nome}] > A[maior]`;
    if (filho >= frame.tam) {
      reg({ tipo: `if_${nome}`, linha: linhaIf, texto: `${cabecalho}\nSe ${filho} < ${frame.tam}\nA primeira condição é falsa, então A[${nome}] > A[maior] não é avaliada` });
      return;
    }
    const ver = A[filho] > A[frame.maior];
    comps++;
    reg({
      tipo: `if_${nome}`,
      linha: linhaIf,
      texto: `${cabecalho}\nSe ${filho} < ${frame.tam} e A[${filho}] > A[${frame.maior}]\nSe ${filho} < ${frame.tam} e ${A[filho]} > ${A[frame.maior]}\n${ver ? 'Ambas as condições são verdadeiras' : 'A segunda condição é falsa'}`,
    });
    if (ver) {
      frame.maior = filho;
      reg({ tipo: `set_${nome}`, linha: linhaSet, texto: `maior = ${nome}\nmaior = ${filho}` });
    }
  }

  function heapify(tam, i, linhaChamada) {
    const frame = { rotulo: `heapify(A, ${tam}, ${i})`, tam, i, maior: null, esq: null, dir: null };
    frames.push(frame);
    reg({ tipo: 'defH', linha: L.defH, texto: `def heapify(A, n, i)\nA = ${lista(A)}\nn = ${tam}\ni = ${i}` });

    frame.maior = i;
    reg({ tipo: 'maior', linha: L.maior, texto: `maior = i\nmaior = ${i}` });

    frame.esq = 2 * i + 1;
    reg({ tipo: 'esq', linha: L.esq, texto: `esquerda = 2 * i + 1\nesquerda = 2 * ${i} + 1\nesquerda = ${frame.esq}` });
    frame.dir = 2 * i + 2;
    reg({ tipo: 'dir', linha: L.dir, texto: `direita = 2 * i + 2\ndireita = 2 * ${i} + 2\ndireita = ${frame.dir}` });

    testarFilho(frame, 'esquerda', L.ifEsq, L.setEsq);
    testarFilho(frame, 'direita', L.ifDir, L.setDir);

    const diferente = frame.maior !== i;
    reg({ tipo: 'ifMaior', linha: L.ifMaior, texto: `Se maior != i\nSe ${frame.maior} != ${i}\n${diferente ? 'A condição é verdadeira' : 'A condição é falsa: a função termina'}` });

    if (diferente) {
      const m = frame.maior;
      const vi = A[i];
      const vm = A[m];
      [A[i], A[m]] = [A[m], A[i]];
      movs++;
      reg({
        tipo: 'troca',
        linha: L.troca,
        texto: `A[i], A[maior] = A[maior], A[i]\nA[${i}], A[${m}] = A[${m}], A[${i}]\nA[${i}], A[${m}] = ${vm}, ${vi}`,
        trocando: [i, m],
      });
      reg({ tipo: 'rec', linha: L.rec, texto: `heapify(A, n, maior)\nheapify(A, ${tam}, ${m})` });
      heapify(tam, m, L.rec);
    }

    frames.pop();
    reg({
      tipo: 'retornoH',
      linha: linhaChamada,
      texto: `${frame.rotulo} termina\nVolta para quem chamou`,
      topo: frames.length === 1,
    });
  }

  reg({ tipo: 'vetor', linha: L.vetor, texto: `A = ${lista(A)}` });
  reg({ tipo: 'chamada', linha: L.print, texto: `print(heap_sort(A, len(A)))\nprint(heap_sort(A, ${n}))` });

  const principal = { rotulo: `heap_sort(A, ${n})`, tam: n, i: null, maior: null, esq: null, dir: null };
  frames.push(principal);
  reg({ tipo: 'def', linha: L.defHS, texto: `def heap_sort(A, n)\nA = ${lista(A)}\nn = ${n}` });

  const meio = Math.floor(n / 2);
  for (let i = meio - 1; i >= 0; i--) {
    principal.i = i;
    reg({
      tipo: 'for1',
      linha: L.for1,
      texto: `for i in range(n // 2 - 1, -1, -1)\nfor i in range(${n} // 2 - 1, -1, -1)\nfor i in range(${meio} - 1, -1, -1)\nfor i in range(${meio - 1}, -1, -1)\ni = ${i}`,
    });
    reg({ tipo: 'chama1', linha: L.chama1, texto: `heapify(A, n, i)\nheapify(A, ${n}, ${i})` });
    heapify(n, i, L.chama1);
  }
  principal.i = null;
  reg({
    tipo: 'fimFor1',
    linha: L.for1,
    texto: `for i in range(n // 2 - 1, -1, -1)\nfor i in range(${meio - 1}, -1, -1)\nNão há mais valores de i: sai do laço`,
  });
  resumo.push({ rotulo: 'Heap máximo construído', array: [...A], passo: passos.length - 1 });

  let extracao = 0;
  for (let i = n - 1; i > 0; i--) {
    extracao++;
    principal.i = i;
    reg({
      tipo: 'for2',
      linha: L.for2,
      texto: `for i in range(n - 1, 0, -1)\nfor i in range(${n} - 1, 0, -1)\nfor i in range(${n - 1}, 0, -1)\ni = ${i}`,
    });
    const v0 = A[0];
    const vi = A[i];
    [A[0], A[i]] = [A[i], A[0]];
    movs++;
    ordenadoDe = i;
    reg({
      tipo: 'troca2',
      linha: L.troca2,
      texto: `A[0], A[i] = A[i], A[0]\nA[0], A[${i}] = A[${i}], A[0]\nA[0], A[${i}] = ${vi}, ${v0}`,
      trocando: [0, i],
    });
    reg({ tipo: 'chama2', linha: L.chama2, texto: `heapify(A, i, 0)\nheapify(A, ${i}, 0)` });
    heapify(i, 0, L.chama2);
    resumo.push({ rotulo: `Extração ${extracao} (i = ${i})`, array: [...A], passo: passos.length - 1 });
  }
  principal.i = null;
  reg({
    tipo: 'fimFor2',
    linha: L.for2,
    texto: `for i in range(n - 1, 0, -1)\nfor i in range(${n - 1}, 0, -1)\nNão há mais valores de i: sai do laço`,
  });

  frames.pop();
  reg({ tipo: 'retorno', linha: L.retorno, texto: `return A\nreturn ${lista(A)}`, final: true });
  reg({ tipo: 'fim', linha: L.print, texto: `print(heap_sort(A, len(A)))\nprint(${lista(A)})`, final: true });

  return { passos, resumo, codigo: cod.comVetor(entrada) };
}

module.exports = { gerarPassos, vetorPadrao };
