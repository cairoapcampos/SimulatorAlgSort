// Exemplos do PDF algs.pdf. Os valores são mantidos separados da apresentação.
const TABELAS_HOME = {
  shell: {
    numero: 1,
    destacarGrupos: true,
    titulo: 'Exemplo de ordenação pelo Shell Sort',
    colunas: [
      { titulo: 'Etapa' },
      { titulo: 'Gap' },
      { titulo: 'Índices das subsequências', grupos: true },
      { titulo: 'Vetor de entrada', vetor: true },
      { titulo: 'Vetor após a passagem', vetor: true },
    ],
    linhas: [
      ['1ª passagem', 4, [[0, 4], [1, 5], [2, 6], [3, 7]], [8, 3, 7, 4, 6, 2, 5, 1], [6, 2, 5, 1, 8, 3, 7, 4]],
      ['2ª passagem', 2, [[0, 2, 4, 6], [1, 3, 5, 7]], [6, 2, 5, 1, 8, 3, 7, 4], [5, 1, 6, 2, 7, 3, 8, 4]],
      ['3ª passagem', 1, [[0, 1, 2, 3, 4, 5, 6, 7]], [5, 1, 6, 2, 7, 3, 8, 4], [1, 2, 3, 4, 5, 6, 7, 8]],
    ],
  },
  heapConstrucao: {
    numero: 2,
    titulo: 'Exemplo de construção do max-heap',
    colunas: [
      { titulo: 'Índice (i)' },
      { titulo: 'Vetor de entrada', vetor: true },
      { titulo: 'Operação realizada' },
      { titulo: 'Vetor após heapify', vetor: true },
    ],
    linhas: [
      [3, [8, 3, 7, 4, 6, 2, 5, 1], 'Compara 4 com seu filho 1. Não há troca.', [8, 3, 7, 4, 6, 2, 5, 1]],
      [2, [8, 3, 7, 4, 6, 2, 5, 1], 'Compara 7 com seus filhos 2 e 5. Não há troca.', [8, 3, 7, 4, 6, 2, 5, 1]],
      [1, [8, 3, 7, 4, 6, 2, 5, 1], 'Compara 3 com seus filhos 4 e 6. Troca 3 por 6.', [8, 6, 7, 4, 3, 2, 5, 1]],
      [0, [8, 6, 7, 4, 3, 2, 5, 1], 'Compara 8 com seus filhos 6 e 7. Não há troca.', [8, 6, 7, 4, 3, 2, 5, 1]],
    ],
  },
  heapOrdenacao: {
    numero: 3,
    titulo: 'Exemplo de ordenação pelo Heap Sort',
    colunas: [
      { titulo: 'Passagem' },
      { titulo: 'Vetor de entrada', vetor: true },
      { titulo: 'Vetor após a troca da raiz', vetor: true },
      { titulo: 'Vetor após heapify (1ª chamada)', vetor: true },
      { titulo: 'Vetor após heapify (2ª chamada)', vetor: true },
      { titulo: 'Vetor após heapify (3ª chamada)', vetor: true },
    ],
    explicacao: 'A coluna “Vetor após a troca da raiz” mostra a troca feita na função principal do Heap Sort, antes de chamar heapify. As três colunas seguintes mostram as etapas de heapify, da chamada inicial às chamadas recursivas. Se uma chamada não fizer troca, o vetor permanece igual ao da coluna anterior. O símbolo “—” indica que essa chamada não ocorreu.',
    linhas: [
      ['1ª', '[8, 6, 7, 4, 3, 2, 5, 1]', '[1, 6, 7, 4, 3, 2, 5 | 8]', '[7, 6, 1, 4, 3, 2, 5 | 8]', '[7, 6, 5, 4, 3, 2, 1 | 8]', '[7, 6, 5, 4, 3, 2, 1 | 8]'],
      ['2ª', '[7, 6, 5, 4, 3, 2, 1 | 8]', '[1, 6, 5, 4, 3, 2 | 7, 8]', '[6, 1, 5, 4, 3, 2 | 7, 8]', '[6, 4, 5, 1, 3, 2 | 7, 8]', '[6, 4, 5, 1, 3, 2 | 7, 8]'],
      ['3ª', '[6, 4, 5, 1, 3, 2 | 7, 8]', '[2, 4, 5, 1, 3 | 6, 7, 8]', '[5, 4, 2, 1, 3 | 6, 7, 8]', '[5, 4, 2, 1, 3 | 6, 7, 8]', null],
      ['4ª', '[5, 4, 2, 1, 3 | 6, 7, 8]', '[3, 4, 2, 1 | 5, 6, 7, 8]', '[4, 3, 2, 1 | 5, 6, 7, 8]', '[4, 3, 2, 1 | 5, 6, 7, 8]', null],
      ['5ª', '[4, 3, 2, 1 | 5, 6, 7, 8]', '[1, 3, 2 | 4, 5, 6, 7, 8]', '[3, 1, 2 | 4, 5, 6, 7, 8]', '[3, 1, 2 | 4, 5, 6, 7, 8]', null],
      ['6ª', '[3, 1, 2 | 4, 5, 6, 7, 8]', '[2, 1 | 3, 4, 5, 6, 7, 8]', '[2, 1 | 3, 4, 5, 6, 7, 8]', null, null],
      ['7ª', '[2, 1 | 3, 4, 5, 6, 7, 8]', '[1 | 2, 3, 4, 5, 6, 7, 8]', '[1, 2, 3, 4, 5, 6, 7, 8]', null, null],
    ],
  },
  radix: {
    numero: 4,
    destacarDigito: true,
    titulo: 'Exemplo de ordenação pelo Radix Sort usando a estratégia LSD',
    colunas: [
      { titulo: 'Etapa' },
      { titulo: 'Posição decimal' },
      { titulo: 'Vetor de entrada', vetor: true },
      { titulo: 'Vetor após a passagem', vetor: true },
    ],
    linhas: [
      ['1ª passagem', 'Unidades', [329, 45, 7, 839, 1436, 72, 20355], [72, 45, 20355, 1436, 7, 329, 839]],
      ['2ª passagem', 'Dezenas', [72, 45, 20355, 1436, 7, 329, 839], [7, 329, 1436, 839, 45, 20355, 72]],
      ['3ª passagem', 'Centenas', [7, 329, 1436, 839, 45, 20355, 72], [7, 45, 72, 329, 20355, 1436, 839]],
      ['4ª passagem', 'Unidades de milhar', [7, 45, 72, 329, 20355, 1436, 839], [7, 45, 72, 329, 20355, 839, 1436]],
      ['5ª passagem', 'Dezenas de milhar', [7, 45, 72, 329, 20355, 839, 1436], [7, 45, 72, 329, 839, 1436, 20355]],
    ],
  },
};

// Compara posições com o vetor anterior da mesma linha, preservando o separador do PDF.
function prepararVetor(valor, anterior, posicaoDecimal = null) {
  const numeros = (v) => Array.isArray(v) ? v : (v.match(/\d+/g) || []).map(Number);
  const valores = numeros(valor);
  const antes = anterior === null ? null : numeros(anterior);
  const separador = typeof valor === 'string' ? valor.indexOf('|') : -1;
  const separaEm = separador < 0 ? null : numeros(valor.slice(0, separador)).length;
  return {
    separaEm,
    valores: valores.map((numero, k) => {
      const texto = String(numero);
      const alvo = posicaoDecimal === null ? -1 : texto.length - 1 - posicaoDecimal;
      return {
        numero,
        mudou: posicaoDecimal === null && antes !== null && antes[k] !== numero,
        digitos: posicaoDecimal === null ? null : [...texto].map((digito, indice) => ({
          texto: digito,
          ativo: indice === alvo,
        })),
      };
    }),
  };
}

module.exports = { TABELAS_HOME, prepararVetor };
