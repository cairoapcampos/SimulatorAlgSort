const { carregar } = require('./codigo');

const cod = carregar('ShellSort.py');
const { achar } = cod;

// Número (1-based) de cada linha usada nos passos.
const L = {
  def: achar('def shell_sort(A, n):'),
  gap: achar('gap = n // 2'),
  while: achar('while gap > 0:'),
  for: achar('for i in range(gap, n):'),
  valor: achar('valor = A[i]'),
  j: achar('j = i'),
  cmp: achar('while j >= gap and A[j - gap] > valor:'),
  desloca: achar('A[j] = A[j - gap]'),
  dec: achar('j -= gap'),
  insere: achar('A[j] = valor'),
  metade: achar('gap //= 2'),
  fim: achar('return A'),
  vetor: cod.vetor,
  chamada: achar('print(shell_sort(A, len(A)))'),
};

const { vetorPadrao } = cod;

function gerarPassos(entrada) {
  const A = [...entrada];
  const n = A.length;
  const passos = [];
  const resumo = [{ gap: null, array: [...A], passo: 0 }];
  let comps = 0;
  let movs = 0;
  let valorMao = null;
  const reg = (extra) => passos.push({ array: [...A], gap: null, i: null, j: null, comparando: null, valor: valorMao, comps, movs, ...extra });

  reg({ tipo: 'vetor', linha: L.vetor, texto: `A = [${A.join(', ')}]` });
  reg({ tipo: 'chamada', linha: L.chamada, texto: `print(shell_sort(A, len(A)))\nprint(shell_sort(A, ${n}))` });
  reg({ tipo: 'def', linha: L.def, texto: `def shell_sort(A, n)\nA = [${A.join(', ')}]\nn = ${n}` });

  let gap = Math.floor(n / 2);
  reg({ tipo: 'gap', linha: L.gap, texto: `gap = n // 2\ngap = ${n} // 2\ngap = ${gap}`, gap });

  while (gap > 0) {
    reg({ tipo: 'inicio', linha: L.while, texto: `Enquanto gap > 0\nEnquanto ${gap} > 0\nA condição é verdadeira`, gap });

    for (let i = gap; i < n; i++) {
      const valor = A[i];
      let j = i;
      reg({ tipo: 'for', linha: L.for, texto: `for i in range(gap, n)\nfor i in range(${gap}, ${n})\ni = ${i}`, gap, i });
      valorMao = valor;
      reg({ tipo: 'pegar', linha: L.valor, texto: `valor = A[i]\nvalor = A[${i}]\nvalor = ${valor}`, gap, i });
      reg({ tipo: 'iniciarJ', linha: L.j, texto: `j = i\nj = ${i}`, gap, i, j });

      while (true) {
        if (j < gap) {
          reg({ tipo: 'fimCmp', linha: L.cmp, texto: `Enquanto j >= gap e A[j - gap] > valor\nEnquanto ${j} >= ${gap}\nA primeira condição é falsa, então A[j - gap] > valor não é avaliada: sai do laço`, gap, i, j });
          break;
        }
        const maior = A[j - gap] > valor;
        comps++;
        reg({
          tipo: 'comparar',
          linha: L.cmp,
          texto: `Enquanto j >= gap e A[j - gap] > valor\nEnquanto ${j} >= ${gap} e A[${j} - ${gap}] > ${valor}\nEnquanto ${j} >= ${gap} e A[${j - gap}] > ${valor}\nEnquanto ${j} >= ${gap} e ${A[j - gap]} > ${valor}\n${maior ? 'Ambas as condições são verdadeiras' : 'A segunda condição é falsa: sai do laço'}`,
          gap, i, j, comparando: [j - gap, j],
        });
        if (!maior) break;

        A[j] = A[j - gap];
        movs++;
        reg({ tipo: 'deslocar', linha: L.desloca, texto: `A[j] = A[j - gap]\nA[${j}] = A[${j} - ${gap}]\nA[${j}] = A[${j - gap}]\nA[${j}] = ${A[j]}\nDesloca ${gap} posição(ões) à direita`, gap, i, j, comparando: [j - gap, j] });
        j -= gap;
        reg({ tipo: 'dec', linha: L.dec, texto: `j -= gap\nj = j - gap\nj = ${j + gap} - ${gap}\nj = ${j}`, gap, i, j });
      }

      A[j] = valor;
      reg({ tipo: 'inserir', linha: L.insere, texto: `A[j] = valor\nA[${j}] = valor\nA[${j}] = ${valor}`, gap, i, j, inserido: j });
      valorMao = null;
    }

    reg({ tipo: 'fimFor', linha: L.for, texto: `for i in range(gap, n)\nfor i in range(${gap}, ${n})\nNão há mais valores de i: sai do laço`, gap });
    resumo.push({ gap, array: [...A], passo: passos.length });
    const gapAnterior = gap;
    gap = Math.floor(gap / 2);
    reg({ tipo: 'metade', linha: L.metade, texto: `gap //= 2\ngap = gap // 2\ngap = ${gapAnterior} // 2\ngap = ${gap}`, gap });
  }

  reg({ tipo: 'fimWhile', linha: L.while, texto: `Enquanto gap > 0\nEnquanto ${gap} > 0\nA condição é falsa: sai do laço`, gap });
  reg({ tipo: 'retorno', linha: L.fim, texto: `return A\nreturn [${A.join(', ')}]`, final: true });
  reg({ tipo: 'fim', linha: L.chamada, texto: `print(shell_sort(A, len(A)))\nprint([${A.join(', ')}])`, final: true });
  return { passos, resumo, codigo: cod.comVetor(entrada) };
}

module.exports = { gerarPassos, vetorPadrao };
